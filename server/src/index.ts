import express from "express"
import path from "path"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import { createRoom, addPlayer, getRoom } from "./roomManager"

const app = express()
app.use(cors())

const clientBuildPath = path.join(__dirname, "../public")
app.use(express.static(clientBuildPath))

const httpServer = createServer(app)
const io = new Server(httpServer, { 
  cors: { 
    origin: "*",
    methods: ["GET", "POST"]
  } 
})

// Track skip votes per room: roomId -> Set of playerIds who voted
const skipVotes: Record<string, Set<string>> = {}

io.on("connection", socket => {
  console.log("New socket connection:", socket.id)

  socket.on("create_room", ({ settings, hostName }) => {
    try {
      const room = createRoom(socket.id, settings)
      const hostPlayer = addPlayer(room.id, hostName)
      socket.join(room.id)
      skipVotes[room.id] = new Set()
      socket.emit("room_created", { room, hostPlayer })
      socket.emit("room_updated", room)
      console.log(`Room created: ${room.id} by ${hostName}`)
    } catch (error) {
      console.error("Error creating room:", error)
      socket.emit("error", { message: "Failed to create room" })
    }
  })

  socket.on("join_room", ({ roomId, name }) => {
    try {
      const normalizedId = roomId.toUpperCase().trim()
      const room = getRoom(normalizedId)
      if (!room) {
        socket.emit("error", { message: "Room not found. Check the code and try again." })
        return
      }
      const player = addPlayer(normalizedId, name)
      if (player) {
        socket.join(normalizedId)
        socket.emit("player_joined", player)
        io.to(normalizedId).emit("room_updated", getRoom(normalizedId))
        console.log(`${name} joined room ${normalizedId}`)
      }
    } catch (error) {
      console.error("Error joining room:", error)
      socket.emit("error", { message: "Failed to join room" })
    }
  })

  socket.on("get_room", ({ roomId }) => {
    try {
      const normalizedId = roomId.toUpperCase().trim()
      const room = getRoom(normalizedId)
      if (room) {
        socket.emit("room_updated", room)
        if (room.phase === "trailer" && skipVotes[normalizedId]) {
          socket.emit("skip_votes_updated", {
            skipVotes: skipVotes[normalizedId].size,
            totalPlayers: room.players.length
          })
        }
      } else {
        socket.emit("error", { message: "Room not found" })
      }
    } catch (error) {
      console.error("Error getting room:", error)
    }
  })

  socket.on("start_game", ({ roomId }) => {
    try {
      const room = getRoom(roomId)
      if (room && room.hostId === socket.id) {
        room.phase = "trailer"
        room.currentTurnIndex = 0
        skipVotes[roomId] = new Set()

        if (room.deck.length > 0) {
          const firstMovie = room.deck.pop()
          if (firstMovie) {
            room.currentMovie = firstMovie
          }
        }

        io.to(roomId).emit("phase_changed", "trailer")
        io.to(roomId).emit("room_updated", room)
        io.to(roomId).emit("trailer_started", room.currentMovie)
        io.to(roomId).emit("skip_votes_updated", { skipVotes: 0, totalPlayers: room.players.length })
        console.log(`Game started in room ${roomId}`)
      }
    } catch (error) {
      console.error("Error starting game:", error)
    }
  })

  socket.on("vote_skip", ({ roomId, playerId }) => {
    try {
      const room = getRoom(roomId)
      if (!room || room.phase !== "trailer") return

      if (!skipVotes[roomId]) skipVotes[roomId] = new Set()
      skipVotes[roomId].add(playerId)

      const votes = skipVotes[roomId].size
      const total = room.players.length

      io.to(roomId).emit("skip_votes_updated", { skipVotes: votes, totalPlayers: total })

      // Skip if majority votes (more than half)
      if (votes > total / 2) {
        endTrailer(roomId)
      }
    } catch (error) {
      console.error("Error voting to skip:", error)
    }
  })

  socket.on("trailer_finished", ({ roomId }) => {
    endTrailer(roomId)
  })

  socket.on("place_movie", ({ roomId, playerId, sourceIndex, destinationIndex }) => {
    try {
      const room = getRoom(roomId)
      if (!room) return

      const currentPlayer = room.players[room.currentTurnIndex]
      if (currentPlayer.id !== playerId) {
        socket.emit("error", { message: "Not your turn!" })
        return
      }

      const player = room.players.find(p => p.id === playerId)
      if (player && player.timeline.length > 0) {
        const [removed] = player.timeline.splice(sourceIndex, 1)
        player.timeline.splice(destinationIndex, 0, removed)

        const isCorrect = player.timeline.every((movie, idx) => {
          if (idx === 0) return true
          return movie.year >= player.timeline[idx - 1].year
        })

        if (isCorrect) {
          player.score += 1
          if (player.score >= room.settings.winScore) {
            room.phase = "finished"
            io.to(roomId).emit("phase_changed", "finished")
            io.to(roomId).emit("room_updated", room)
            io.to(roomId).emit("game_over", {
              winner: player,
              finalScores: room.players.map(p => ({ name: p.name, score: p.score }))
            })
            console.log(`Game finished. Winner: ${player.name}`)
            return
          }
        } else {
          const incorrectMovie = player.timeline.splice(destinationIndex, 1)[0]
          room.discardPile.push(incorrectMovie)
        }

        // Advance turn and show next trailer
        room.currentTurnIndex = (room.currentTurnIndex + 1) % room.players.length
        startNextTrailer(roomId)

        console.log(`Player ${playerId} placed movie. Correct: ${isCorrect}`)
      }
    } catch (error) {
      console.error("Error placing movie:", error)
    }
  })

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id)
  })
})

function endTrailer(roomId: string) {
  const room = getRoom(roomId)
  if (!room || room.phase !== "trailer") return

  const currentPlayer = room.players[room.currentTurnIndex]
  if (currentPlayer && room.currentMovie) {
    currentPlayer.timeline.push(room.currentMovie)
    room.phase = "placement"
    skipVotes[roomId] = new Set()

    io.to(roomId).emit("phase_changed", "placement")
    io.to(roomId).emit("room_updated", room)
    io.to(roomId).emit("turn_changed", {
      currentTurnIndex: room.currentTurnIndex,
      currentPlayer
    })
    console.log(`Trailer ended. ${currentPlayer.name}'s turn to place.`)
  }
}

function startNextTrailer(roomId: string) {
  const room = getRoom(roomId)
  if (!room) return

  if (room.deck.length > 0) {
    const nextMovie = room.deck.pop()
    if (nextMovie) {
      room.currentMovie = nextMovie
    }
    room.phase = "trailer"
    skipVotes[roomId] = new Set()

    io.to(roomId).emit("phase_changed", "trailer")
    io.to(roomId).emit("room_updated", room)
    io.to(roomId).emit("trailer_started", room.currentMovie)
    io.to(roomId).emit("skip_votes_updated", { skipVotes: 0, totalPlayers: room.players.length })
  }
}

app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"))
})

const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📁 Serving client files from: ${clientBuildPath}`)
})


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
  cors: { origin: "*", methods: ["GET", "POST"] }
})

io.on("connection", socket => {
  console.log("New connection:", socket.id)

  socket.on("create_room", ({ settings, hostName }) => {
    try {
      const room = createRoom(socket.id, settings)
      const hostPlayer = addPlayer(room.id, hostName)
      socket.join(room.id)
      socket.emit("room_created", { room, hostPlayer })
      socket.emit("room_updated", room)
      console.log(`Room created: ${room.id} by ${hostName}`)
    } catch (err) {
      console.error("create_room error:", err)
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
    } catch (err) {
      console.error("join_room error:", err)
      socket.emit("error", { message: "Failed to join room" })
    }
  })

  socket.on("get_room", ({ roomId }) => {
    try {
      const normalizedId = roomId.toUpperCase().trim()
      const room = getRoom(normalizedId)
      if (room) {
        socket.emit("room_updated", room)
      } else {
        socket.emit("error", { message: "Room not found" })
      }
    } catch (err) {
      console.error("get_room error:", err)
    }
  })

  socket.on("start_game", ({ roomId }) => {
    try {
      const room = getRoom(roomId)
      if (!room || room.hostId !== socket.id) return

      room.currentTurnIndex = 0
      room.phase = "trailer"

      if (room.deck.length > 0) {
        room.currentMovie = room.deck.pop()!
      }

      io.to(roomId).emit("phase_changed", "trailer")
      io.to(roomId).emit("trailer_started", room.currentMovie)
      io.to(roomId).emit("room_updated", room)
      console.log(`Game started: ${roomId}`)
    } catch (err) {
      console.error("start_game error:", err)
    }
  })

  // Host-only: end game at any time
  socket.on("end_game", ({ roomId }) => {
    try {
      const room = getRoom(roomId)
      if (!room || room.hostId !== socket.id) return

      room.phase = "finished"
      // Determine winner by score
      const winner = room.players.reduce((a, b) => b.score > a.score ? b : a)
      io.to(roomId).emit("phase_changed", "finished")
      io.to(roomId).emit("room_updated", room)
      io.to(roomId).emit("game_over", {
        winner,
        finalScores: room.players.map(p => ({ name: p.name, score: p.score }))
      })
      console.log(`Game ended by host in room ${roomId}`)
    } catch (err) {
      console.error("end_game error:", err)
    }
  })

  // Host-only: called when host clicks Skip or trailer auto-ends
  socket.on("trailer_finished", ({ roomId }) => {
    try {
      const room = getRoom(roomId)
      if (!room || room.phase !== "trailer") return

      const currentPlayer = room.players[room.currentTurnIndex]
      if (!currentPlayer || !room.currentMovie) return

      // Give the current player this movie
      currentPlayer.timeline.push(room.currentMovie)
      room.currentMovie = undefined
      room.phase = "placement"

      io.to(roomId).emit("phase_changed", "placement")
      io.to(roomId).emit("room_updated", room)
      io.to(roomId).emit("turn_changed", {
        currentTurnIndex: room.currentTurnIndex,
        currentPlayer
      })
      console.log(`Trailer ended → ${currentPlayer.name} placing now`)
    } catch (err) {
      console.error("trailer_finished error:", err)
    }
  })

  socket.on("place_movie", ({ roomId, playerId, sourceIndex, destinationIndex }) => {
    try {
      const room = getRoom(roomId)
      if (!room || room.phase !== "placement") return

      const currentPlayer = room.players[room.currentTurnIndex]
      if (!currentPlayer || currentPlayer.id !== playerId) {
        socket.emit("error", { message: "Not your turn!" })
        return
      }

      // Reorder the timeline
      const [moved] = currentPlayer.timeline.splice(sourceIndex, 1)
      currentPlayer.timeline.splice(destinationIndex, 0, moved)

      // Check if entire timeline is in chronological order
      const isCorrect = currentPlayer.timeline.every((movie, idx) => {
        if (idx === 0) return true
        return movie.year >= currentPlayer.timeline[idx - 1].year
      })

      if (isCorrect) {
        currentPlayer.score += 1
        console.log(`Correct! ${currentPlayer.name} now has ${currentPlayer.score} points`)

        // Check for winner — still show reveal first, then game_over
        if (currentPlayer.score >= room.settings.winScore) {
          room.phase = "reveal"
          io.to(roomId).emit("movie_reveal", {
            movie: moved,
            playerName: currentPlayer.name,
            isCorrect: true,
            newScore: currentPlayer.score,
            isWinner: true
          })
          io.to(roomId).emit("phase_changed", "reveal")
          io.to(roomId).emit("room_updated", room)
          // game_over is sent when host dismisses reveal via continue_game
          console.log(`Game over! Winner: ${currentPlayer.name}`)
          return
        }
      } else {
        // Wrong placement — discard the moved card
        const [discarded] = currentPlayer.timeline.splice(destinationIndex, 1)
        room.discardPile.push(discarded)
        console.log(`Wrong placement by ${currentPlayer.name}`)
      }

      // Advance turn
      room.currentTurnIndex = (room.currentTurnIndex + 1) % room.players.length

      // Show reveal dialog to everyone before moving on
      room.phase = "reveal"
      io.to(roomId).emit("movie_reveal", {
        movie: moved,
        playerName: currentPlayer.name,
        isCorrect,
        newScore: currentPlayer.score
      })
      io.to(roomId).emit("phase_changed", "reveal")
      io.to(roomId).emit("room_updated", room)
    } catch (err) {
      console.error("place_movie error:", err)
    }
  })

  // Host-only: dismiss reveal dialog and continue
  socket.on("continue_game", ({ roomId }) => {
    try {
      const room = getRoom(roomId)
      if (!room || room.hostId !== socket.id || room.phase !== "reveal") return

      // Check if someone already won (score hit winScore before we got here)
      const winner = room.players.find(p => p.score >= room.settings.winScore)
      if (winner) {
        room.phase = "finished"
        io.to(roomId).emit("phase_changed", "finished")
        io.to(roomId).emit("room_updated", room)
        io.to(roomId).emit("game_over", {
          winner,
          finalScores: room.players.map(p => ({ name: p.name, score: p.score }))
        })
        return
      }

      if (room.deck.length > 0) {
        room.currentMovie = room.deck.pop()!
        room.phase = "trailer"
        io.to(roomId).emit("phase_changed", "trailer")
        io.to(roomId).emit("trailer_started", room.currentMovie)
        io.to(roomId).emit("room_updated", room)
      } else {
        const topScorer = room.players.reduce((a, b) => b.score > a.score ? b : a)
        room.phase = "finished"
        io.to(roomId).emit("phase_changed", "finished")
        io.to(roomId).emit("room_updated", room)
        io.to(roomId).emit("game_over", {
          winner: topScorer,
          finalScores: room.players.map(p => ({ name: p.name, score: p.score }))
        })
      }
    } catch (err) {
      console.error("continue_game error:", err)
    }
  })

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id)
  })
})

app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"))
})

const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📁 Serving from: ${clientBuildPath}`)
})


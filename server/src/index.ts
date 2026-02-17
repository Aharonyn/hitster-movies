import express from "express"
import path from "path"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import { createRoom, addPlayer, getRoom } from "./roomManager"

const app = express()
app.use(cors())

// Serve static files from the public directory (copied during build)
const clientBuildPath = path.join(__dirname, "../public")
app.use(express.static(clientBuildPath))

// Socket.io setup
const httpServer = createServer(app)
const io = new Server(httpServer, { 
  cors: { 
    origin: "*",
    methods: ["GET", "POST"]
  } 
})

io.on("connection", socket => {
  console.log("New socket connection:", socket.id)

  socket.on("create_room", ({ settings, hostName }) => {
    try {
      const room = createRoom(socket.id, settings)
      const hostPlayer = addPlayer(room.id, hostName)
      socket.join(room.id)
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
      const player = addPlayer(roomId, name)
      if (player) {
        socket.join(roomId)
        const room = getRoom(roomId)
        if (room) {
          io.to(roomId).emit("player_joined", player)
          io.to(roomId).emit("room_updated", room)
          console.log(`${name} joined room ${roomId}`)
        }
      } else {
        socket.emit("error", { message: "Room not found" })
      }
    } catch (error) {
      console.error("Error joining room:", error)
      socket.emit("error", { message: "Failed to join room" })
    }
  })

  socket.on("get_room", ({ roomId }) => {
    try {
      const room = getRoom(roomId)
      if (room) {
        socket.emit("room_updated", room)
      } else {
        socket.emit("error", { message: "Room not found" })
      }
    } catch (error) {
      console.error("Error getting room:", error)
      socket.emit("error", { message: "Failed to get room" })
    }
  })

  socket.on("start_game", ({ roomId }) => {
    try {
      const room = getRoom(roomId)
      if (room && room.hostId === socket.id) {
        // Start with trailer phase
        room.phase = "trailer"
        room.currentTurnIndex = 0
        
        // Pick the first movie to show trailer
        if (room.deck.length > 0) {
          const firstMovie = room.deck.pop()
          if (firstMovie) {
            room.currentMovie = firstMovie
          }
        }
        
        io.to(roomId).emit("phase_changed", "trailer")
        io.to(roomId).emit("room_updated", room)
        io.to(roomId).emit("trailer_started", room.currentMovie)
        console.log(`Game started in room ${roomId} - showing trailer`)
      }
    } catch (error) {
      console.error("Error starting game:", error)
    }
  })

  socket.on("trailer_finished", ({ roomId }) => {
    try {
      const room = getRoom(roomId)
      if (!room) return

      // After trailer, give movie to current player and start placement
      const currentPlayer = room.players[room.currentTurnIndex]
      if (currentPlayer && room.currentMovie) {
        currentPlayer.timeline.push(room.currentMovie)
        room.phase = "placement"
        
        io.to(roomId).emit("phase_changed", "placement")
        io.to(roomId).emit("room_updated", room)
        io.to(roomId).emit("turn_changed", { 
          currentTurnIndex: room.currentTurnIndex,
          currentPlayer: currentPlayer
        })
        console.log(`Trailer finished. ${currentPlayer.name}'s turn to place movie.`)
      }
    } catch (error) {
      console.error("Error finishing trailer:", error)
    }
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
            console.log(`Game finished in room ${roomId}. Winner: ${player.name}`)
            return
          }

          // Correct! Show next trailer
          if (room.deck.length > 0) {
            room.phase = "trailer"
            room.currentTurnIndex = (room.currentTurnIndex + 1) % room.players.length
            const nextMovie = room.deck.pop()
            if (nextMovie) {
              room.currentMovie = nextMovie
            }
            
            io.to(roomId).emit("phase_changed", "trailer")
            io.to(roomId).emit("room_updated", room)
            io.to(roomId).emit("trailer_started", room.currentMovie)
            console.log(`Correct placement! Showing next trailer.`)
          }
        } else {
          // Wrong placement - move movie to discard
          const incorrectMovie = player.timeline.splice(destinationIndex, 1)[0]
          room.discardPile.push(incorrectMovie)
          
          // Show next trailer
          if (room.deck.length > 0) {
            room.phase = "trailer"
            room.currentTurnIndex = (room.currentTurnIndex + 1) % room.players.length
            const nextMovie = room.deck.pop()
            if (nextMovie) {
              room.currentMovie = nextMovie
            }
            
            io.to(roomId).emit("phase_changed", "trailer")
            io.to(roomId).emit("room_updated", room)
            io.to(roomId).emit("trailer_started", room.currentMovie)
            console.log(`Wrong placement. Showing next trailer.`)
          }
        }
        
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

app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"))
})

const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📁 Serving client files from: ${clientBuildPath}`)
})


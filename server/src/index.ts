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
        io.to(roomId).emit("player_joined", player)
        console.log(`${name} joined room ${roomId}`)
      } else {
        socket.emit("error", { message: "Room not found" })
      }
    } catch (error) {
      console.error("Error joining room:", error)
      socket.emit("error", { message: "Failed to join room" })
    }
  })

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id)
  })
})

// SPA fallback - must be AFTER static files
app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"))
})

const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📁 Serving client files from: ${clientBuildPath}`)
})

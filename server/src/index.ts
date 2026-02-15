import express from "express"
import path from "path"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import { createRoom, addPlayer, getRoom } from "./roomManager"

const app = express()
app.use(cors())
app.use(express.static(path.join(__dirname, "../public")))

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"))
})

const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: "*" } })

io.on("connection", socket => {
  console.log("New socket:", socket.id)

  socket.on("create_room", ({ settings, hostName }) => {
    const room = createRoom(socket.id, settings)
    const hostPlayer = addPlayer(room.id, hostName)
    socket.join(room.id)
    socket.emit("room_created", { room, hostPlayer })
  })

  socket.on("join_room", ({ roomId, name }) => {
    const player = addPlayer(roomId, name)
    if (player) {
      socket.join(roomId)
      io.to(roomId).emit("player_joined", player)
    }
  })
})

const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`))
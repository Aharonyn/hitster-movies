import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { socket } from "../socket"

type Mode = "choose" | "create" | "join"

export default function LobbyPage() {
  const [mode, setMode] = useState<Mode>("choose")
  const [name, setName] = useState("")
  const [roomCode, setRoomCode] = useState("")
  const [winScore, setWinScore] = useState(8)
  const [sequelConfusion, setSequelConfusion] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const createRoom = () => {
    if (!name.trim()) return
    socket.emit("create_room", {
      hostName: name.trim(),
      settings: { winScore, sequelConfusionMode: sequelConfusion }
    })
    socket.once("room_created", ({ room, hostPlayer }) => {
      navigate(`/host?roomId=${room.id}&playerId=${hostPlayer.id}`)
    })
  }

  const joinRoom = () => {
    if (!name.trim() || !roomCode.trim()) return
    setError("")
    socket.emit("join_room", { roomId: roomCode.trim(), name: name.trim() })
    socket.once("player_joined", (player) => {
      navigate(`/player?roomId=${roomCode.trim()}&playerId=${player.id}`)
    })
    socket.once("error", ({ message }) => {
      setError(message || "Room not found. Check the code and try again.")
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-8">🎬 Movie Timeline</h1>

        {/* Choose Mode */}
        {mode === "choose" && (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setMode("create")}
              className="bg-blue-600 text-white p-4 rounded-lg text-lg font-semibold hover:bg-blue-700"
            >
              🏠 Create a Room
            </button>
            <button
              onClick={() => setMode("join")}
              className="bg-green-600 text-white p-4 rounded-lg text-lg font-semibold hover:bg-green-700"
            >
              🚪 Join a Room
            </button>
          </div>
        )}

        {/* Create Room */}
        {mode === "create" && (
          <div className="flex flex-col gap-4">
            <button onClick={() => setMode("choose")} className="text-gray-400 hover:text-white text-sm self-start">
              ← Back
            </button>
            <h2 className="text-xl font-semibold text-white">Create a Room</h2>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="border p-3 rounded-lg text-black bg-white text-lg"
            />
            <div className="bg-white rounded-lg p-4">
              <label className="block text-black font-semibold mb-1">Win score: {winScore}</label>
              <input
                type="range"
                min={5}
                max={15}
                value={winScore}
                onChange={e => setWinScore(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="bg-white rounded-lg p-4">
              <label className="flex items-center gap-2 text-black">
                <input
                  type="checkbox"
                  checked={sequelConfusion}
                  onChange={e => setSequelConfusion(e.target.checked)}
                />
                <span className="font-semibold">Sequel Confusion Mode</span>
              </label>
            </div>
            <button
              onClick={createRoom}
              disabled={!name.trim()}
              className="bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              Create Room
            </button>
          </div>
        )}

        {/* Join Room */}
        {mode === "join" && (
          <div className="flex flex-col gap-4">
            <button onClick={() => setMode("choose")} className="text-gray-400 hover:text-white text-sm self-start">
              ← Back
            </button>
            <h2 className="text-xl font-semibold text-white">Join a Room</h2>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="border p-3 rounded-lg text-black bg-white text-lg"
            />
            <input
              type="text"
              placeholder="Room code"
              value={roomCode}
              onChange={e => { setRoomCode(e.target.value.toUpperCase()); setError("") }}
              className="border p-3 rounded-lg text-black bg-white text-lg font-mono tracking-widest"
            />
            {error && (
              <p className="text-red-400 text-sm font-semibold">{error}</p>
            )}
            <button
              onClick={joinRoom}
              disabled={!name.trim() || !roomCode.trim()}
              className="bg-green-600 text-white p-3 rounded-lg text-lg font-semibold hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              Join Room
            </button>
          </div>
        )}
      </div>
    </div>
  )
}


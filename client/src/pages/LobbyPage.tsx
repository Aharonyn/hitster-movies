import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { socket } from "../socket"

export default function LobbyPage() {
  const [name, setName] = useState("")
  const [winScore, setWinScore] = useState(8)
  const [sequelConfusion, setSequelConfusion] = useState(false)
  const navigate = useNavigate()

  const createRoom = () => {
    socket.emit("create_room", {
      hostName: name,
      settings: { winScore, sequelConfusionMode: sequelConfusion }
    })
    socket.on("room_created", ({ room, hostPlayer }) => {
      navigate(`/host?roomId=${room.id}&playerId=${hostPlayer.id}`)
    })
  }

  return (
    <div className="p-6 flex flex-col gap-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Movie Timeline</h1>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="border p-2 rounded text-black bg-white"
      />
      <div>
        <label className="block mb-2">Win score: {winScore}</label>
        <input
          type="range"
          min={5}
          max={15}
          value={winScore}
          onChange={e => setWinScore(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={sequelConfusion}
            onChange={e => setSequelConfusion(e.target.checked)}
          />
          <span>Sequel Confusion Mode</span>
        </label>
      </div>
      <button
        onClick={createRoom}
        disabled={!name.trim()}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Create Room
      </button>
    </div>
  )
}


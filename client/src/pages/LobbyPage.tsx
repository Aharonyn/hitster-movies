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
    <div className="p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Movie Timeline</h1>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="border p-2 rounded"
      />
      <div>
        <label>Win score: {winScore}</label>
        <input
          type="range"
          min={5}
          max={15}
          value={winScore}
          onChange={e => setWinScore(Number(e.target.value))}
        />
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={sequelConfusion}
            onChange={e => setSequelConfusion(e.target.checked)}
          />{" "}
          Sequel Confusion Mode
        </label>
      </div>
      <button
        onClick={createRoom}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Create Room
      </button>
    </div>
  )
}
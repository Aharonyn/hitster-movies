import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { socket } from "../socket"
import Timeline from "../components/Timeline"
import TrailerPlayer from "../components/TrailerPlayer"
import { Movie } from "../types"

export default function HostPage() {
  const [params] = useSearchParams()
  const roomId = params.get("roomId") || ""
  const [players, setPlayers] = useState<any[]>([])
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null)
  const [phase, setPhase] = useState("lobby")

  useEffect(() => {
    socket.on("player_joined", player => setPlayers(prev => [...prev, player]))
    socket.on("phase_changed", (newPhase: string) => setPhase(newPhase))
    socket.on("trailer_started", (movie: Movie) => setCurrentMovie(movie))
  }, [])

  const startGame = () => socket.emit("start_game", { roomId })

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Host</h1>
      {phase === "lobby" && (
        <div>
          <button
            onClick={startGame}
            className="bg-green-500 text-white p-2 rounded mt-4"
          >
            Start Game
          </button>
        </div>
      )}
      {phase === "trailer" && currentMovie && (
        <TrailerPlayer
          youtubeId={currentMovie.youtubeId}
          onEnd={() => socket.emit("trailer_finished", { roomId })}
        />
      )}
      <h2 className="mt-4">Players</h2>
      <ul>
        {players.map(p => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  )
}
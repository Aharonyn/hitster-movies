import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { socket } from "../socket"
import Timeline from "../components/Timeline"
import TrailerPlayer from "../components/TrailerPlayer"
import { Movie, Player, Room } from "../types"

export default function HostPage() {
  const [params] = useSearchParams()
  const roomId = params.get("roomId") || ""
  const playerId = params.get("playerId") || ""
  
  const [room, setRoom] = useState<Room | null>(null)
  const [hostPlayer, setHostPlayer] = useState<Player | null>(null)
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null)
  const [phase, setPhase] = useState("lobby")
  const [skipVotes, setSkipVotes] = useState(0)
  const [hasVotedSkip, setHasVotedSkip] = useState(false)

  useEffect(() => {
    socket.emit("get_room", { roomId })
    
    socket.on("room_updated", (updatedRoom: Room) => {
      setRoom(updatedRoom)
      setPhase(updatedRoom.phase)
      if (updatedRoom.currentMovie) setCurrentMovie(updatedRoom.currentMovie)
      const host = updatedRoom.players.find(p => p.id === playerId)
      setHostPlayer(host || null)
    })

    socket.on("phase_changed", (newPhase: string) => {
      setPhase(newPhase)
      if (newPhase === "trailer") {
        setSkipVotes(0)
        setHasVotedSkip(false)
      }
    })

    socket.on("trailer_started", (movie: Movie) => {
      setCurrentMovie(movie)
      setSkipVotes(0)
      setHasVotedSkip(false)
    })

    socket.on("skip_votes_updated", ({ skipVotes: votes }) => {
      setSkipVotes(votes)
    })

    return () => {
      socket.off("room_updated")
      socket.off("phase_changed")
      socket.off("trailer_started")
      socket.off("skip_votes_updated")
    }
  }, [roomId, playerId])

  const startGame = () => socket.emit("start_game", { roomId })

  const placeMovie = (sourceIndex: number, destinationIndex: number) => {
    socket.emit("place_movie", { roomId, playerId, sourceIndex, destinationIndex })
  }

  const handleVoteSkip = () => {
    if (!hasVotedSkip) {
      setHasVotedSkip(true)
      socket.emit("vote_skip", { roomId, playerId })
    }
  }

  const isMyTurn = room && room.players[room.currentTurnIndex]?.id === playerId
  const currentTurnPlayer = room?.players[room.currentTurnIndex]

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">🎬 {hostPlayer?.name}</h1>
        <div className="text-white">
          Room: <span className="font-mono bg-white text-black px-2 py-1 rounded font-bold tracking-widest">{roomId}</span>
        </div>
      </div>

      {/* Lobby */}
      {phase === "lobby" && (
        <div className="mb-6 p-4 bg-white rounded-lg">
          <h2 className="text-xl font-semibold mb-2 text-black">Waiting for players...</h2>
          <p className="text-gray-700 mb-4">
            Share the room code <span className="font-mono font-bold text-black">{roomId}</span> with your friends!
          </p>
          <div className="mb-4">
            {room?.players.map(p => (
              <div key={p.id} className="text-black py-1">👤 {p.name} {p.id === playerId && "(You)"}</div>
            ))}
          </div>
          <button
            onClick={startGame}
            disabled={!room || room.players.length < 1}
            className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Start Game
          </button>
        </div>
      )}

      {/* Trailer Phase - NO movie name shown */}
      {phase === "trailer" && currentMovie && (
        <div className="mb-6">
          <p className="text-center text-white font-semibold mb-3">🎬 What movie is this? Guess the year!</p>
          <TrailerPlayer
            youtubeId={currentMovie.youtubeId}
            onEnd={() => socket.emit("trailer_finished", { roomId })}
            onVoteSkip={handleVoteSkip}
            skipVotes={skipVotes}
            totalPlayers={room?.players.length || 1}
            hasVotedSkip={hasVotedSkip}
          />
        </div>
      )}

      {/* Turn Indicator */}
      {phase === "placement" && currentTurnPlayer && (
        <div className={`mb-4 p-4 rounded-lg border-2 ${isMyTurn ? 'bg-green-100 border-green-500' : 'bg-yellow-100 border-yellow-500'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isMyTurn ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xl font-bold text-green-800">🎯 YOUR TURN! Place the movie.</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-xl font-semibold text-yellow-800">Waiting for {currentTurnPlayer.name}...</span>
                </>
              )}
            </div>
            <span className="text-sm text-gray-600">Turn {room!.currentTurnIndex + 1}/{room!.players.length}</span>
          </div>
        </div>
      )}

      {/* Timeline */}
      {hostPlayer && hostPlayer.timeline.length > 0 && phase === "placement" && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-white">Your Timeline</h2>
            <span className="text-white font-bold">Score: <span className="text-blue-400">{hostPlayer.score}</span></span>
          </div>
          <div className={`border-2 rounded-lg p-2 ${isMyTurn ? 'border-green-500 bg-green-50' : 'border-gray-500 bg-gray-800 opacity-60'}`}>
            <Timeline movies={hostPlayer.timeline} onPlace={isMyTurn ? placeMovie : () => {}} />
            {!isMyTurn && <p className="text-center mt-1 text-sm text-gray-400">Waiting for your turn...</p>}
          </div>
        </div>
      )}

      {/* Players List */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-white mb-3">Players</h2>
        <div className="grid grid-cols-2 gap-2">
          {room?.players.map((p, index) => {
            const isCurrentTurn = room.currentTurnIndex === index && phase === "placement"
            const isMe = p.id === playerId
            return (
              <div key={p.id} className={`p-3 rounded-lg border-2 ${
                isCurrentTurn ? 'bg-green-100 border-green-500' : isMe ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'
              }`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {isCurrentTurn && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
                    <span className="font-semibold text-black">{p.name} {isMe && "(You)"}</span>
                    {isCurrentTurn && <span className="text-xs bg-green-500 text-white px-1 py-0.5 rounded">TURN</span>}
                  </div>
                  <span className="text-sm text-black">⭐ {p.score}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Game Over */}
      {phase === "finished" && room && (
        <div className="mt-6 p-6 bg-purple-100 border-2 border-purple-500 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-2 text-black">🎉 Game Over!</h2>
          {(() => {
            const winner = room.players.reduce((a, b) => b.score > a.score ? b : a)
            return (
              <>
                <p className="text-lg font-semibold text-black">
                  🏆 {winner.name} wins with {winner.score} points!
                </p>
                {winner.id === playerId && <p className="text-2xl font-bold text-green-600 mt-2">YOU WON! 🎬</p>}
              </>
            )
          })()}
        </div>
      )}
    </div>
  )
}


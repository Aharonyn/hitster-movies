import React, { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { socket } from "../socket"
import Timeline from "../components/Timeline"
import TrailerPlayer from "../components/TrailerPlayer"
import { Movie, Player, Room } from "../types"

export const PlayerPage: React.FC = () => {
  const [params] = useSearchParams()
  const roomId = params.get("roomId") || ""
  const playerId = params.get("playerId") || ""

  const [room, setRoom] = useState<Room | null>(null)
  const [player, setPlayer] = useState<Player | null>(null)
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null)
  const [phase, setPhase] = useState("lobby")

  useEffect(() => {
    socket.emit("get_room", { roomId })

    socket.on("room_updated", (updatedRoom: Room) => {
      setRoom(updatedRoom)
      setPhase(updatedRoom.phase)
      if (updatedRoom.currentMovie) {
        setCurrentMovie(updatedRoom.currentMovie)
      }
      const currentPlayer = updatedRoom.players.find(p => p.id === playerId)
      setPlayer(currentPlayer || null)
    })

    socket.on("phase_changed", (newPhase: string) => {
      setPhase(newPhase)
    })

    socket.on("trailer_started", (movie: Movie) => {
      setCurrentMovie(movie)
    })

    socket.on("turn_changed", ({ currentTurnIndex, wasCorrect }) => {
      if (wasCorrect !== undefined) {
        console.log("Placement was:", wasCorrect ? "correct!" : "incorrect")
      }
    })

    return () => {
      socket.off("room_updated")
      socket.off("phase_changed")
      socket.off("trailer_started")
      socket.off("turn_changed")
    }
  }, [roomId, playerId])

  const placeMovie = (sourceIndex: number, destinationIndex: number) => {
    socket.emit("place_movie", { 
      roomId, 
      playerId, 
      sourceIndex, 
      destinationIndex 
    })
  }

  const isMyTurn = room && room.players[room.currentTurnIndex]?.id === playerId
  const currentTurnPlayer = room?.players[room.currentTurnIndex]

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Player: {player?.name}</h1>
        <div className="text-lg text-white">
          Room: <span className="font-mono bg-gray-200 px-2 py-1 rounded text-black">{roomId}</span>
        </div>
      </div>

      {/* Turn Indicator - only show during placement phase */}
      {phase === "placement" && currentTurnPlayer && (
        <div className={`mb-4 p-4 rounded-lg border-2 ${
          isMyTurn 
            ? 'bg-green-100 border-green-500' 
            : 'bg-yellow-100 border-yellow-500'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isMyTurn ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xl font-bold text-green-800">
                    🎬 YOUR TURN!
                  </span>
                  <span className="text-gray-700">Place your movie on the timeline</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-xl font-semibold text-yellow-800">
                    Waiting for {currentTurnPlayer.name}'s turn...
                  </span>
                </>
              )}
            </div>
            <div className="text-sm text-gray-600">
              Turn {room!.currentTurnIndex + 1} of {room!.players.length}
            </div>
          </div>
        </div>
      )}

      {/* Waiting for Game to Start */}
      {phase === "lobby" && (
        <div className="mb-6 p-4 bg-blue-50 rounded text-center">
          <h2 className="text-xl font-semibold mb-2 text-black">Waiting for host to start the game...</h2>
          <p className="text-gray-700">
            Players in room: {room?.players.length || 0}
          </p>
        </div>
      )}

      {/* Trailer Phase */}
      {phase === "trailer" && currentMovie && (
        <div className="mb-6">
          <div className="mb-3 p-3 bg-blue-100 rounded text-center">
            <p className="text-lg font-bold text-black">
              🎬 Watch the trailer and guess the year!
            </p>
          </div>
          <TrailerPlayer
            youtubeId={currentMovie.youtubeId}
            onEnd={() => {}}
          />
          <p className="text-center mt-2 text-lg font-semibold text-white">
            {currentMovie.title}
          </p>
        </div>
      )}

      {/* Player's Timeline */}
      {player && player.timeline.length > 0 && phase === "placement" && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-white">Your Timeline</h2>
            <div className="text-lg font-bold text-white">
              Score: <span className="text-blue-400">{player.score}</span>
            </div>
          </div>
          {isMyTurn ? (
            <div className="border-2 border-green-500 rounded-lg p-2 bg-green-50">
              <Timeline 
                movies={player.timeline} 
                onPlace={placeMovie}
              />
              <p className="text-center mt-2 text-sm text-green-700 font-semibold">
                ↕️ Drag and drop to arrange movies in chronological order
              </p>
            </div>
          ) : (
            <div className="border-2 border-gray-300 rounded-lg p-2 bg-gray-50 opacity-60">
              <Timeline 
                movies={player.timeline} 
                onPlace={() => {}}
              />
              {!isMyTurn && (
                <p className="text-center mt-2 text-sm text-gray-600">
                  Waiting for your turn...
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* All Players List */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3 text-white">All Players</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {room?.players.map((p, index) => {
            const isCurrentTurn = room.currentTurnIndex === index && phase === "placement"
            const isThisPlayer = p.id === playerId
            
            return (
              <div 
                key={p.id} 
                className={`p-3 rounded border-2 transition-all ${
                  isCurrentTurn 
                    ? 'bg-green-100 border-green-500 ring-2 ring-green-300' 
                    : isThisPlayer 
                      ? 'bg-blue-100 border-blue-500' 
                      : 'bg-white border-gray-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {isCurrentTurn && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                    <span className="font-semibold text-black">
                      {p.name} {isThisPlayer && "(You)"}
                    </span>
                    {isCurrentTurn && (
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                        TURN
                      </span>
                    )}
                  </div>
                  <span className="text-sm bg-gray-200 px-2 py-1 rounded text-black">
                    Score: {p.score} | Cards: {p.timeline.length}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Game Phase Indicator */}
      {phase !== "lobby" && phase !== "finished" && (
        <div className="mt-6 p-3 bg-yellow-100 rounded text-center">
          <p className="font-semibold text-black">
            Current Phase: <span className="uppercase">{phase}</span>
          </p>
        </div>
      )}

      {/* Game Finished */}
      {phase === "finished" && (
        <div className="mt-6 p-6 bg-purple-100 border-2 border-purple-500 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4 text-black">🎉 Game Over! 🎉</h2>
          <div className="text-lg">
            {room && (() => {
              const winner = room.players.reduce((prev, current) => 
                (current.score > prev.score) ? current : prev
              )
              const youWon = winner.id === playerId
              return (
                <>
                  <p className="font-semibold mb-2 text-black">
                    Winner: <span className="text-purple-600">{winner.name}</span> with {winner.score} points!
                  </p>
                  {youWon && (
                    <p className="text-2xl font-bold text-green-600 mt-2">
                      🏆 YOU WON! 🏆
                    </p>
                  )}
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}


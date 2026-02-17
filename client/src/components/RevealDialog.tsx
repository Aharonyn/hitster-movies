import React, { useEffect, useState } from "react"
import { Movie } from "../types"

interface RevealData {
  movie: Movie
  playerName: string
  isCorrect: boolean
  newScore: number
  isWinner?: boolean
}

interface RevealDialogProps {
  reveal: RevealData
  isHost: boolean
  onContinue: () => void // host only
}

export default function RevealDialog({ reveal, isHost, onContinue }: RevealDialogProps) {
  const { movie, playerName, isCorrect, newScore, isWinner } = reveal

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-2xl shadow-2xl p-8 mx-4 w-full max-w-sm text-center">

        {/* Result banner */}
        <div className={`text-4xl mb-2`}>
          {isWinner ? "🏆" : isCorrect ? "✅" : "❌"}
        </div>

        <p className="text-lg font-semibold text-gray-700 mb-1">
          {playerName}
        </p>

        <p className={`text-2xl font-bold mb-4 ${isCorrect ? "text-green-600" : "text-red-500"}`}>
          {isWinner
            ? "Correct — and wins the game!"
            : isCorrect
            ? "Correct placement!"
            : "Wrong placement!"}
        </p>

        {/* Movie details reveal */}
        <div className="bg-gray-100 rounded-xl p-4 mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">The movie was</p>
          <p className="text-xl font-black text-black">{movie.title}</p>
          <p className="text-3xl font-bold text-blue-700 mt-1">{movie.year}</p>
        </div>

        {/* Score */}
        <p className="text-sm text-gray-500 mb-5">
          {playerName}'s score: <span className="font-bold text-black">{newScore}</span>
        </p>

        {/* Host gets continue button, players wait */}
        {isHost ? (
          <button
            onClick={onContinue}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-lg"
          >
            {isWinner ? "See Final Scores →" : "Next Trailer →"}
          </button>
        ) : (
          <p className="text-gray-400 text-sm italic">Waiting for host to continue...</p>
        )}
      </div>
    </div>
  )
}


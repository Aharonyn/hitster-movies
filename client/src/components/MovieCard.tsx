import React from "react"
import { Movie } from "../types"

interface MovieCardProps {
  movie: Movie
  isActive?: boolean
}

export default function MovieCard({ movie, isActive = false }: MovieCardProps) {
  if (isActive) {
    return (
      <div className="w-24 h-32 bg-yellow-300 border-2 border-yellow-500 rounded flex flex-col items-center justify-center p-2 shadow-lg">
        <p className="text-5xl font-black text-yellow-700">?</p>
        <p className="text-xs text-yellow-800 mt-2 font-semibold">Drag to place</p>
      </div>
    )
  }

  // Revealed card — show title and year
  return (
    <div className="w-24 h-32 bg-gray-100 border border-gray-300 rounded flex flex-col items-center justify-center p-2">
      <p className="text-xs font-bold text-black text-center leading-tight">{movie.title}</p>
      <p className="text-lg font-bold text-blue-700 mt-1">{movie.year}</p>
    </div>
  )
}


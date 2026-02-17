import React from "react"
import { Movie } from "../types"

interface MovieCardProps {
  movie: Movie
  isActive?: boolean // The card currently being placed — show year only
}

export default function MovieCard({ movie, isActive = false }: MovieCardProps) {
  if (isActive) {
    // Only show the year — title is still a mystery
    return (
      <div className="w-24 h-32 bg-yellow-300 border-2 border-yellow-500 rounded flex flex-col items-center justify-center p-2 shadow-lg">
        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Year?</p>
        <p className="text-2xl font-bold text-black">{movie.year}</p>
        <p className="text-xs text-gray-500 mt-2 text-center">Drag to place</p>
      </div>
    )
  }

  // Revealed card — show both title and year
  return (
    <div className="w-24 h-32 bg-gray-100 border border-gray-300 rounded flex flex-col items-center justify-center p-2">
      <p className="text-xs font-bold text-black text-center leading-tight">{movie.title}</p>
      <p className="text-lg font-bold text-blue-700 mt-1">{movie.year}</p>
    </div>
  )
}


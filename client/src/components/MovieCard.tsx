import React from "react"
import { Movie } from "../types"

interface MovieCardProps {
  movie: Movie
  hideYear?: boolean
}

export default function MovieCard({ movie, hideYear = false }: MovieCardProps) {
  return (
    <div className="w-24 h-32 bg-gray-200 rounded flex flex-col items-center justify-center p-2 text-black">
      <p className="text-sm font-bold text-center">{movie.title}</p>
      {!hideYear && (
        <p className="text-xs mt-1 text-gray-700 font-semibold">{movie.year}</p>
      )}
    </div>
  )
}


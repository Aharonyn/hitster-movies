import React from "react"
import { Movie } from "../../server/src/types"

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="w-24 h-32 bg-gray-200 rounded flex flex-col items-center justify-center p-2">
      <p className="text-sm font-bold">{movie.title}</p>
    </div>
  )
}
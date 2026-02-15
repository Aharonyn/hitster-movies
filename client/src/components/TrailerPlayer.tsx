import React, { useEffect } from "react"

interface TrailerPlayerProps {
  youtubeId: string
  onEnd: () => void
}

export default function TrailerPlayer({ youtubeId, onEnd }: TrailerPlayerProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onEnd()
    }, 60000) // 60s auto-stop
    return () => clearTimeout(timer)
  }, [onEnd])

  return (
    <div className="w-full h-64">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=0`}
        title="Trailer"
        allow="autoplay; encrypted-media"
      ></iframe>
    </div>
  )
}
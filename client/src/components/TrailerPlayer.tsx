import React, { useEffect, useRef } from "react"

interface TrailerPlayerProps {
  youtubeId: string
  onEnd: () => void
  isHost?: boolean
}

export default function TrailerPlayer({ youtubeId, onEnd, isHost = false }: TrailerPlayerProps) {
  // Use a ref so the timer never gets reset on re-renders
  const onEndRef = useRef(onEnd)
  useEffect(() => { onEndRef.current = onEnd }, [onEnd])

  useEffect(() => {
    const timer = setTimeout(() => {
      onEndRef.current()
    }, 60000)
    return () => clearTimeout(timer)
  }, [youtubeId]) // Only restart timer when a new trailer loads

  return (
    <div className="w-full">
      <div className="w-full h-64">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=0`}
          title="Trailer"
          allow="autoplay; encrypted-media"
        ></iframe>
      </div>

      {isHost && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={onEnd}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg text-sm"
          >
            ⏭ Skip trailer
          </button>
        </div>
      )}
    </div>
  )
}


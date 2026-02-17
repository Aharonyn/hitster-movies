import React, { useEffect, useRef } from "react"

interface TrailerPlayerProps {
  youtubeId: string
  onEnd: () => void
  isHost?: boolean
}

export default function TrailerPlayer({ youtubeId, onEnd, isHost = false }: TrailerPlayerProps) {
  const onEndRef = useRef(onEnd)
  useEffect(() => { onEndRef.current = onEnd }, [onEnd])

  useEffect(() => {
    const timer = setTimeout(() => {
      onEndRef.current()
    }, 60000)
    return () => clearTimeout(timer)
  }, [youtubeId])

  // modestbranding=1 minimizes YouTube branding/title as much as their API allows
  // rel=0 prevents related videos showing at end
  // iv_load_policy=3 hides video annotations
  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0`

  return (
    <div className="w-full">
      <div className="w-full aspect-video rounded-lg overflow-hidden">
        <iframe
          width="100%"
          height="100%"
          src={embedUrl}
          title="Movie Trailer"
          allow="autoplay; encrypted-media"
          allowFullScreen
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


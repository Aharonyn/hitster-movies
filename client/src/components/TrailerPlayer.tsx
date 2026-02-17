import React, { useEffect, useState } from "react"

interface TrailerPlayerProps {
  youtubeId: string
  onEnd: () => void
  onVoteSkip: () => void
  skipVotes: number
  totalPlayers: number
  hasVotedSkip: boolean
}

export default function TrailerPlayer({
  youtubeId,
  onEnd,
  onVoteSkip,
  skipVotes,
  totalPlayers,
  hasVotedSkip,
}: TrailerPlayerProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onEnd()
    }, 60000) // 60s auto-stop fallback
    return () => clearTimeout(timer)
  }, [onEnd])

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

      {/* Skip Voting */}
      <div className="mt-3 flex items-center justify-between bg-gray-800 rounded-lg p-3">
        <div className="text-white text-sm">
          {skipVotes > 0 && (
            <span className="text-yellow-400 font-semibold">
              {skipVotes}/{totalPlayers} players want to skip
            </span>
          )}
        </div>
        <button
          onClick={onVoteSkip}
          disabled={hasVotedSkip}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            hasVotedSkip
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-yellow-500 text-black hover:bg-yellow-400"
          }`}
        >
          {hasVotedSkip ? "✓ Voted to skip" : "⏭ Skip trailer"}
        </button>
      </div>
    </div>
  )
}


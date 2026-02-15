import { Movie } from "./types"

export function validatePlacement(timeline: Movie[], newMovie: Movie, index: number): boolean {
  const newTimeline = [...timeline]
  newTimeline.splice(index, 0, newMovie)
  for (let i = 0; i < newTimeline.length - 1; i++) {
    if (newTimeline[i].year > newTimeline[i + 1].year) return false
  }
  return true
}

export function shuffleDeck(deck: Movie[]): Movie[] {
  return [...deck].sort(() => Math.random() - 0.5)
}
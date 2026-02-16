// Shared types for Movie Timeline Game
// These MUST match server/src/types.ts exactly

export interface Movie {
  id: string
  title: string
  year: number
  youtubeId: string
  franchise?: string
  confusionGroup?: string
}

export interface Player {
  id: string
  name: string
  timeline: Movie[]
  score: number
}

export interface RoomSettings {
  winScore: number
  sequelConfusionMode: boolean
}

export interface Room {
  id: string
  hostId: string
  players: Player[]
  deck: Movie[]
  discardPile: Movie[]
  currentMovie?: Movie
  currentTurnIndex: number
  votes: Record<string, boolean>
  settings: RoomSettings
  phase: "lobby" | "trailer" | "placement" | "voting" | "reveal" | "finished"
}


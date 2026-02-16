
export interface Movie {
  id: string
  title: string
  year: number
  trailer?: string
  poster?: string
}

export interface Player {
  id: string
  name: string
  score: number
  timeline: Movie[]
}

export interface Room {
  id: string
  hostId: string
  players: Player[]
  settings: GameSettings
  currentMovie?: Movie
  gameState: 'lobby' | 'playing' | 'finished'
}

export interface GameSettings {
  winScore: number
  sequelConfusionMode: boolean
}


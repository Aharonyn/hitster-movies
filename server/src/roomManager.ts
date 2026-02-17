import { Room, Player, RoomSettings, Movie } from "./types"
import { baseDeck } from "./deck"
import { shuffleDeck } from "./gameLogic"
import { v4 as uuidv4 } from "uuid"

const rooms: Record<string, Room> = {}

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // No 0/O or 1/I to avoid confusion
  let code = ""
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  // Ensure uniqueness
  if (rooms[code]) return generateRoomCode()
  return code
}

export function createRoom(hostId: string, settings: RoomSettings): Room {
  const id = generateRoomCode()
  const room: Room = {
    id,
    hostId,
    players: [],
    deck: shuffleDeck(baseDeck),
    discardPile: [],
    currentTurnIndex: 0,
    votes: {},
    settings,
    phase: "lobby"
  }
  rooms[id] = room
  return room
}

export function getRoom(id: string): Room | undefined {
  // Case-insensitive lookup
  return rooms[id.toUpperCase()]
}

export function addPlayer(roomId: string, name: string): Player | null {
  const room = rooms[roomId.toUpperCase()]
  if (!room) return null
  const player: Player = { id: uuidv4(), name, timeline: [], score: 0 }
  room.players.push(player)
  return player
}


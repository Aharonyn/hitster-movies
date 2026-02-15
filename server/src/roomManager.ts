import { Room, Player, RoomSettings, Movie } from "./types"
import { baseDeck } from "./deck"
import { shuffleDeck } from "./gameLogic"
import { v4 as uuidv4 } from "uuid"

const rooms: Record<string, Room> = {}

export function createRoom(hostId: string, settings: RoomSettings): Room {
  const room: Room = {
    id: uuidv4(),
    hostId,
    players: [],
    deck: shuffleDeck(baseDeck),
    discardPile: [],
    currentTurnIndex: 0,
    votes: {},
    settings,
    phase: "lobby"
  }
  rooms[room.id] = room
  return room
}

export function getRoom(id: string): Room | undefined {
  return rooms[id]
}

export function addPlayer(roomId: string, name: string): Player | null {
  const room = rooms[roomId]
  if (!room) return null
  const player: Player = { id: uuidv4(), name, timeline: [], score: 0 }
  room.players.push(player)
  return player
}
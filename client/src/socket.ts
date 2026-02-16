import { io } from "socket.io-client"

// In production, connect to the same origin (Render URL)
// In development, connect to localhost:4000
const isDevelopment = window.location.hostname === 'localhost'
const SERVER_URL = isDevelopment ? "http://localhost:4000" : window.location.origin

export const socket = io(SERVER_URL)
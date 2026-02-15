import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LobbyPage } from "./pages/LobbyPage"
import { HostPage } from "./pages/HostPage"
import { PlayerPage } from "./pages/PlayerPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LobbyPage />} />
        <Route path="/host" element={<HostPage />} />
        <Route path="/player" element={<PlayerPage />} />
      </Routes>
    </BrowserRouter>
  )
}
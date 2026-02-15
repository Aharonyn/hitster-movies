import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";

interface Card {
  id: string;
  title: string;
  year: number;
  trailer: string;
}

interface Player {
  id: string;
  name: string;
  timeline: Card[];
}

let socket: Socket;

export const PlayerPage: React.FC = () => {
  const { roomId, playerId } = useParams();
  const [player, setPlayer] = useState<Player | null>(null);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [guessYear, setGuessYear] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    // Connect to the server
    socket = io("/", { path: "/socket.io" });

    // Join the room
    socket.emit("joinRoom", { roomId, playerId });

    // Update player state from server
    socket.on("updatePlayer", (data: Player) => {
      setPlayer(data);
    });

    // Receive current card to guess
    socket.on("newCard", (card: Card) => {
      setCurrentCard(card);
      setGuessYear(null);
      setMessage("");
    });

    // Receive result of guess
    socket.on("guessResult", (result: { success: boolean; card: Card }) => {
      setMessage(result.success ? "Correct! Card added to your timeline 🎉" : "Wrong! Card discarded ❌");
      setCurrentCard(null);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, playerId]);

  const submitGuess = () => {
    if (guessYear !== null && currentCard) {
      socket.emit("submitGuess", { cardId: currentCard.id, year: guessYear });
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Player: {player?.name}</h1>
      <h2>Timeline</h2>
      <ul>
        {player?.timeline.map((card) => (
          <li key={card.id}>
            {card.title} ({card.year})
          </li>
        ))}
      </ul>

      {currentCard ? (
        <div>
          <h3>Guess the year for:</h3>
          <p>{currentCard.title}</p>
          <video width="320" height="240" controls>
            <source src={currentCard.trailer} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div>
            <input
              type="number"
              value={guessYear ?? ""}
              onChange={(e) => setGuessYear(Number(e.target.value))}
              placeholder="Enter release year"
            />
            <button onClick={submitGuess}>Submit</button>
          </div>
        </div>
      ) : (
        <p>{message || "Waiting for the next card..."}</p>
      )}
    </div>
  );
};

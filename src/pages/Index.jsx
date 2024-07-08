import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const BOARD_SIZE = 12;
const EMPTY = null;
const PLAYER_ONE = "black";
const PLAYER_TWO = "blue";

const createBoard = () => {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(EMPTY));
};

const checkWinner = (board) => {
  const directions = [
    { x: 1, y: 0 }, // Horizontal
    { x: 0, y: 1 }, // Vertical
    { x: 1, y: 1 }, // Diagonal down-right
    { x: 1, y: -1 }, // Diagonal up-right
  ];

  const inBounds = (x, y) => x >= 0 && y >= 0 && x < BOARD_SIZE && y < BOARD_SIZE;

  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      const player = board[y][x];
      if (player === EMPTY) continue;

      for (const { x: dx, y: dy } of directions) {
        let count = 1;
        for (let step = 1; step < 5; step++) {
          const nx = x + dx * step;
          const ny = y + dy * step;
          if (inBounds(nx, ny) && board[ny][nx] === player) {
            count++;
          } else {
            break;
          }
        }
        if (count === 5) return player;
      }
    }
  }
  return null;
};

const Index = () => {
  const [board, setBoard] = useState(createBoard());
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER_ONE);
  const [winner, setWinner] = useState(null);

  const handleCellClick = (x, y) => {
    if (board[y][x] !== EMPTY || winner) return;

    const newBoard = board.map((row, rowIndex) =>
      row.map((cell, cellIndex) => (rowIndex === y && cellIndex === x ? currentPlayer : cell))
    );

    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setCurrentPlayer(currentPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE);
    }
  };

  const resetGame = () => {
    setBoard(createBoard());
    setCurrentPlayer(PLAYER_ONE);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl mb-4">Gomoku Game</h1>
      <div className="grid grid-cols-12 gap-0 bg-yellow-500">
        {board.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <div
              key={`${rowIndex}-${cellIndex}`}
              className="w-10 h-10 border border-gray-500 flex items-center justify-center"
              onClick={() => handleCellClick(cellIndex, rowIndex)}
            >
              {cell && (
                <div
                  className={`w-8 h-8 rounded-full`}
                  style={{ backgroundColor: cell }}
                ></div>
              )}
            </div>
          ))
        )}
      </div>
      {winner && (
        <Dialog open={true} onOpenChange={resetGame}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{`Player ${winner === PLAYER_ONE ? "Black" : "Blue"} Wins!`}</DialogTitle>
            </DialogHeader>
            <Button onClick={resetGame}>Play Again</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Index;
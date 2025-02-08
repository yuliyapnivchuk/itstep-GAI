import React, { useState } from 'react';
import { Grid } from './components/Grid';
import { GameInfo } from './components/GameInfo';
import { CellState, GameState, Position, Ship } from './types';
import { GRID_SIZE, SHIPS } from './constants';
import { RotateCcw } from 'lucide-react';

function createEmptyGrid(): CellState[][] {
  return Array(GRID_SIZE).fill(null).map(() => 
    Array(GRID_SIZE).fill('empty')
  );
}

function createInitialState(): GameState {
  return {
    currentPlayer: 1,
    phase: 'placement',
    winner: null,
    boards: {
      player1: createEmptyGrid(),
      player2: createEmptyGrid(),
    },
    ships: {
      player1: [],
      player2: [],
    },
    currentShip: SHIPS[0],
    orientation: 'horizontal',
  };
}

function isValidPlacement(
  x: number,
  y: number,
  ship: Ship,
  orientation: 'horizontal' | 'vertical',
  board: CellState[][]
): boolean {
  const positions = getShipPositions(x, y, ship.length, orientation);
  return positions.every(pos => 
    pos.x >= 0 && pos.x < GRID_SIZE &&
    pos.y >= 0 && pos.y < GRID_SIZE &&
    board[pos.y][pos.x] === 'empty'
  );
}

function getShipPositions(
  x: number,
  y: number,
  length: number,
  orientation: 'horizontal' | 'vertical'
): Position[] {
  return Array(length).fill(null).map((_, i) => ({
    x: orientation === 'horizontal' ? x + i : x,
    y: orientation === 'horizontal' ? y : y + i,
  }));
}

function App() {
  const [gameState, setGameState] = useState<GameState>(createInitialState());

  const handleCellClick = (x: number, y: number) => {
    if (gameState.winner !== null) return;

    if (gameState.phase === 'placement') {
      if (!gameState.currentShip) {
        if (gameState.currentPlayer === 1) {
          // Player 1 finished placing ships, switch to Player 2
          setGameState(prev => ({
            ...prev,
            currentPlayer: 2,
            currentShip: SHIPS[0],
          }));
        } else {
          // Both players finished placing ships, start battle phase
          setGameState(prev => ({
            ...prev,
            phase: 'battle',
            currentPlayer: 1,
          }));
        }
        return;
      }

      const currentBoard = gameState.currentPlayer === 1 ? gameState.boards.player1 : gameState.boards.player2;
      
      if (!isValidPlacement(x, y, gameState.currentShip, gameState.orientation, currentBoard)) {
        return;
      }

      const positions = getShipPositions(x, y, gameState.currentShip.length, gameState.orientation);
      const newBoard = [...currentBoard];
      
      positions.forEach(pos => {
        newBoard[pos.y][pos.x] = 'ship';
      });

      const newShip = {
        ...gameState.currentShip,
        positions,
        hits: [],
      };

      const currentPlayerShips = [
        ...(gameState.currentPlayer === 1 ? gameState.ships.player1 : gameState.ships.player2),
        newShip,
      ];

      const nextShipIndex = SHIPS.findIndex(s => s.name === gameState.currentShip?.name) + 1;
      
      setGameState(prev => ({
        ...prev,
        boards: {
          ...prev.boards,
          [gameState.currentPlayer === 1 ? 'player1' : 'player2']: newBoard,
        },
        ships: {
          ...prev.ships,
          [gameState.currentPlayer === 1 ? 'player1' : 'player2']: currentPlayerShips,
        },
        currentShip: nextShipIndex < SHIPS.length ? SHIPS[nextShipIndex] : null,
      }));
    } else {
      // Battle phase
      const targetBoard = gameState.currentPlayer === 1 ? gameState.boards.player2 : gameState.boards.player1;
      const targetShips = gameState.currentPlayer === 1 ? gameState.ships.player2 : gameState.ships.player1;

      if (targetBoard[y][x] === 'hit' || targetBoard[y][x] === 'miss') {
        return;
      }

      const newBoard = [...targetBoard];
      const isHit = targetBoard[y][x] === 'ship';
      newBoard[y][x] = isHit ? 'hit' : 'miss';

      let winner = null;
      if (isHit) {
        const hitShip = targetShips.find(ship =>
          ship.positions.some(pos => pos.x === x && pos.y === y)
        );
        if (hitShip) {
          hitShip.hits.push({ x, y });
          const allShipsSunk = targetShips.every(ship =>
            ship.hits.length === ship.length
          );
          if (allShipsSunk) {
            winner = gameState.currentPlayer;
          }
        }
      }

      setGameState(prev => ({
        ...prev,
        boards: {
          ...prev.boards,
          [gameState.currentPlayer === 1 ? 'player2' : 'player1']: newBoard,
        },
        currentPlayer: !isHit ? (prev.currentPlayer === 1 ? 2 : 1) : prev.currentPlayer,
        winner,
      }));
    }
  };

  const toggleOrientation = () => {
    setGameState(prev => ({
      ...prev,
      orientation: prev.orientation === 'horizontal' ? 'vertical' : 'horizontal',
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Battleship</h1>
        
        <GameInfo
          currentPlayer={gameState.currentPlayer}
          phase={gameState.phase}
          currentShip={gameState.currentShip}
          winner={gameState.winner}
        />

        <div className="mt-8 flex flex-col md:flex-row justify-center items-start gap-12">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Player 1's Board</h2>
            <Grid
              grid={gameState.boards.player1}
              hidden={gameState.currentPlayer === 2}
              onCellClick={
                (gameState.phase === 'placement' && gameState.currentPlayer === 1) ||
                (gameState.phase === 'battle' && gameState.currentPlayer === 2)
                  ? handleCellClick
                  : undefined
              }
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Player 2's Board</h2>
            <Grid
              grid={gameState.boards.player2}
              hidden={gameState.currentPlayer === 1}
              onCellClick={
                (gameState.phase === 'placement' && gameState.currentPlayer === 2) ||
                (gameState.phase === 'battle' && gameState.currentPlayer === 1)
                  ? handleCellClick
                  : undefined
              }
            />
          </div>
        </div>

        {gameState.phase === 'placement' && gameState.currentShip && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={toggleOrientation}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <RotateCcw size={20} />
              Rotate Ship
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
import React from 'react';
import { Ship } from '../types';

interface GameInfoProps {
  currentPlayer: number;
  phase: 'placement' | 'battle';
  currentShip: Ship | null;
  winner: number | null;
}

export function GameInfo({ currentPlayer, phase, currentShip, winner }: GameInfoProps) {
  if (winner !== null) {
    return (
      <div className="text-2xl font-bold text-green-600">
        Player {winner} wins!
      </div>
    );
  }

  return (
    <div className="text-center space-y-2">
      <div className="text-xl font-semibold">
        Player {currentPlayer}'s Turn
      </div>
      {phase === 'placement' ? (
        <div className="text-gray-600">
          {currentShip ? (
            `Place your ${currentShip.name} (${currentShip.length} cells)`
          ) : (
            'All ships placed'
          )}
        </div>
      ) : (
        <div className="text-gray-600">
          Choose a position to attack
        </div>
      )}
    </div>
  );
}
import React from 'react';
import { CellState } from '../types';

interface GridProps {
  grid: CellState[][];
  hidden?: boolean;
  onCellClick?: (x: number, y: number) => void;
}

export function Grid({ grid, hidden = false, onCellClick }: GridProps) {
  return (
    <div className="grid grid-cols-10 gap-1">
      {grid.map((row, y) =>
        row.map((cell, x) => (
          <button
            key={`${x}-${y}`}
            onClick={() => onCellClick?.(x, y)}
            className={`
              w-8 h-8 border-2 transition-colors
              ${getCellStyle(cell, hidden)}
            `}
            disabled={!onCellClick}
          />
        ))
      )}
    </div>
  );
}

function getCellStyle(cell: CellState, hidden: boolean): string {
  switch (cell) {
    case 'empty':
      return 'bg-blue-100 border-blue-200';
    case 'ship':
      return hidden ? 'bg-blue-100 border-blue-200' : 'bg-gray-600 border-gray-700';
    case 'hit':
      return 'bg-red-500 border-red-600';
    case 'miss':
      return 'bg-gray-300 border-gray-400';
    default:
      return 'bg-blue-100 border-blue-200';
  }
}
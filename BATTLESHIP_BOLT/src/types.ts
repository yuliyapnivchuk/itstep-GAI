export type CellState = 'empty' | 'ship' | 'hit' | 'miss';
export type Orientation = 'horizontal' | 'vertical';

export interface Ship {
  length: number;
  name: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface PlacedShip extends Ship {
  positions: Position[];
  hits: Position[];
}

export interface GameState {
  currentPlayer: 1 | 2;
  phase: 'placement' | 'battle';
  winner: number | null;
  boards: {
    player1: CellState[][];
    player2: CellState[][];
  };
  ships: {
    player1: PlacedShip[];
    player2: PlacedShip[];
  };
  currentShip: Ship | null;
  orientation: Orientation;
}
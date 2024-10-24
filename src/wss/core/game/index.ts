import { Cell, ShipData } from '../../models/interfaces';
import { Ship } from '../ship';
import { CellStateTypes } from '../../enums/game-enums';

export class Game {
  boards: Map<number, Cell[][]>;
  ships: Map<number, ShipData[]>;
  playerIds: number[];
  boardSize: number = 10;
  currentPlayerID: number = 0;

  constructor(playerIds: number[]) {
    this.boards = new Map();
    this.ships = new Map();
    this.playerIds = playerIds;
  }

  public addShips(idPlayer: number, ships: ShipData[]): Map<number, ShipData[]> | null {
    this.createBoard(idPlayer, ships);
    this.ships.set(idPlayer, ships);

    if (this.boards.size === 2) {
      this.currentPlayerID = idPlayer;
      return this.ships;
    }

    return null;
  }

  private createBoard(idPlayer: number, ships: ShipData[]): void {
    const field: Cell[][] = Array.from({ length: this.boardSize }, () =>
      Array.from({ length: this.boardSize }, () => ({ state: CellStateTypes.EMPTY })),
    );

    ships.forEach((ship, index) => {
      const { x, y } = ship.position;
      const { length, direction } = ship;
      const instance = new Ship(length, index);

      for (let i = 0; i < length; i += 1) {
        const coordinateX = direction ? x : x + i;
        const coordinateY = direction ? y + i : y;

        if (this.isValidCoordinate(coordinateX, coordinateY)) {
          field[coordinateX][coordinateY] = {
            state: CellStateTypes.SHIP,
            shipId: index,
            instance,
          };
        }
      }
    });

    this.boards.set(idPlayer, field);
  }

  private isValidCoordinate(x: number, y: number): boolean {
    return x >= 0 && x < this.boardSize && y >= 0 && y < this.boardSize;
  }
}
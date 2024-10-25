import { Cell, CellAround, GameInfo, ShipData, Shot } from '../../models/interfaces';
import { Ship } from '../ship';
import { CellStateTypes, StatusTypes } from '../../enums/game-enums';

export class Game {
  boards: Map<number, Cell[][]>;
  ships: Map<number, ShipData[]>;
  playersIds: number[];
  boardSize: number = 10;
  currentPlayerId: number = 0;

  constructor(playersIds: number[]) {
    this.boards = new Map();
    this.ships = new Map();
    this.playersIds = playersIds;
  }

  public addShips(idPlayer: number, ships: ShipData[]): Map<number, ShipData[]> | null {
    this.createBoard(idPlayer, ships);
    this.ships.set(idPlayer, ships);

    if (this.boards.size === 2) {
      this.currentPlayerId = idPlayer;
      return this.ships;
    }

    return null;
  }

  private createBoard(idPlayer: number, ships: ShipData[]): void {
    const field: Cell[][] = Array.from({ length: this.boardSize }, () =>
      Array.from({ length: this.boardSize }, () => ({ state: CellStateTypes.EMPTY })),
    );

    ships.forEach((shipData, index) => {
      const { x, y } = shipData.position;
      const { length, direction } = shipData;
      const ship = new Ship(length, index);

      for (let i = 0; i < length; i += 1) {
        const coordinateX = direction ? x : x + i;
        const coordinateY = direction ? y + i : y;

        if (this.isValidCoordinate(coordinateX, coordinateY)) {
          field[coordinateX][coordinateY] = {
            state: CellStateTypes.SHIP,
            shipId: index,
            ship,
          };
        }
      }
    });

    this.boards.set(idPlayer, field);
  }

  private isValidCoordinate(x: number, y: number): boolean {
    return x >= 0 && x < this.boardSize && y >= 0 && y < this.boardSize;
  }

  public attack(indexPlayer: number, shot: Shot): GameInfo {
    const enemyId = this.playersIds.find((id) => id !== indexPlayer);
    const { x, y } = shot;

    const response: GameInfo = {
      nextPlayerId: 0,
      status: StatusTypes.MISS,
      error: false,
      errorMessage: '',
    };

    if (this.currentPlayerId !== indexPlayer) {
      return {
        ...response,
        error: true,
        errorMessage: 'Enemy\'s turn"',
      };
    }

    const board = this.boards.get(enemyId);
    const cell = board[x][y];
    const { state } = cell;

    switch (state) {
      case CellStateTypes.MISS: {
        cell.state = CellStateTypes.MISS;
        this.currentPlayerId = enemyId;
        return {
          ...response,
          nextPlayerId: enemyId,
          status: StatusTypes.MISS,
        };
      }
      case CellStateTypes.SHOT: {
        cell.state = CellStateTypes.SHOT;
        this.currentPlayerId = enemyId;
        return {
          ...response,
          nextPlayerId: enemyId,
          status: StatusTypes.SHOT,
        };
      }
      case CellStateTypes.EMPTY: {
        this.currentPlayerId = enemyId;
        cell.state = CellStateTypes.MISS;

        return {
          ...response,
          nextPlayerId: enemyId,
        };
      }
      case CellStateTypes.SHIP: {
        this.currentPlayerId = indexPlayer;
        cell.state = CellStateTypes.SHOT;

        const killedShipId = cell.ship.addDamage();
        const ships = this.ships.get(enemyId);

        if (killedShipId || killedShipId === 0) {
          const ship = ships[killedShipId];
          if (ship) {
            ship.length = 0;
          }

          const isEveryShipKilled = ships.every(({ length }) => !length);
          if (isEveryShipKilled) {
            return {
              ...response,
              nextPlayerId: indexPlayer,
              status: StatusTypes.KILLED,
              winPlayer: indexPlayer,
            };
          }

          const cellsAround = this.getCellsAround(killedShipId, board);
          return {
            ...response,
            nextPlayerId: indexPlayer,
            status: StatusTypes.KILLED,
            cellsAround,
          };
        }

        return {
          ...response,
          nextPlayerId: indexPlayer,
          status: StatusTypes.SHOT,
        };
      }
    }
  }

  private getCellsAround(shipId: number, board: Cell[][]): CellAround[] {
    const cellsAround: CellAround[] = [];
    const shipCells = board.flatMap((row, x) =>
      row.map((cell, y) => ({ cell, x, y })).filter(({ cell }) => cell.shipId === shipId),
    );

    for (const { x, y } of shipCells) {
      cellsAround.push({
        status: StatusTypes.KILLED,
        position: { x, y },
      });

      for (let dx = -1; dx <= 1; dx += 1) {
        for (let dy = -1; dy <= 1; dy += 1) {
          const nx = x + dx;
          const ny = y + dy;

          if (this.isValidCoordinate(nx, ny)) {
            const neighborCell = board[nx][ny];

            if (neighborCell.state !== CellStateTypes.SHOT && neighborCell.shipId !== shipId) {
              cellsAround.push({
                status: StatusTypes.MISS,
                position: { x: nx, y: ny },
              });
            }
          }
        }
      }
    }

    return cellsAround;
  }
}

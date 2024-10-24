import { WebSocket } from 'ws';
import { CellStateTypes, ShipTypes } from '../enums/game-enums';
import { Ship } from '../core/ship';

export interface Player {
  name: string;
  password: string;
  wins: number;
}

export interface RoomPlayer {
  index: number;
  name: string;
}

export interface Client {
  index: number;
  name: string;
  ws: WebSocket;
}

export interface Message<T> {
  type: string;
  data: T;
  id: number;
}

export interface RegRequestData {
  name: string;
  password: string;
}

export interface RegResponseData {
  name: string;
  index: number | string;
  error: boolean;
  errorText: string;
}

export interface AddUserToRoomRequestData {
  indexRoom: number | string;
}

export interface CreateGameResponseData {
  idGame: number | string;
  idPlayer: number | string;
}

export interface UpdateWinnersResponseDataItem {
  name: string;
  wins: number;
}

export interface UpdateRoomResponseDataItem {
  roomId: number | string;
  roomUsers: RoomPlayer[];
}

export interface ShipData {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: ShipTypes;
}

export interface AddShipsRequestData {
  gameId: number | string;
  ships: ShipData[];
  indexPlayer: number | string /* id of the player in the current game session */;
}

export interface StartGameResponseData {
  ships: ShipData[] /* player's ships, not enemy's */;
  currentPlayerIndex: number | string /* id of the player in the current game session, who have sent his ships */;
}

export interface TurnResponseData {
  currentPlayer: number | string;
}

export interface Cell {
  state: CellStateTypes;
  shipId?: number;
  instance?: Ship;
}

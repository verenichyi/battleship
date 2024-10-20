import { WebSocket } from 'ws';
export interface Player {
  name: string;
  password: string;
  wins: number;
}

export interface RoomPlayer {
  index: number;
  name: string;
}

export interface Game {
  id: number | string;
  players: Player[];
  ships: any[];
  currentPlayerId: number | string;
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

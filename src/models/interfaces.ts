export interface Player {
    name: string;
    password: string;
    id: number | string;
    wins: number;
}

export interface Room {
    roomId: number | string;
    players: Player[];
}

export interface Game {
    gameId: number | string;
    players: Player[];
    ships: any[];
    currentPlayerId: number | string;
}

export interface Winner {
    name: string;
    wins: number;
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

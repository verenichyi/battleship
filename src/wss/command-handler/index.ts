import { WebSocket } from "ws";
import { Duplex } from "node:stream";
import { AddUserToRoomRequestData, Message, Player, RegRequestData, Room } from "../models/interfaces";
import { MessageData } from "../models/types";
import { MessageTypes } from "../enums/messageTypes";
import { parseWsResponseMessage } from "../helpers";
import PlayersDb from "../db/players-db";
import GamesDb from "../db/games-db";
import RoomsDb from "../db/rooms-db";
import WinnersDb from "../db/winners-db";

class CommandHandler {
    constructor(private playerDb: PlayersDb = new PlayersDb(),
                private gamesDb: GamesDb = new GamesDb(),
                private roomsDb: RoomsDb = new RoomsDb(),
                private winnersDb: WinnersDb = new WinnersDb()
    ) {
    }

    handleCommand(ws: WebSocket, wsStream: Duplex, message: Message<MessageData>): void {
        const { type, data, id } = message;
        switch (type) {
            case MessageTypes.REG:
                this.handleRegistration(wsStream, data as RegRequestData, id);
                break;
            case MessageTypes.CREATE_ROOM:
                this.handleCreateRoom(wsStream, id);
                break;
        }
    }

    handleRegistration(wsStream: Duplex, data: RegRequestData, id: number): void {
        const existingPlayer = this.playerDb.findOne(data.name);
        if (existingPlayer) {
            if (existingPlayer.password === data.password) {
                wsStream.write(parseWsResponseMessage({ type: MessageTypes.REG, data: { name: data.name, index: existingPlayer.id, error: false, errorText: '' }, id }));
            } else {
                wsStream.write(parseWsResponseMessage({
                    type: MessageTypes.REG,
                    data: { name: data.name, index: existingPlayer.id, error: true, errorText: 'Incorrect password' },
                    id
                }));
            }
        } else {
            const newPlayer: Player = { name: data.name, password: data.password, id: this.playerDb.players.length + 1, wins: 0 };
            this.playerDb.create(newPlayer);
            wsStream.write(parseWsResponseMessage({ type: MessageTypes.REG, data: { name: data.name, index: newPlayer.id, error: false, errorText: '' }, id }));
        }
    }

    handleCreateRoom(wsStream: Duplex, id: number): void {
        const roomIndex = this.roomsDb.rooms.length + 1;
        const room: Room = { roomId: roomIndex, players: [] };
        this.roomsDb.rooms.push(room);
        wsStream.write(JSON.stringify({ type: MessageTypes.CREATE_ROOM, data: { roomIndex }, id }));
        // updateRooms();
    }

    handleAddUserToRoom(wsStream: Duplex, data: AddUserToRoomRequestData, id: number): void {
        const room = this.roomsDb.findOne(data.indexRoom);
        if (room) {
            wsStream.write(parseWsResponseMessage({ type: MessageTypes.CREATE_GAME, data: { idGame: room.roomId, idPlayer: room.players.length + 1 }, id }));
        }
    }
}

export default CommandHandler;
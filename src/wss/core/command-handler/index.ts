import { WebSocket } from 'ws';
import { Duplex } from 'node:stream';
import {
  AddShipsRequestData,
  AddUserToRoomRequestData,
  Client,
  Message,
  Player,
  RegRequestData,
  RoomPlayer,
} from '../../models/interfaces';
import { MessageData } from '../../models/types';
import { MessageTypes } from '../../enums/messageTypes';
import { parseWsResponseMessage } from '../../helpers';
import { logMessage } from '../../helpers/logMessage';
import { Game } from '../game';

class CommandHandler {
  private players: Map<number, Player> = new Map();
  private rooms: Map<number, RoomPlayer[]> = new Map();
  private games: Map<number, Game> = new Map();
  private clients: Map<WebSocket, Client> = new Map();

  constructor() {}

  handleCommand(ws: WebSocket, wsStream: Duplex, message: Message<MessageData>): void {
    const { type, data } = message;
    logMessage('req', message);

    switch (type) {
      case MessageTypes.REG:
        this.handleRegistration(ws, wsStream, data as RegRequestData);
        break;
      case MessageTypes.CREATE_ROOM:
        this.createRoom(ws);
        break;
      case MessageTypes.ADD_USER_TO_ROOM:
        this.addUserToRoom(ws, data as AddUserToRoomRequestData);
        break;
      case MessageTypes.ADD_SHIPS:
        this.addShips(ws, data as AddShipsRequestData);
        break;
    }
  }

  handleRegistration(ws: WebSocket, wsStream: Duplex, data: RegRequestData): void {
    const existingPlayer = Object.entries(this.players).find(([_, player]) => player.name === data.name);
    const handleClose = () => {
      ws.on('close', () => {
        const client = this.clients.get(ws);
        this.clients.delete(ws);
        this.updateRooms();
      });
    };

    if (!existingPlayer) {
      const index = this.players.size;
      this.players.set(index, { ...data, wins: 0 });

      const response = {
        type: MessageTypes.REG,
        data: {
          name: data.name,
          index,
          error: false,
          errorText: '',
        },
        id: 0,
      };

      this.clients.set(ws, { ws, index, name: data.name });
      wsStream.write(parseWsResponseMessage(response));
      logMessage('res', response);
      handleClose();
    } else {
      const [id, player] = existingPlayer;
      const response = {
        type: MessageTypes.REG,
        data: {
          name: data.name,
          index: +id,
          error: false,
          errorText: '',
        },
        id: 0,
      };

      if (player.password !== data.password) {
        response.data.error = true;
        response.data.errorText = 'Incorrect password';

        wsStream.write(parseWsResponseMessage(response));
        logMessage('res', response);
        return;
      }

      this.clients.set(ws, { ws, index: +id, name: data.name });
      wsStream.write(parseWsResponseMessage(response));
      logMessage('res', response);
      handleClose();
    }

    this.updateRooms();
    this.updateWinners();
  }

  updateRooms() {
    const availableRooms = Array.from(this.rooms.entries())
      .filter(([_, roomUsers]) => {
        if (roomUsers.length !== 1) return false;

        const client = Array.from(this.clients.values()).find((client) => client.index === roomUsers[0].index);
        return client && client?.ws.readyState === WebSocket.OPEN;
      })
      .map(([roomId, roomUsers]) => ({ roomId: +roomId, roomUsers }));

    const response = {
      type: MessageTypes.UPDATE_ROOM,
      data: availableRooms,
      id: 0,
    };

    this.clients.forEach((_, ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(parseWsResponseMessage(response));
        logMessage('res', response);
      }
    });
  }

  addWinner(id: number): void {
    const winner = this.players.get(id);
    if (winner) {
      winner.wins += 1;
    }
  }

  updateWinners() {
    const winners = Array.from(this.players.values())
      .filter((player) => player.wins > 0)
      .sort((a, b) => b.wins - a.wins);

    const response = {
      type: MessageTypes.UPDATE_WINNERS,
      data: winners,
      id: 0,
    };

    this.clients.forEach((_, ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(parseWsResponseMessage(response));
        logMessage('res', response);
      }
    });
  }

  createRoom(ws: WebSocket): void {
    const client = this.clients.get(ws);
    this.rooms.set(client.index, [{ name: client.name, index: client.index }]);
    this.updateRooms();
  }

  addUserToRoom(ws: WebSocket, data: AddUserToRoomRequestData): void {
    const { indexRoom } = data;
    const client = this.clients.get(ws);
    const room = this.rooms.get(+indexRoom);
    const roomOwner = room[0].index;

    if (roomOwner === client.index) {
      logMessage('res', 'You already in this room as owner!');
      return;
    }

    room.push({ name: client.name, index: client.index });
    this.rooms.set(+indexRoom, room);
    this.rooms.delete(+indexRoom);

    const playersIds = room.map((player) => player.index);

    this.createGame(playersIds);
    this.updateRooms();
  }

  createGame(playersIds: number[]): void {
    const idGame = this.games.size;
    const game = new Game(playersIds);
    this.games.set(idGame, game);
    const clients = Array.from(this.clients.values()).filter((client) => playersIds.includes(client.index));

    clients.forEach((client) => {
      const response = {
        type: MessageTypes.CREATE_GAME,
        data: {
          idGame,
          idPlayer: client.index,
        },
        id: 0,
      };

      client.ws.send(parseWsResponseMessage(response));
      logMessage('res', response);
    });
  }

  addShips(ws: WebSocket, data: AddShipsRequestData) {
    const client = this.clients.get(ws);
    const { gameId, ships } = data;
    const gameBoard = this.games.get(+gameId);

    if (gameBoard) {
      const dataBoard = gameBoard.addShips(client.index, ships);

      if (dataBoard) {
        const turnResponse = {
          type: MessageTypes.TURN,
          data: {
            currentPlayer: client.index,
          },
          id: 0,
        };

        Array.from(dataBoard.entries()).forEach(([playerId, ships]) => {
          const response = {
            type: MessageTypes.START_GAME,
            data: { ships: ships, currentPlayerIndex: playerId },
            id: 0,
          };

          const client = Array.from(this.clients.values()).find((client) => client.index === playerId);

          if (client) {
            [response, turnResponse].forEach((res) => {
              client.ws.send(parseWsResponseMessage(res));
              logMessage('res', res);
            });
          }
        });
      }
    }
  }
}

export default CommandHandler;

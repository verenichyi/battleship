import { Duplex } from "node:stream";
import { Player, RegRequestData } from "../models/interfaces";
import { parseWsResponseMessage } from "../helpers";

const players: Player[] = [];
export const handleRegistration = (ws: Duplex, data: RegRequestData, id: number): void => {
    const existingPlayer = players.find(player => player.name === data.name);
    if (existingPlayer) {
        if (existingPlayer.password === data.password) {
            ws.write(parseWsResponseMessage({ type: 'reg', data: { name: data.name, index: existingPlayer.id, error: false, errorText: '' }, id }));
        } else {
            ws.write(parseWsResponseMessage({ type: 'reg', data: { name: data.name, index: existingPlayer.id, error: true, errorText: 'Incorrect password' }, id }));
        }
    } else {
        const newPlayer: Player = { name: data.name, password: data.password, id: players.length + 1, wins: 0 };
        players.push(newPlayer);
        ws.write(parseWsResponseMessage({ type: 'reg', data: { name: data.name, index: newPlayer.id, error: false, errorText: '' }, id }));
    }
}
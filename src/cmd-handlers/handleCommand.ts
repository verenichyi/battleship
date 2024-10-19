import { Duplex } from "node:stream";
import { handleRegistration } from "./handleRegistration";
import { Message, RegRequestData } from "../models/interfaces";
import { MessageData } from "../models/types";

export const handleCommand = (ws: Duplex, message: Message<MessageData>): void => {
    const { type, data, id } = message;
    switch (type) {
        case 'reg':
            handleRegistration(ws, data as RegRequestData, id);
            break;
        // case 'create_room':
        //     handleCreateRoom(ws, data, id);
        //     break;
        // case 'add_user_to_room':
        //     handleAddUserToRoom(ws, data, id);
        //     break;
        // case 'add_ships':
        //     handleAddShips(ws, data, id);
        //     break;
        // case 'attack':
        //     handleAttack(ws, data, id);
        //     break;
        default:
            ws.write(JSON.stringify({ type: 'error', data: JSON.stringify({ error: true, errorText: 'Unknown command' }), id }));
    }
}
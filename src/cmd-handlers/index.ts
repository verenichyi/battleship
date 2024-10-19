import { createWebSocketStream } from 'ws';
import { parseWsRequestMessage } from "../helpers";
import { handleCommand } from "./handleCommand";

const handleMessage = async (ws, client) => {
    const wsStream = createWebSocketStream(ws, { encoding: 'utf8', decodeStrings: false });

    wsStream.on('data', async (message) => {
        try {
            const request = parseWsRequestMessage(message);
            handleCommand(wsStream, request);
        } catch (error) {
            ws.send(JSON.stringify({ type: 'error', data: { error: true, errorText: 'Invalid message format' }, id: 0 }));
        }
    });
};

export default handleMessage;
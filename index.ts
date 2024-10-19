import { createWebSocketStream, WebSocket, WebSocketServer } from 'ws';
import { httpServer } from './src/http_server';
import { parseWsRequestMessage } from "./src/helpers";
import CommandHandler from "./src/command-handler";


const HTTP_PORT = 8181;
httpServer.listen(HTTP_PORT, () => console.log(`Start static http server on the ${HTTP_PORT} port!`));

const WS_PORT = 3000;
const wss = new WebSocketServer({ port: WS_PORT }, () => console.log(`WebSocket server start on the ${WS_PORT} port!`));

const commandHandler = new CommandHandler();
const handleMessage = async (ws: WebSocket, client: string) => {
    const wsStream = createWebSocketStream(ws, { encoding: 'utf8', decodeStrings: false });

    wsStream.on('data', async (message) => {
        try {
            const request = parseWsRequestMessage(message);
            console.log({ request })
            commandHandler.handleCommand(ws, wsStream, request);
        } catch (error) {
            ws.send(JSON.stringify({ type: 'error', data: { error: true, errorText: 'Invalid message format' }, id: 0 }));
        }
    });
};

wss.on('connection', async (ws, req) => {
    const clientAddress = req.headers['origin'];
    console.log(`Client ${clientAddress} connected!`);

    await handleMessage(ws, clientAddress);

    ws.on('close', () => {
        ws.close();
        console.log(`Client ${clientAddress} disconnected!`);
    });
});
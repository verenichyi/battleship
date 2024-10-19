import { WebSocketServer } from 'ws';
import { httpServer } from './src/http_server';
import handleMessage from './src/cmd-handlers';

const HTTP_PORT = 8181;
httpServer.listen(HTTP_PORT, () => console.log(`Start static http server on the ${HTTP_PORT} port!`));

const WS_PORT = 3000;
const wss = new WebSocketServer({ port: WS_PORT }, () => console.log(`WebSocket server start on the ${WS_PORT} port!`));

wss.on('connection', async (ws, req) => {
    const clientAddress = req.headers['origin'];
    console.log(`Client ${clientAddress} connected!`);

    await handleMessage(ws, clientAddress);

    ws.on('close', () => {
        ws.close();
        console.log(`Client ${clientAddress} disconnected!`);
    });
});
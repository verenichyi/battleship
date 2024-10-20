import { createWebSocketStream, WebSocket, WebSocketServer } from 'ws';
import { httpServer } from './src/http_server';
import { parseWsRequestMessage } from './src/wss/helpers';
import CommandHandler from './src/wss/command-handler';

const HTTP_PORT = 8181;
httpServer.listen(HTTP_PORT, () =>
    console.log(`Start static http server on the ${HTTP_PORT} port!`),
);

class WSS {
    private WS_PORT = 3000;
    private wss: WebSocketServer;
    private commandHandler: CommandHandler;

    constructor() {
        this.wss = new WebSocketServer({ port: this.WS_PORT });
        this.commandHandler = new CommandHandler();
    }

    async handleMessage(ws: WebSocket, client: string) {
        const wsStream = createWebSocketStream(ws, {
            encoding: 'utf8',
            decodeStrings: false,
        });

        wsStream.on('data', async (message) => {
            try {
                const request = parseWsRequestMessage(message);
                console.log({ request });
                this.commandHandler.handleCommand(ws, wsStream, request);
            } catch (error) {
                console.log(error);
            }
        });
    };

    async startWSS() {
        try {
            this.wss
                .on('connection', async (ws, req) => {
                    const clientAddress = req.headers['origin'];
                    console.log(`Client ${clientAddress} connected!`);

                    await this.handleMessage(ws, clientAddress);

                    ws.on('close', () => {
                        ws.close();
                        console.log(`Client ${clientAddress} disconnected!`);
                    });
                })
                .on('listening', () => {
                    console.log(`WebSocket server start on the ${this.WS_PORT} port!`);
                })
                .on('error', (err) => console.error(err))
                .on('close', () => {
                    this.wss.clients.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.close();
                        }
                    });

                    console.log('WSS closed');
                });
        } catch (error) {
            console.error(error);
        }
    }
}

const wss = new WSS();
await wss.startWSS();

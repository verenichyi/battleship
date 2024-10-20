import { createWebSocketStream, WebSocket, WebSocketServer } from 'ws';
import CommandHandler from './command-handler';
import { parseWsRequestMessage } from './helpers';
import { logError } from './helpers/logMessage';

class WSS {
  private wss: WebSocketServer;
  private commandHandler: CommandHandler;

  constructor(private readonly WS_PORT: number) {
    this.wss = new WebSocketServer({ port: this.WS_PORT });
    this.commandHandler = new CommandHandler();
  }

  async handleMessage(ws: WebSocket) {
    const wsStream = createWebSocketStream(ws, {
      encoding: 'utf8',
      decodeStrings: false,
    });

    wsStream.on('data', async (message) => {
      try {
        const request = parseWsRequestMessage(message);
        this.commandHandler.handleCommand(ws, wsStream, request);
      } catch (error) {
        logError(error.message);
      }
    });
  }

  startWSS() {
    try {
      this.wss
        .on('connection', async (ws) => {
          await this.handleMessage(ws);

          ws.on('close', () => {
            ws.close();
          });
        })
        .on('listening', () => {
          console.log(`WebSocket server start on the ${this.WS_PORT} port!\n`);
        })
        .on('error', (error) => logError(error.message))
        .on('close', () => {
          this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.close();
            }
          });

          console.log('WSS closed\n');
        });
    } catch (error) {
      logError(error.message);
    }
  }
}

export const createWSS = (WS_PORT: number) => new WSS(WS_PORT);

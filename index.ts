import { httpServer } from './src/http_server';
import { createWSS } from './src/wss';

const HTTP_PORT = 8181;
httpServer.listen(HTTP_PORT, () => console.log(`Start static http server on the ${HTTP_PORT} port!`));

const WS_PORT = 3000;
const wss = createWSS(WS_PORT);
wss.startWSS()
process.on('SIGINT', () => wss.close());

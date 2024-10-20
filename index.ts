import { httpServer } from './src/http_server';
import { createWSS } from './src/wss';

const HTTP_PORT = 8181;
httpServer.listen(HTTP_PORT, () => console.log(`Start static http server on the ${HTTP_PORT} port!`));

const WS_PORT = 3000;
createWSS(WS_PORT).startWSS();

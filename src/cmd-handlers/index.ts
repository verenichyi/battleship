import { createWebSocketStream } from 'ws';

const handleMessage = async (ws, client) => {
	const wsStream = createWebSocketStream(ws, { encoding: 'utf8', decodeStrings: false });

	wsStream.on('data', async (message) => {
		console.log(`${client} executed: ${message}`);
	});
};

export default handleMessage;
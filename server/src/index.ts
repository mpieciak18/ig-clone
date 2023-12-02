import * as dotenv from 'dotenv';
dotenv.config();
import { config } from './config/index';
import app from './server';
// imports for websockets
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import {
	handleInputErrors,
	retrieveUserFromToken,
	createMessage,
} from './modules/websocket';

// configure websockets
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer);

// validates an incoming message from a websocket
io.use((socket, next) => {
	const token = socket.handshake.auth.token;

	// Verify token
	try {
		const user = retrieveUserFromToken(token);
		// @ts-ignore
		socket.user = user;
		next();
	} catch (e) {
		next(e);
	}
});

//
io.on('connection', (socket) => {
	console.log('a user connected');

	socket.on('sendMessage', (message) => {
		const errors = handleInputErrors(message);
		if (errors) {
			socket.emit('inputError', errors);
			return;
		}

		// @ts-ignore
		await createMessage(data, socket, socket.decoded);

		io.emit('newMessage', message);
	});

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

httpServer.listen(config.port, () => {
	console.log(`hello on http://localhost:${config.port}`);
});

// error handling
process.on('uncaughtException', () => {
	console.log('uncaught exception (sync) at top level of node process');
});

process.on('unhandledRejection', () => {
	console.log('unhandled rejection (async) at top level of node process');
});

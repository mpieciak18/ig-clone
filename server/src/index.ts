import * as dotenv from 'dotenv';
dotenv.config();
import { config } from './config/index';
import app from './server';
// imports for websockets
import { createServer } from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';
import {
	handleInputErrors,
	retrieveUserFromToken,
	createMessage,
} from './modules/websocket';
import { ExtendedError } from 'socket.io/dist/namespace';
import { JwtPayload } from 'jsonwebtoken';
import { SocketMessage, SocketMessageErr, SocketWithUser } from './types/types';
import { Message } from '@prisma/client';

// configure websockets
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
	cors: {
		origin: process.env.CLIENT_URL,
		methods: ['GET', 'POST'],
		credentials: true,
	},
});

// validates an incoming message from a websocket
io.use((socket: Socket, next: (err?: ExtendedError) => void) => {
	const token = socket.handshake.auth.token;

	// Verify token
	try {
		const user: string | JwtPayload = retrieveUserFromToken(token);
		// @ts-ignore
		socket.user = user;
		next();
	} catch (e) {
		next(e);
	}
});

io.on('connection', (socket: SocketWithUser) => {
	console.log('connected');
	socket.on('joinConversation', ({ conversationId }) => {
		console.log('a user connected');
		socket.join(conversationId);
	});

	socket.on('sendNewMessage', async (message: SocketMessage) => {
		const errors: SocketMessageErr[] | null = handleInputErrors(message);
		if (errors) {
			socket.emit('inputError', errors);
			return;
		}
		// @ts-ignore
		const dbEntry: Message = await createMessage(
			message,
			socket,
			socket.user
		);
		io.to(message.id).emit('receiveNewMessage', dbEntry);
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

import prisma from '../db';
import jwt from 'jsonwebtoken';

// Middleware for creating new messages from websocket
export const createMessage = async (data, socket, user) => {
	try {
		const message = await prisma.message.create({
			data: {
				conversationId: data.id,
				senderId: user.id,
				message: data.message,
			},
		});

		if (message) {
			socket.emit('newMessage', message);
			return message;
		} else {
			// Handle error: No message created
			socket.emit('error', { message: 'Message creation failed.' });
		}
	} catch (e) {
		// Handle database error
		socket.emit('error', { message: 'Database error occurred.' });
	}
};

// Middleware for validating inputs within websocket
const isInt = (value) => typeof value === 'number' && value % 1 === 0;

const isString = (value) => typeof value === 'string';

export const handleInputErrors = (message) => {
	const errors = [];

	if (!isInt(message.id)) {
		errors.push({ message: 'Invalid id, must be an integer.' });
	}

	if (!isString(message.message)) {
		errors.push({ message: 'Invalid message, must be a string.' });
	}

	return errors.length > 0 ? errors : null;
};

// Middleware for validating JWT token from websocket
export const retrieveUserFromToken = (token) => {
	if (!token) {
		return new Error('Authentication error');
	}

	try {
		const user = jwt.verify(token, process.env.JWT_SECRET);
		return user;
	} catch (e) {
		return new Error('Authentication error');
	}
};

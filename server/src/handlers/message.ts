import prisma from '../db';

// Creates a message
export const createMessage = async (req, res, next) => {
	// First, attempt to create message
	let message;
	try {
		message = await prisma.message.create({
			data: {
				conversationId: req.body.id,
				senderId: req.user.id,
				message: req.body.message,
			},
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}

	// If no message is created, handle it at the top-level (server.ts) as 500 error
	if (!message) {
		const e = new Error();
		next(e);
		return;
	}

	// Second, send message data back to client
	res.json({ message });
};

// Gets messages from user
export const getMessages = async (req, res, next) => {
	// First, get all messages from user
	// If no messages are found, handle it at the top-level (server.ts) as 500 error
	let messages;
	try {
		messages = await prisma.message.findMany({
			where: {
				conversationId: req.body.id,
			},
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}
	if (!messages) {
		const e = new Error();
		next(e);
		return;
	}

	// Second, return messages back to client
	res.json({ messages });
};

// Deletes a message
export const deleteMessage = async (req, res, next) => {
	// First, attempt to delete the message
	let message;
	try {
		message = await prisma.message.delete({
			where: { id: req.body.id },
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}

	// If no message is found-and-deleted, handle it at the top-level (server.ts) as 500 error
	if (!message) {
		const e = new Error();
		next(e);
		return;
	}

	// Finally, send deleted message back to client
	res.json({ message });
};

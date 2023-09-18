import prisma from '../db';

// Creates a conversation
export const createConversation = async (req, res, next) => {
	// First, attempt to create conversation
	let conversation;
	try {
		conversation = await prisma.conversation.create({
			data: {
				users: {
					connect: [{ id: req.user.id }, { id: req.body.id }],
				},
			},
			include: {
				users: true,
				messages: true,
			},
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}

	// If no conversation is created, handle it at the top-level (server.ts) as 500 error
	if (!conversation) {
		const e = new Error();
		next(e);
		return;
	}

	// Second, send conversation data back to client
	res.json({ conversation });
};

// Gets conversation by id
export const getConversation = async (req, res, next) => {
	// First, get single conversation by id
	// If no conversations are found, handle it at the top-level (server.ts) as 500 error
	let conversation;
	try {
		conversation = await prisma.conversation.findUnique({
			where: {
				id: req.body.id,
			},
			include: {
				users: true,
				messages: true,
			},
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}
	if (!conversation) {
		const e = new Error();
		next(e);
		return;
	}

	// Second, return conversation back to client
	res.json({ conversation });
};

// Gets conversations from user
export const getConversations = async (req, res, next) => {
	// First, get all conversations from user
	// If no conversations are found, handle it at the top-level (server.ts) as 500 error
	let conversations;
	try {
		conversations = await prisma.conversation.findMany({
			where: {
				users: {
					some: {
						id: req.user.id,
					},
				},
			},
			include: {
				users: true,
				messages: true,
			},
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}
	if (!conversations) {
		const e = new Error();
		next(e);
		return;
	}

	// Second, return conversations back to client
	res.json({ conversations });
};

// Deletes a conversation
export const deleteConversation = async (req, res, next) => {
	// First, attempt to delete the conversation
	let conversation;
	try {
		conversation = await prisma.conversation.delete({
			where: { id: req.body.id },
			include: {
				users: true,
				messages: true,
			},
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}

	// If no conversation is found-and-deleted, handle it at the top-level (server.ts) as 500 error
	if (!conversation) {
		const e = new Error();
		next(e);
		return;
	}

	// Finally, send deleted conversation back to client
	res.json({ conversation });
};

import prisma from '../db';

// Creates a new follow
export const createFollow = async (req, res, next) => {
	// First, confirm other user exists
	let otherUser;
	try {
		otherUser = await prisma.user.findUnique({
			where: { id: req.body.id },
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}

	// If no user is found, handle it at the top-level (server.ts) as 500 error
	if (!otherUser) {
		const e = new Error();
		next(e);
		return;
	}

	// Second, create follow
	let follow;
	try {
		follow = prisma.follow.create({
			data: { giverId: req.user.id, receiverId: req.body.id },
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}

	// If no follow is created, handle it at the top-level (server.ts) as 500 error
	if (!follow) {
		const e = new Error();
		next(e);
		return;
	}

	// Third (and finally), send follow data back to client
	res.json({ follow });
};

// Deletes a follow
export const deleteFollow = async (req, res, next) => {
	// First, delete follow
	let follow;
	try {
		follow = prisma.follow.delete({
			where: { id: req.body.id },
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}

	// If no follow is found-and-deleted, handle it at the top-level (server.ts) as 500 error
	if (!follow) {
		const e = new Error();
		next(e);
		return;
	}

	// Send deleted follow data back to client
	res.json({ follow });
};

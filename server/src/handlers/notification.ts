import prisma from '../db';

// Creates a new notification
export const createNotif = async (req, res, next) => {
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

	// Second, create notification
	let notification;
	try {
		notification = await prisma.notification.create({
			data: {
				userId: req.user.id,
				message: req.body.message,
				urlPath: req.body.urlPath,
				read: false,
			},
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}

	// If no notification is created, handle it at the top-level (server.ts) as 500 error
	if (!notification) {
		const e = new Error();
		next(e);
		return;
	}

	// Third (and finally), send notification data back to client
	res.json({ notification });
};

// Deletes a notification
export const deleteNotif = async (req, res, next) => {
	// First, delete notification
	let notification;
	try {
		notification = await prisma.notification.delete({
			where: { id: req.body.id },
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}

	// If no notification is found-and-deleted, handle it at the top-level (server.ts) as 500 error
	if (!notification) {
		const e = new Error();
		next(e);
		return;
	}

	// Send deleted follow data back to client
	res.json({ notification });
};

// Gets the user's unread notifications
export const getNotifsUnread = async (req, res, next) => {
	// First, try to get unread notifications
	// If nothing is return (as oppposed to an empty array),
	// then handle it at the top-level (server.ts) as 500 error
	let notifs;
	try {
		notifs = await prisma.notification.findMany({
			where: { userId: req.user.id, read: false },
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}
	if (!notifs) {
		const e = new Error();
		next(e);
		return;
	}

	// Second, retrieve given follows
	let givenFollows;
	try {
		givenFollows = await prisma.follow.findMany({
			where: { giverId: req.body.id },
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}

	// Third, return given follows back to client
	res.json({ follows: givenFollows });
};

// Gets the user's read notifications
export const getNotifsRead = async (req, res, next) => {
	// First, try to get unread notifications
	// If nothing is return (as oppposed to an empty array),
	// then handle it at the top-level (server.ts) as 500 error
	let notifs;
	try {
		notifs = await prisma.notification.findMany({
			where: { userId: req.user.id, read: true },
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}
	if (!notifs) {
		const e = new Error();
		next(e);
		return;
	}

	// Second, retrieve given follows
	let givenFollows;
	try {
		givenFollows = await prisma.follow.findMany({
			where: { giverId: req.body.id },
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}

	// Third, return given follows back to client
	res.json({ follows: givenFollows });
};

// Updates a notification (as read)
export const updateNotifRead = async (req, res, next) => {
	// Update notification
	let notification;
	try {
		notification = await prisma.notification.update({
			where: { id: req.body.id },
			data: { read: true },
		});
	} catch (e) {
		// If error, handle it as a 500 error
		next(e);
		return;
	}

	// While the previous try/catch (along with the 'protect' middleware) should catch all errors,
	// this is added as an extra step of error handling (in case the update 'runs' but nothing is returned).
	if (!notification) {
		const e = new Error();
		next(e);
		return;
	}

	// Return updated user data
	res.json({ notification });
};

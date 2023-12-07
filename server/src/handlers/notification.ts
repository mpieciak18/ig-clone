import { NextFunction, Response } from 'express';
import prisma from '../db';
import {
	AuthReq,
	HasId,
	HasLimit,
	HasType,
	MayHavePostId,
	NewNotificationData,
	NotificationWithOtherUser,
} from '../types/types';
import { Notification, User } from '@prisma/client';

// Creates a new notification
export const createNotif = async (
	req: AuthReq & HasType & HasId & MayHavePostId,
	res: Response,
	next: NextFunction
) => {
	// First, confirm other user exists
	let otherUser: User | undefined;
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
	let notification: Notification | undefined;
	const data: NewNotificationData = {
		userId: req.body.id,
		otherUserId: req.user.id,
		type: req.body.type,
		read: false,
	};
	// @ts-ignore
	if (req.body.postId) data.postId = req.body.postId;
	try {
		notification = await prisma.notification.create({
			data,
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
export const deleteNotif = async (
	req: AuthReq & HasId,
	res: Response,
	next: NextFunction
) => {
	// First, delete notification
	let notification: Notification | undefined;
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
export const getNotifsUnread = async (
	req: AuthReq & HasLimit,
	res: Response,
	next: NextFunction
) => {
	// First, try to get unread notifications
	// If nothing is return (as oppposed to an empty array),
	// then handle it at the top-level (server.ts) as 500 error
	let notifications: NotificationWithOtherUser[] | undefined;
	try {
		notifications = await prisma.notification.findMany({
			where: { userId: req.user.id, read: false },
			orderBy: { createdAt: 'desc' },
			take: req.body.limit,
			include: { otherUser: true },
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}
	if (!notifications) {
		const e = new Error();
		next(e);
		return;
	}

	// Second, return unread notifications back to client
	res.json({ notifications });
};

// Gets the user's read notifications
export const getNotifsRead = async (
	req: AuthReq & HasLimit,
	res: Response,
	next: NextFunction
) => {
	// First, try to get read notifications
	// If nothing is return (as oppposed to an empty array),
	// then handle it at the top-level (server.ts) as 500 error
	let notifications: NotificationWithOtherUser[] | undefined;
	try {
		notifications = await prisma.notification.findMany({
			where: { userId: req.user.id, read: true },
			orderBy: { createdAt: 'desc' },
			take: req.body.limit,
			include: { otherUser: true },
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}
	if (!notifications) {
		const e = new Error();
		next(e);
		return;
	}

	// Second, return read notifications back to client
	res.json({ notifications });
};

// Updates all notifications (as read)
export const updateNotifsRead = async (
	req: AuthReq,
	res: Response,
	next: NextFunction
) => {
	// Update notification
	let response: { count: number } | undefined;
	try {
		response = await prisma.notification.updateMany({
			data: { read: true },
		});
	} catch (e) {
		// If error, handle it as a 500 error
		next(e);
		return;
	}

	// While the previous try/catch (along with the 'protect' middleware) should catch all errors,
	// this is added as an extra step of error handling (in case the update 'runs' but nothing is returned).
	if (!response.count) {
		const e = new Error();
		next(e);
		return;
	}

	// Return number of updated records
	res.json({ count: response.count });
};

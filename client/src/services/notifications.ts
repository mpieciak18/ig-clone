import { Notification, User } from 'shared';
import { getToken } from './localstor';

interface newNotifBody {
	type: string;
	id: number;
	postId?: number;
}

// Add new notification to other user when logged-in user performs a trigger
// Triggers/types include new like, new comment, new follow, and new message
export const addNotification = async (
	type: string,
	userId: number,
	postId: number | null = null
) => {
	const body: newNotifBody = { id: userId, type };
	if (postId !== null) body.postId = postId;
	const response = await fetch(
		import.meta.env.VITE_API_URL + '/api/notification',
		{
			body: JSON.stringify(body),
			method: 'POST',
			headers: {
				Authorization: `Bearer ${getToken()}`,
				'Content-Type': 'application/json',
			},
		}
	);
	if (response.status == 200) {
		const json = await response.json();
		return json.notification as Notification;
	} else {
		throw new Error();
	}
};

interface NotificationRecord extends Notification {
	otherUser: User;
}

// Retrieve logged-in user's unread notifcations
export const getUnreadNotifications = async (limit: number) => {
	const response = await fetch(
		import.meta.env.VITE_API_URL + '/api/notification/unread',
		{
			method: 'POST',
			body: JSON.stringify({ limit }),
			headers: {
				Authorization: `Bearer ${getToken()}`,
				'Content-Type': 'application/json',
			},
		}
	);
	if (response.status == 200) {
		const json = await response.json();
		return json.notifications as NotificationRecord[];
	} else {
		throw new Error();
	}
};

// Retrieve logged-in user's read notifcations
export const getReadNotifications = async (limit: number) => {
	const response = await fetch(
		import.meta.env.VITE_API_URL + '/api/notification/read',
		{
			method: 'POST',
			body: JSON.stringify({ limit }),
			headers: {
				Authorization: `Bearer ${getToken()}`,
				'Content-Type': 'application/json',
			},
		}
	);
	if (response.status == 200) {
		const json = await response.json();
		return json.notifications as NotificationRecord[];
	} else {
		throw new Error();
	}
};

// Update logged-in user's notifications as read
export const readNotifications = async () => {
	const response = await fetch(
		import.meta.env.VITE_API_URL + '/api/notification/read',
		{
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${getToken()}`,
			},
		}
	);
	if (response.status == 200) {
		const json = await response.json();
		return json.count as number;
	} else {
		throw new Error();
	}
};

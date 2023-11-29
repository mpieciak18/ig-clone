import { addNotification } from './notifications.js';
import { getToken } from './localstor.js';

// Send message from logged-in user to other user
// NOTE: user A's ID is the convo ID for user B & vice-versa
export const sendMessage = async (message, id, recipientId) => {
	const response = await fetch(
		import.meta.env.VITE_API_URL + '/api/conversation',
		{
			method: 'POST',
			body: JSON.stringify({ message, id }),
			headers: {
				Authorization: `Bearer ${getToken()}`,
				'Content-Type': 'application/json',
			},
		}
	);
	if (response.status == 200) {
		// add notification to recipient
		await addNotification('message', recipientId);
		const json = await response.json();
		return json.message;
	} else {
		throw new Error();
	}
};

// Attempt to get single conversation between to users
export const getSingleConvo = async (id, limit) => {
	const response = await fetch(
		import.meta.env.VITE_API_URL + '/api/conversation/otherUser',
		{
			method: 'POST',
			body: JSON.stringify({ id, limit }),
			headers: {
				Authorization: `Bearer ${getToken()}`,
				'Content-Type': 'application/json',
			},
		}
	);
	if (response.status == 200) {
		const json = await response.json();
		return json.conversation;
	} else {
		throw new Error();
	}
};

// Get all of user's conversations
export const getConvos = async (limit) => {
	const response = await fetch(
		import.meta.env.VITE_API_URL + '/api/conversation/user',
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
		return json.conversations;
	} else {
		throw new Error();
	}
};

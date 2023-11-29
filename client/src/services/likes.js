import { addNotification } from './notifications.js';
import { getToken } from './localstor.js';

// Add like to post and return the like id
export const addLike = async (postId, postOwnerId) => {
	const response = await fetch(import.meta.env.VITE_API_URL + '/api/like', {
		method: 'POST',
		body: JSON.stringify({ id: Number(postId) }),
		headers: {
			Authorization: `Bearer ${getToken()}`,
			'Content-Type': 'application/json',
		},
	});
	if (response.status == 200) {
		const json = await response.json();
		if (json.like?.id) {
			// add notification to recipient
			await addNotification('like', postOwnerId, postId);
			return json.like.id;
		} else {
			return null;
		}
	} else {
		throw new Error();
	}
};

// Remove like from post
export const removeLike = async (id) => {
	const response = await fetch(import.meta.env.VITE_API_URL + '/api/like', {
		method: 'DELETE',
		body: JSON.stringify({ id: Number(id) }),
		headers: {
			Authorization: `Bearer ${getToken()}`,
			'Content-Type': 'application/json',
		},
	});
	if (response.status == 200) {
		return;
	} else {
		throw new Error();
	}
};

// Check if user already liked post
export const likeExists = async (id) => {
	const response = await fetch(
		import.meta.env.VITE_API_URL + '/api/like/user',
		{
			method: 'POST',
			body: JSON.stringify({ id: Number(id) }),
			headers: {
				Authorization: `Bearer ${getToken()}`,
				'Content-Type': 'application/json',
			},
		}
	);
	if (response.status == 200) {
		const json = await response.json();
		return json.like?.id ? json.like.id : null;
	} else {
		throw new Error();
	}
};

// Retrieve all likes from a post
export const getLikes = async (id, limit) => {
	const response = await fetch(
		import.meta.env.VITE_API_URL + '/api/like/post',
		{
			method: 'POST',
			body: JSON.stringify({
				id: Number(id),
				limit: Number(id),
			}),
			headers: {
				Authorization: `Bearer ${getToken()}`,
				'Content-Type': 'application/json',
			},
		}
	);
	if (response.status == 200) {
		const json = await response.json();
		return json.likes;
	} else {
		throw new Error();
	}
};

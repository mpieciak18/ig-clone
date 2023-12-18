import { addNotification } from './notifications.js';
import { getToken } from './localstor.js';
import { Like, User } from 'shared';

// Add like to post and return the like id
export const addLike = async (postId: number, postOwnerId: number) => {
	const response = await fetch(import.meta.env.VITE_API_URL + '/api/like', {
		method: 'POST',
		body: JSON.stringify({ id: postId }),
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
			return json.like.id as number;
		} else {
			return null;
		}
	} else {
		throw new Error();
	}
};

// Remove like from post
export const removeLike = async (id: number) => {
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
export const likeExists = async (id: number): Promise<number | null> => {
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

interface LikeRecord extends Like {
	user: User;
}

// Retrieve all likes from a post
export const getLikes = async (id: number, limit: number) => {
	const response = await fetch(
		import.meta.env.VITE_API_URL + '/api/like/post',
		{
			method: 'POST',
			body: JSON.stringify({
				id,
				limit,
			}),
			headers: {
				Authorization: `Bearer ${getToken()}`,
				'Content-Type': 'application/json',
			},
		}
	);
	if (response.status == 200) {
		const json = await response.json();
		return json.likes as LikeRecord[];
	} else {
		throw new Error();
	}
};

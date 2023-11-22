import { addNotification } from './notifications.js';

// Add new follow
export const addFollow = async (id) => {
	const response = await fetch(import.meta.env.VITE_API_URL + '/api/follow', {
		method: 'POST',
		body: { id },
		headers: {
			Authorization: `Bearer ${getToken()}`,
		},
	});
	if (response.status == 200) {
		// add notification to recipient
		await addNotification('follow', id);
		const json = await response.json();
		return json.follow;
	} else {
		throw new Error();
	}
};

// Remove follow from other user and self
export const removeFollow = async (id) => {
	const response = await fetch(import.meta.env.VITE_API_URL + '/api/follow', {
		method: 'DELETE',
		body: { id },
		headers: {
			Authorization: `Bearer ${getToken()}`,
		},
	});
	if (response.status == 200) {
		// const json = await response.json();
		// return json.follow;
		return;
	} else {
		throw new Error();
	}
};

// Check if the signed-in user is following another user (& return follow id)
export const checkForFollow = async (id) => {
	const response = await fetch(
		import.meta.env.VITE_API_URL + '/api/follow/user',
		{
			method: 'POST',
			body: { id },
			headers: {
				Authorization: `Bearer ${getToken()}`,
			},
		}
	);
	if (response.status == 200) {
		const json = await response.json();
		return json.givenFollow?.id ? json.givenFollow.id : null;
	} else {
		throw new Error();
	}
};

// Return array of users that signed-in user follows
const getFollowing = async (id, limit) => {
	const response = await fetch(
		import.meta.env.VITE_API_URL + '/api/follow/given',
		{
			method: 'POST',
			body: { id, limit },
			headers: {
				Authorization: `Bearer ${getToken()}`,
			},
		}
	);
	if (response.status == 200) {
		const json = await response.json();
		return json.follows;
	} else {
		throw new Error();
	}
};

// Return array of users that signed-in user is followed by
export const getFollowers = async (id, limit) => {
	const response = await fetch(
		import.meta.env.VITE_API_URL + '/api/follow/received',
		{
			method: 'POST',
			body: { id, limit },
			headers: {
				Authorization: `Bearer ${getToken()}`,
			},
		}
	);
	if (response.status == 200) {
		const json = await response.json();
		return json.follows;
	} else {
		throw new Error();
	}
};

import { getToken } from './localstor.js';

// Add post to a new "save"
export const addSave = async (id) => {
	const response = await fetch(import.meta.env.VITE_API_URL + '/api/save', {
		method: 'POST',
		body: JSON.stringify({ id: Number(id) }),
		headers: {
			Authorization: `Bearer ${getToken()}`,
			'Content-Type': 'application/json',
		},
	});
	if (response.status == 200) {
		const json = await response.json();
		return json.save;
	} else {
		throw new Error();
	}
};

// Remove saved post
export const removeSave = async (id) => {
	const response = await fetch(import.meta.env.VITE_API_URL + '/api/save', {
		method: 'DELETE',
		body: JSON.stringify({ id: Number(id) }),
		headers: {
			Authorization: `Bearer ${getToken()}`,
			'Content-Type': 'application/json',
		},
	});
	if (response.status == 200) {
		const json = await response.json();
		return json.save;
	} else {
		throw new Error();
	}
};

// Retrieves saved posts
export const getSaves = async (limit) => {
	const response = await fetch(
		import.meta.env.VITE_API_URL + '/api/save/user',
		{
			method: 'POST',
			body: JSON.stringify({ limit: Number(limit) }),
			headers: {
				Authorization: `Bearer ${getToken()}`,
				'Content-Type': 'application/json',
			},
		}
	);
	if (response.status == 200) {
		const json = await response.json();
		return json.saves;
	} else {
		throw new Error();
	}
};

// Check if user saved a certain post
export const saveExists = async (id) => {
	const response = await fetch(
		import.meta.env.VITE_API_URL + '/api/save/post',
		{
			method: 'POST',
			body: JSON.stringify({ id: limit(id) }),
			headers: {
				Authorization: `Bearer ${getToken()}`,
				'Content-Type': 'application/json',
			},
		}
	);
	if (response.status == 200) {
		const json = await response.json();
		return json.save;
	} else {
		throw new Error();
	}
};

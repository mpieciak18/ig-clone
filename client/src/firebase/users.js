// Firebase modules
import { db } from './firebase.js';
import { collection, getDocs, query, where } from 'firebase/firestore';

// Get signed-in user's info from local storage
const getLocalUser = () => localStorage.getItem('markstagramUser');

// Register new user
export const newUser = async (username, name, email, password) => {
	const body = {
		email,
		username,
		password,
		name,
		bio: '',
		image: import.meta.env.VITE_DEFAULT_IMG,
	};
	const response = await fetch(
		import.meta.env.VITE_API_URL + '/create_new_user',
		{ body, method: 'POST' }
	);
	if (response.status == 200) {
		const json = await response.json();
		const newUser = json.user;
		newUser.token = json.token;
		return newUser;
	} else {
		throw new Error();
	}
};

// Sign in user
export const signInUser = async (email, password) => {
	const body = {
		email,
		password,
	};
	const response = fetch(import.meta.env.VITE_API_URL + '/sign_in', {
		body,
		method: 'POST',
	});
	if (response.status == 200) {
		const json = await response.json();
		const signedInUser = json.user;
		signedInUser.token = json.token;
		return signedInUser;
	} else {
		throw new Error();
	}
};

// Retrieve user
export const findUser = async (id) => {
	const user = getLocalUser();
	const response = await fetch(
		import.meta.env.VITE_API_URL + '/api/user/single',
		{
			body: { id },
			method: 'POST',
			headers: {
				Authorization: `Bearer ${user.token}`,
			},
		}
	);
	if (response.status == 200) {
		const json = await response.json();
		return json.user;
	} else {
		throw new Error();
	}
};

// Searches users by name
export const searchUsers = async (name) => {
	const user = getLocalUser();
	const response = await fetch(
		import.meta.env.VITE_API_URL + '/api/user/search',
		{
			body: { name },
			method: 'POST',
			headers: {
				Authorization: `Bearer ${user.token}`,
			},
		}
	);
	if (response.status == 200) {
		const json = await response.json();
		return json.users;
	} else {
		throw new Error();
	}
};

// Update user
export const updateUser = async (image, name, bio) => {
	if (image) body.image = image;
	if (name) body.name = name;
	if (bio) body.bio = bio;
	const user = getLocalUser();
	const response = await fetch(import.meta.env.VITE_API_URL + '/api/user', {
		body,
		method: 'PUT',
		headers: {
			Authorization: `Bearer ${user.token}`,
		},
	});
	if (response.status == 200) {
		const json = await response.json();
		const updatedUser = json.user;
		updatedUser.token = user.token;
		return updatedUser;
	} else {
		throw new Error();
	}
};

// Query for username & return true if it is not taken
export const isUsernameUnique = async (username) => {
	const user = getLocalUser();
	const response = await fetch(
		import.meta.env.VITE_API_URL + '/api/user/is-username-unique',
		{
			body: { username },
			method: 'POST',
			headers: {
				Authorization: `Bearer ${user.token}`,
			},
		}
	);
	if (response.status == 200) {
		const json = await response.json();
		const { isUsernameUnique } = json;
		return isUsernameUnique;
	} else {
		throw new Error();
	}
};

// Query for email & return true if it is not taken
export const isEmailUnique = async (email) => {
	const user = getLocalUser();
	const response = await fetch(
		import.meta.env.VITE_API_URL + '/api/user/is-email-unique',
		{
			body: { email },
			method: 'POST',
			headers: {
				Authorization: `Bearer ${user.token}`,
			},
		}
	);
	if (response.status == 200) {
		const json = await response.json();
		const { isEmailUnique } = json;
		return isEmailUnique;
	} else {
		throw new Error();
	}
};

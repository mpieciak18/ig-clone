// Firebase modules
import { db } from './firebase.js';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext.js';

const { user, setUser } = useAuth();

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
		await setUser(newUser);
		localStorage.setItem('markstagramUser', newUser);
		return;
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
		await setUser(signedInUser);
		localStorage.setItem('markstagramUser', signedInUser);
		return;
	} else {
		throw new Error();
	}
};

// Sign out user
export const signOutUser = async () => {
	await setUser(null);
	localStorage.removeItem('markstagramUser');
};

// Retrieve user
export const findUser = async (id) => {
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
		await setUser(updatedUser);
		return;
	} else {
		throw new Error();
	}
};

// Query for username & return true if it exists in db
export const usernameExists = async (username) => {
	const usersRef = collection(db, 'users');
	const userQuery = query(usersRef, where('username', '==', username));
	const userDoc = await getDocs(userQuery);
	if (userDoc.empty != true) {
		return true;
	} else {
		return false;
	}
};

// Query for email & return true if it exists in db
export const emailExists = async (email) => {
	const usersRef = collection(db, 'users');
	const userQuery = query(usersRef, where('email', '==', email));
	const userDoc = await getDocs(userQuery);
	if (userDoc.empty != true) {
		return true;
	} else {
		return false;
	}
};

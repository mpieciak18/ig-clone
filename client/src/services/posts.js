import { getToken } from './localstor';
import { compressFile } from './compress';

// Retrieve single post by post id
export const findSinglePost = async (id) => {
	const response = await fetch(
		import.meta.env.VITE_API_URL + '/api/post/single',
		{
			body: JSON.stringify({ id: Number(id) }),
			// body: { id },
			method: 'POST',
			headers: {
				Authorization: `Bearer ${getToken()}`,
				'Content-Type': 'application/json',
			},
		}
	);
	if (response.status == 200) {
		const json = await response.json();
		return json.post;
	} else {
		throw new Error();
	}
};

// Retrieve all posts
export const findPosts = async (limit) => {
	const response = await fetch(
		import.meta.env.VITE_API_URL + '/api/post/all',
		{
			body: JSON.stringify({ limit: Number(limit) }),
			method: 'POST',
			headers: {
				Authorization: `Bearer ${getToken()}`,
				'Content-Type': 'application/json',
			},
		}
	);
	if (response.status == 200) {
		const json = await response.json();
		return json.posts;
	} else {
		throw new Error();
	}
};

// Retrieve all posts from user
export const findPostsFromUser = async (id, limit) => {
	const response = await fetch(
		import.meta.env.VITE_API_URL + '/api/post/user',
		{
			body: JSON.stringify({ id: Number(id), limit: Number(limit) }),
			method: 'POST',
			headers: {
				Authorization: `Bearer ${getToken()}`,
				'Content-Type': 'application/json',
			},
		}
	);
	if (response.status == 200) {
		const json = await response.json();
		return json.posts;
	} else {
		throw new Error();
	}
};

// Create new post & return new post data
export const newPost = async (caption, image) => {
	const body = new FormData();
	body.append('caption', caption);
	const compressedImage = await compressFile(image);
	body.append('file', compressedImage);
	const response = await fetch(import.meta.env.VITE_API_URL + '/api/post', {
		body,
		method: 'POST',
		headers: {
			Authorization: `Bearer ${getToken()}`,
		},
	});
	if (response.status == 200) {
		const json = await response.json();
		return json.post;
	} else {
		throw new Error();
	}
};

// Delete a user's post
export const removePost = async (id) => {
	const response = await fetch(import.meta.env.VITE_API_URL + '/api/post', {
		body: JSON.stringify({ id: Number(id) }),
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${getToken()}`,
			'Content-Type': 'application/json',
		},
	});
	if (response.status == 200) {
		const json = await response.json();
		return json.post;
	} else {
		throw new Error();
	}
};

import { getToken } from './localstor';

// Retrieve single post by post id
export const findSinglePost = async (id) => {
	const response = await fetch(
		import.meta.env.VITE_API_URL + '/api/post/single',
		{
			body: { id },
			method: 'POST',
			headers: {
				Authorization: `Bearer ${getToken()}`,
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
			body: { limit },
			method: 'POST',
			headers: {
				Authorization: `Bearer ${getToken()}`,
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
			body: { id, limit },
			method: 'POST',
			headers: {
				Authorization: `Bearer ${getToken()}`,
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
	body.append('image', compressedImage);
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
		body: { id },
		method: 'DELETE',
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

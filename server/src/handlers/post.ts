import prisma from '../db';
import { deleteFileFromStorage } from '../config/gcloud';

// Creates a post
export const createPost = async (req, res, next) => {
	console.log(req.image);
	console.log(req.body);
	// If no image url is passed from the upload middleware, handle it at the top-level (server.ts) as 500 error
	if (!req.image) {
		const e = new Error();
		next(e);
		return;
	}

	// First, create post
	let post;
	try {
		post = await prisma.post.create({
			data: {
				image: req.image,
				caption: req.body.caption,
				userId: req.user.id,
			},
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}

	// If no post is created, handle it at the top-level (server.ts) as 500 error
	if (!post) {
		const e = new Error();
		next(e);
		return;
	}

	// Second, send post data back to client
	res.json({ post });
};

// Gets a post based on a single post's id (if it exists)
export const getSinglePost = async (req, res, next) => {
	// First, get post by id
	// If no post is found, handle it at the top-level (server.ts) as 500 error
	let post;
	try {
		post = await prisma.post.findUnique({
			where: { id: req.body.id },
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}
	if (!post) {
		const e = new Error();
		next(e);
		return;
	}

	// Second, return data back to client
	res.json({ post });
};

// Gets all posts from a single user by id
export const getPosts = async (req, res, next) => {
	// First, get all posts with limit
	// If no posts are found, handle it at the top-level (server.ts) as 500 error
	let posts;
	try {
		posts = await prisma.post.findMany({
			take: req.body.limit,
			orderBy: { createdAt: 'desc' },
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}
	if (!posts) {
		const e = new Error();
		next(e);
		return;
	}

	// Second, return data back to client
	res.json({ posts });
};

// Gets all posts from a single user by id
export const getUserPosts = async (req, res, next) => {
	// First, confirm if provided user exists
	// If no user is found, handle it at the top-level (server.ts) as 500 error
	let otherUser;
	try {
		otherUser = await prisma.user.findUnique({
			where: { id: req.body.id },
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}
	if (!otherUser) {
		const e = new Error();
		next(e);
		return;
	}
	// Second, get posts by user id
	// If no post is found, handle it at the top-level (server.ts) as 500 error
	let posts;
	try {
		posts = await prisma.post.findMany({
			where: { userId: req.body.id },
			take: req.body.limit,
			orderBy: { createdAt: 'desc' },
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}
	if (!posts) {
		const e = new Error();
		next(e);
		return;
	}

	// Second, return data back to client
	res.json({ posts });
};

// Deletes a post
export const deletePost = async (req, res, next) => {
	// First, delete the post
	let post;
	try {
		post = await prisma.post.delete({
			where: { id: req.body.id },
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}

	// If no post is found-and-deleted, handle it at the top-level (server.ts) as 500 error
	if (!post) {
		const e = new Error();
		next(e);
		return;
	}

	// Second, delete file of deleted post from storage
	try {
		await deleteFileFromStorage(post.image);
	} catch (e) {
		next(e);
		return;
	}

	// Finally, send deleted follow data back to client
	res.json({ post });
};

// Updates a post
export const updatePost = async (req, res, next) => {
	// Format data needed for update
	const keys = ['caption'];
	const data = {};
	keys.forEach((key) => {
		if (req.body[key]) data[key] = req.body[key];
	});

	// Update post
	let post;
	try {
		post = await prisma.post.update({
			where: { id: req.body.id },
			data,
		});
	} catch (e) {
		// If error, handle it as a 500 error
		next(e);
	}

	// While the previous try/catch (along with the 'protect' middleware) should catch all errors,
	// this is added as an extra step of error handling (in case the update 'runs' but nothing is returned).
	if (!post) {
		const e = new Error();
		next(e);
		return;
	}

	// Return updated user data
	res.json({ post });
};

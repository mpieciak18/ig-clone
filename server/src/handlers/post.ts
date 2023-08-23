import { deleteFileFromStorage } from '../config/gcloud';
import prisma from '../db';

export const createPost = async (req, res, next) => {
	// If no image url is passed from the upload middleware, handle it at the top-level (server.ts) as 500 error
	if (!req.file) {
		const e = new Error();
		next(e);
		return;
	}

	// First, create post
	let post;
	try {
		post = await prisma.post.create({
			data: {
				file: req.imageUrl,
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

// Deletes a post
export const deleteFollow = async (req, res, next) => {
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
	await deleteFileFromStorage(post.file);

	// Send deleted follow data back to client
	res.json({ post });
};

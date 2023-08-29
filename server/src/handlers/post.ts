import prisma from '../db';

export const createPost = async (req, res, next) => {
	// If no image url is passed from the upload middleware, handle it at the top-level (server.ts) as 500 error
	if (!req.file) {
		const e = new Error();
		next(e);
		return;
	}

	// First, create post
	const { buffer } = req.file;
	let post;
	try {
		post = await prisma.post.create({
			data: {
				image: buffer,
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
export const deletePost = async (req, res, next) => {
	// Delete the post
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

	// Send deleted follow data back to client
	res.json({ post });
};

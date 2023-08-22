import prisma from '../db';

export const createPost = async (req, res, next) => {
	// If no image url is passed from the upload middleware, handle it at the top-level (server.ts) as 500 error
	if (!req.imageUrl) {
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

	// Third (and finally), send post data back to client
	res.json({ post });
};

import prisma from '../db';

// Creates a comment
export const createComment = async (req, res, next) => {
	// First, attempt to create comment
	let comment;
	try {
		comment = await prisma.comment.create({
			data: {
				message: req.body.message,
				postId: req.body.id,
				userId: req.user.id,
			},
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}

	// If no comment is created, handle it at the top-level (server.ts) as 500 error
	if (!comment) {
		const e = new Error();
		next(e);
		return;
	}

	// Second, send comment data back to client
	res.json({ comment });
};

// Gets (limited number of) comments from post
export const getComments = async (req, res, next) => {
	// First, get all comments from post with limit
	// If no comments are found, handle it at the top-level (server.ts) as 500 error
	let comments;
	try {
		comments = await prisma.comment.findMany({
			where: { id: req.body.id },
			take: req.body.limit,
			include: { user: true },
			orderBy: { createdAt: 'desc' },
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}
	if (!comments) {
		const e = new Error();
		next(e);
		return;
	}

	// Second, return comments back to client
	res.json({ comments });
};

// Gets a single comment by id
export const getSingleComment = async (req, res, next) => {
	// First, get commend by id
	// If no comment is found, handle it at the top-level (server.ts) as 500 error
	let comment;
	try {
		comment = await prisma.comment.findUnique({
			where: { id: req.body.id },
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}
	if (!comment) {
		const e = new Error();
		next(e);
		return;
	}

	// Second, return comment back to client
	res.json({ comment });
};

// Deletes a comment
export const deleteComment = async (req, res, next) => {
	// First, attempt to delete the comment
	let comment;
	try {
		comment = await prisma.comment.delete({
			where: { id: req.body.id },
		});
	} catch (e) {
		// DB errors are handled at top-level (server.ts) as 500 error
		next(e);
		return;
	}

	// If no comment is found-and-deleted, handle it at the top-level (server.ts) as 500 error
	if (!comment) {
		const e = new Error();
		next(e);
		return;
	}

	// Finally, send deleted comment back to client
	res.json({ comment });
};

// Updates a comment
export const updateComment = async (req, res, next) => {
	// Attempt to update comment
	let comment;
	try {
		comment = await prisma.comment.update({
			where: { id: req.body.id },
			data: { message: req.body.message },
		});
	} catch (e) {
		// If error, handle it as a 500 error
		next(e);
	}

	// While the previous try/catch (along with the 'protect' middleware) should catch all errors,
	// this is added as an extra step of error handling (in case the update 'runs' but nothing is returned).
	if (!comment) {
		const e = new Error();
		next(e);
		return;
	}

	// Return updated comment
	res.json({ comment });
};

import prisma from '../db';
import { comparePasswords, createJwt, hashPassword } from '../modules/auth';
import { deleteFileFromStorage } from '../config/gcloud';

// Creates a new user in the database and returns a signed JWT to the client.
// Any error is assumed to be related to user input and is returned to the client as such.
export const createNewUser = async (req, res, next) => {
	const data = req.body;
	data.password = await hashPassword(req.body.password);
	try {
		const user = await prisma.user.create({
			data: data,
		});
		const token = await createJwt(user);
		// @ts-ignore
		user._count = {
			posts: 0,
			receivedFollows: 0,
			givenFollows: 0,
		};
		res.json({ token, user });
	} catch (e) {
		// Checks if error is a 'unique constraint failure'
		if (e.code == 'P2002') {
			if (e.meta?.target?.includes('email')) {
				res.status(400);
				res.json({ message: 'email in use' });
			} else if (e.meta?.target?.includes('username')) {
				res.status(400);
				res.json({ message: 'username in use' });
			} else {
				e.type = 'input';
				next(e);
			}
		} else {
			e.type = 'input';
			next(e);
		}
	}
};

// Verifies sign-in attempt by checking if username exists and if passwords match.
// If both conditions don't pass, then an error message is returned to the client.
// Otherwise, a signed JWT is returned back to the client.
export const signIn = async (req, res, next) => {
	// First, find user in database by username.
	const user = await prisma.user.findUnique({
		where: {
			username: req.body.username,
		},
		include: {
			_count: {
				select: {
					givenFollows: true,
					receivedFollows: true,
					posts: true,
				},
			},
		},
	});
	if (!user) {
		res.status(401);
		res.json({ message: 'Invalid Username or Password' });
		return;
	}
	// Second, compare passwords (ie, user input vs database value).
	const isValid = await comparePasswords(req.body.password, user.password);
	if (!isValid) {
		res.status(401);
		res.json({ message: 'Invalid Username or Password' });
		return;
	}
	// Third, return auth token to client.
	const token = await createJwt(user);
	res.json({ token, user });
};

// Deletes a user's account from the database
// NOTE: Currently only used for testing purposes
export const deleteUser = async (req, res, next) => {
	// Delete user
	let user;
	try {
		user = await prisma.user.delete({ where: { id: req.user.id } });
	} catch (e) {
		// Error handled at top-level (ie, server.ts) as 500 error
		next(e);
		return;
	}

	// While the previous try/catch (along with the 'protect' middleware) should catch all errors,
	// this is added as an extra step of error handling (in case the deletion 'runs' but nothing is returned).
	if (!user) {
		const e = new Error();
		next(e);
		return;
	}

	// Return deleted user data
	res.json({ user });
};

// Updates a user's account fields
export const updateUser = async (req, res, next) => {
	// Format data needed for update
	const keys = ['email', 'username', 'name', 'bio'];
	const data = {};
	keys.forEach((key) => {
		if (req.body[key]) data[key] = req.body[key];
	});
	if (req.body.password) {
		// @ts-ignore
		data.password = await hashPassword(req.body.password);
	}
	// If an image was uploaded, add it to the data
	// Also, get the user's old image
	let oldImage;
	if (req.image) {
		try {
			// @ts-ignore
			data.image = req.image;
			const oldData = await prisma.user.findUnique({
				where: { id: req.user.id },
				select: {
					image: true,
				},
			});
			oldImage = oldData?.image;
		} catch (e) {
			next(e);
		}
	}

	// Update user
	let user;
	try {
		user = await prisma.user.update({
			where: { id: req.user.id },
			data,
			include: {
				_count: {
					select: {
						givenFollows: true,
						receivedFollows: true,
						posts: true,
					},
				},
			},
		});
		console.log(user);
	} catch (e) {
		// Checks if there's a 'unique constraint failure' & handles it as a 401 error
		if (e.code == 'P2002') {
			if (e.meta?.target?.includes('email')) {
				res.status(400);
				res.json({ message: 'email in use' });
			} else if (e.meta?.target?.includes('username')) {
				res.status(400);
				res.json({ message: 'username in use' });
			} else {
				next(e);
			}
		}
		// Else, is handled as a 500 error
		else {
			next(e);
		}
	}

	// While the previous try/catch (along with the 'protect' middleware) should catch all errors,
	// this is added as an extra step of error handling (in case the update 'runs' but nothing is returned).
	if (!user) {
		const e = new Error();
		next(e);
		return;
	}

	if (oldImage) {
		try {
			await deleteFileFromStorage(oldImage);
		} catch (e) {
			next(e);
		}
	}

	// Return updated user data
	res.json({ user });
};

// Attempts to find user by id
export const getSingleUser = async (req, res, next) => {
	let user;
	// First, find user in database by id.
	try {
		user = await prisma.user.findUnique({
			where: {
				id: req.body.id,
			},
			include: {
				_count: {
					select: {
						givenFollows: true,
						receivedFollows: true,
						posts: true,
					},
				},
			},
		});
	} catch (e) {
		// Error handled at top-level (ie, server.ts) as 500 error
		next(e);
		return;
	}
	if (!user) {
		const e = new Error();
		next(e);
		return;
	}
	// Second, return user record to client.
	res.json({ user });
};

// Attempts to find user(s) by name or username
export const getUsersByName = async (req, res, next) => {
	let users;
	// First, search users by name in database
	try {
		users = await prisma.user.findMany({
			where: {
				OR: [
					{
						name: {
							contains: `%${req.body.name}%`,
							mode: 'insensitive',
						},
					},
					{
						username: {
							contains: `%${req.body.name}%`,
							mode: 'insensitive',
						},
					},
				],
			},
		});
	} catch (e) {
		// Error handled at top-level (ie, server.ts) as 500 error
		next(e);
		return;
	}
	if (!users) {
		// While the previous try/catch (along with the 'protect' middleware) should catch all errors,
		// this is added as an extra step of error handling (in case the search 'runs' but nothing returns
		const e = new Error();
		next(e);
		return;
	}
	// Second, return users array to client.
	res.json({ users });
};

// Checks if an email is unique (ie, not taken by another user)
export const isEmailUnique = async (req, res, next) => {
	let user;
	let isEmailUnique = false;
	// First, search for a user by email
	try {
		user = await prisma.user.findUnique({
			where: {
				email: req.body.email,
			},
		});
	} catch (e) {
		// Error handled at top-level (ie, server.ts) as 500 error
		next(e);
		return;
	}
	if (!user) {
		isEmailUnique = true;
	}
	// Second, return result (bool) to client.
	res.json({ isEmailUnique });
};

// Checks if an username is unique (ie, not taken by another user)
export const isUsernameUnique = async (req, res, next) => {
	let user;
	let isUsernameUnique = false;
	// First, search for a user by username
	try {
		user = await prisma.user.findUnique({
			where: {
				username: req.body.username,
			},
		});
	} catch (e) {
		// Error handled at top-level (ie, server.ts) as 500 error
		next(e);
		return;
	}
	if (!user) {
		isUsernameUnique = true;
	}
	// Second, return result (bool) to client.
	res.json({ isUsernameUnique });
};

import prisma from '../db';
import { comparePasswords, createJwt, hashPassword } from '../modules/auth';

// Creates a new user in the database and returns a signed JWT to the client.
// Any error is assumed to be related to user input and is returned to the client as such.
export const createNewUser = async (req, res, next) => {
	try {
		const user = await prisma.user.create({
			data: {
				email: req.body.email,
				username: req.body.username,
				password: await hashPassword(req.body.password),
				name: req.body.name,
				bio: req.body.bio,
				image: req.body.image,
			},
		});
		const token = await createJwt(user);
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
	res.json({ token });
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

// Updates a user's account fields (note: these are the same fields passed to createNewUser)
export const updateUser = async (req, res, next) => {
	// Format data needed for update
	const keys = ['email', 'username', 'name', 'bio', 'image'];
	const data = {};
	keys.forEach((key) => {
		if (req.body[key]) data[key] = req.body[key];
	});
	if (req.body.password) {
		// @ts-ignore
		data.password = await hashPassword(req.body.password);
	}

	// Update user
	let user;
	try {
		user = await prisma.user.update({
			where: { id: req.user.id },
			data,
		});
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

	// Return updated user data
	res.json({ user });
};

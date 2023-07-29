import prisma from '../db';
import { comparePasswords, createJwt, hashPassword } from '../modules/auth';

// Creates a new user in the database and returns a signed JWT to the client.
// Any error is assumed to be related to user input and is returned to the c.ient as such.
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
		const token = createJwt(user);
		res.json({ token });
	} catch (e) {
		e.type = 'input';
		next(e);
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
	const token = createJwt(user);
	res.json({ token });
};

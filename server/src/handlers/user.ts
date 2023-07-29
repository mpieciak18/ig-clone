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

export const signIn = async (req, res, next) => {};

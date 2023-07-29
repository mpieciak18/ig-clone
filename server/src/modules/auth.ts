import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

export const createJwt = async (user: { id: any; username: any }) => {
	const token = jwt.sign(
		{
			id: user.id,
			username: user.username,
		},
		process.env.JWT_SECRET
	);
	return token;
};

export const protect = async (req, res, next) => {
	const bearer = req.headers.authorization;
	if (!bearer) {
		res.status(401);
		res.json({ message: 'Not Authorized' });
		return;
	}

	const [, token] = bearer.split(' ');
	if (!token) {
		res.status(401);
		res.json({ message: 'Invalid Token' });
		return;
	}

	try {
		const user = jwt.verify(token, process.env.JWT_SECRET);
		req.user = user;
		next();
	} catch (e) {
		console.log(e);
		res.status(401);
		res.json({ message: 'Token Unverifiable' });
		return;
	}
};

export const comparePasswords = async () => {};

export const hashPassword = async () => {};

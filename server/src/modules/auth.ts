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

export const protect = async () => {};

export const comparePasswords = async () => {};

export const hashPassword = async () => {};

import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { User } from '@prisma/client';
import { Field } from 'multer';

export interface NewUserBody {
	email: string;
	username: string;
	password: string;
	name: string;
}

export interface UserStatsCount {
	_count: {
		posts: number;
		receivedFollows: number;
		givenFollows: number;
	};
}

export interface PostStatsCount {
	_count: {
		comments: number;
		likes: number;
	};
}

export interface PreAuth {
	user: string | JwtPayload;
}

export interface AuthReq extends Request {
	user: User;
}

export interface UserUpdateData {
	email?: string;
	username?: string;
	password?: string;
	name?: string;
	image?: string;
}

export interface PostUpdateData {
	id?: number;
	caption?: string;
}

export interface MayHaveFile {
	file?: Field;
}

export interface MayHaveImage {
	image?: string;
}

export interface HasId {
	body: { id: number };
}

export interface HasLimit {
	body: { id: number };
}

export interface HasCaption {
	body: { caption: string };
}

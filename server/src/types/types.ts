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

export interface ReqPreImgUpload {
	file?: Field;
	path?: string;
}

export interface ReqPostImgUpload {
	image?: string;
}

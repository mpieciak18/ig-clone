import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import {
	Comment,
	Conversation,
	Like,
	Message,
	Notification,
	Post,
	Save,
	User,
} from '@prisma/client';
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

export interface SaveFromPost extends Save {
	post: Post & PostStatsCount;
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

export interface NewNotificationData {
	userId: number;
	otherUserId: number;
	type: string;
	read: boolean;
	postId?: number;
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

export interface MayHavePostId {
	body: { postId?: number };
}

export interface HasCaption {
	body: { caption: string };
}
export interface HasType {
	body: { type: string };
}

export interface HasMessage {
	body: { message: string };
}

export interface NotificationWithOtherUser extends Notification {
	otherUser: User;
}

export interface CommentWithUser extends Comment {
	user: User;
}

export interface LikeWithUser extends Like {
	user: User;
}

export interface UserConversation extends Conversation {
	users: User[];
	messages: Message[];
}

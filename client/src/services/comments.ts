import { addNotification } from './notifications.js';
import { getToken } from './localstor.js';
import { Comment, User } from 'shared';

interface CommentRecord extends Comment {
	user: User;
}

// Create new comment & return comment ID
export const addComment = async (
	postOwnerId: number,
	postId: number,
	message: string
) => {
	const response = await fetch(
		import.meta.env.VITE_API_URL + '/api/comment',
		{
			method: 'POST',
			body: JSON.stringify({
				id: Number(postId),
				message,
			}),
			headers: {
				Authorization: `Bearer ${getToken()}`,
				'Content-Type': 'application/json',
			},
		}
	);
	if (response.status == 200) {
		// add notification to recipient
		await addNotification('comment', postOwnerId, postId);
		const json = await response.json();
		return json.comment as CommentRecord;
	} else {
		throw new Error();
	}
};

// Remove comment
// export const removeComment = async (id) => {
// 	const response = await fetch(
// 		import.meta.env.VITE_API_URL + '/api/comment',
// 		{
// 			method: 'DELETE',
// 			body: JSON.stringify({
// 				id: Number(id),
// 			}),
// 			headers: {
// 				Authorization: `Bearer ${getToken()}`,
// 				'Content-Type': 'application/json',
// 			},
// 		}
// 	);
// 	if (response.status == 200) {
// 		const json = await response.json();
// 		return json.comment;
// 	} else {
// 		throw new Error();
// 	}
// };

// Get comments
export const getComments = async (id: number, limit: number) => {
	const response = await fetch(
		import.meta.env.VITE_API_URL + '/api/comment/post',
		{
			method: 'POST',
			body: JSON.stringify({
				id: Number(id),
				limit: Number(limit),
			}),
			headers: {
				Authorization: `Bearer ${getToken()}`,
				'Content-Type': 'application/json',
			},
		}
	);
	if (response.status == 200) {
		const json = await response.json();
		return json.comments as CommentRecord[];
	} else {
		throw new Error();
	}
};

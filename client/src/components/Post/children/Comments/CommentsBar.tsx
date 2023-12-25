import { User, Comment } from 'shared';
import { addComment } from '../../../../services/comments.js';
import { useState } from 'react';

interface CommentRecord extends Comment {
	user: User;
}

const CommentsBar = (props: {
	postId: number;
	postOwnerId: number;
	commentsNum: number | undefined;
	setCommentsNum: React.Dispatch<React.SetStateAction<number | undefined>>;
	inputRef: React.MutableRefObject<HTMLInputElement | null>;
	addCommentToPostState: ((comment: CommentRecord) => void) | null;
}) => {
	const {
		postId,
		postOwnerId,
		commentsNum,
		setCommentsNum,
		inputRef,
		addCommentToPostState,
	} = props;

	// Set initial comment input value & reset it on submission
	const [commentValue, setCommentValue] = useState('');

	// Updates comment state / field
	const updateComment = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setCommentValue(val);
	};

	// Adds comment to comments of post
	const addNewComment = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (commentValue.length > 0) {
			const newComment = await addComment(
				postOwnerId,
				postId,
				commentValue
			);
			if (addCommentToPostState) addCommentToPostState(newComment);
			setCommentValue('');
			if (commentsNum) setCommentsNum(commentsNum + 1);
		}
	};

	return (
		<form className='post-comment-bar' onSubmit={addNewComment}>
			<input
				type='text'
				className='post-comment-bar-input'
				placeholder='Add a comment...'
				onChange={updateComment}
				value={commentValue}
				ref={inputRef}
			/>
			<button type='submit' className='post-comment-bar-button inactive'>
				Post
			</button>
		</form>
	);
};

export { CommentsBar };

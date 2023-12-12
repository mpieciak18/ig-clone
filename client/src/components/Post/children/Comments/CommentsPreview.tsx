import { getComments } from '../../../../services/comments.js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CommentsPreview = (props) => {
	const { postId, commentsNum } = props;

	const navigate = useNavigate();

	// Init comments array state
	const [commentsArr, setCommentsArr] = useState([]);

	// Update commentsArr when comments count changes and on init render
	useEffect(() => {
		getComments(postId, 2)
			.then((array) => setCommentsArr(array.toReverse()))
			.catch(() => setCommentsArr([]));
	}, [commentsNum]);

	// Return component
	return (
		<div className='post-comments'>
			{commentsArr.map(async (comment) => (
				<div
					className='post-comment'
					key={comment.id}
					onClick={() => navigate(`/${comment.user.id}`)}
				>
					<div className='post-comment-name'>{comment.user.name}</div>
					<div className='post-comment-text'>{comment.message}</div>
				</div>
			))}
		</div>
	);
};

export { CommentsPreview };

import { getComments } from '../../../../services/comments.js';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { timeSinceTrunc } from '../../../../other/timeSinceTrunc.js';

const CommentsFull = (props) => {
	const {
		postId,
		postOwnerId,
		postOwnerImage,
		postCaption,
		postOwnerName,
		commentsNum,
	} = props;

	// Init comment quantity (ie, how many comments are rendered) state
	const [commentQuantity, setCommentQuantity] = useState(10);

	// Init all loaded state
	const [allLoaded, setAllLoaded] = useState(false);

	// Init comments array state
	const [commentsArr, setCommentsArr] = useState([]);

	// Update commentsArr when commentsNum (total comments on a post) or commentQuantity (how many are rendered) changes
	// E.g., user submits new comment on a post OR scrolls to load more
	useEffect(() => {
		getComments(postId, commentQuantity)
			.then((array) => {
				setCommentsArr(array);
				if (array.length < commentQuantity) {
					setAllLoaded(true);
				}
			})
			.catch(() => setCommentsArr([]));
	}, [commentsNum, commentQuantity]);

	// Load more comments on scroll
	const loadMore = (e) => {
		const elem = e.target;
		if (
			Math.ceil(elem.scrollHeight - elem.scrollTop) ==
				elem.clientHeight &&
			allLoaded == false
		) {
			const newCommentQuantity = commentQuantity + 10;
			setCommentQuantity(newCommentQuantity);
		}
	};

	// Update comments arr state on init render
	useEffect(() => {
		getComments(postId, 10)
			.then(setCommentsArr)
			.catch(() => setCommentsArr([]));
	}, []);

	// Return component
	return (
		<div id='comments-grid' onScroll={loadMore}>
			<div className='post-comment'>
				<div className='post-comment-left' key={'first-comment'}>
					<Link to={`/${postOwnerId}`} className='post-comment-icon'>
						<img src={postOwnerImage} />
					</Link>
					<div className='post-comment-text'>
						<Link
							to={`/${postOwnerId}`}
							className='post-comment-name'
						>
							{postOwnerName}
						</Link>
						<div className='post-comment-text'>{postCaption}</div>
					</div>
				</div>
				<div className='post-comment-right'>...</div>
			</div>
			{commentsArr.map((comment) => (
				<div className='post-comment' key={comment.id}>
					<div className='post-comment-left'>
						<Link
							to={`/${comment.userId}`}
							className='post-comment-icon'
						>
							<img src={comment.user.image} />
						</Link>
						<div className='post-comment-text'>
							<Link
								to={`/${comment.userId}`}
								className='post-comment-name'
							>
								{comment.user.name}
							</Link>
							<div className='post-comment-text'>
								{comment.message}
							</div>
						</div>
					</div>
					<div className='post-comment-right'>
						{timeSinceTrunc(comment.createdAt)}
					</div>
				</div>
			))}
		</div>
	);
};

export { CommentsFull };

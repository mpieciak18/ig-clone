import '../styles/PostReel.css';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CommentsBar } from './Comments/CommentsBar.js';
import { CommentsPreview } from './Comments/CommentsPreview.js';
import { PostButtons } from './PostButtons.js';
import { timeSince } from '../../../other/timeSince.js';
import { LinkCopied } from './LinkCopied.js';

const PostReel = (props) => {
	// Init props
	const { post } = props;

	// Init post likes count state
	const [likesNum, setLikesNum] = useState(post.likes.length);

	// Init post comments count state
	const [commentsNum, setCommentsNum] = useState(post.comments.length);

	// Set up ref for comment bar / comment button
	const inputRef = useRef(null);

	// Update previous states on render & changes
	useEffect(() => {
		updateStates();
	}, []);

	// Init linkCopied state for share button
	const [linkCopied, setLinkCopied] = useState(false);

	return (
		<div className='single-post-component'>
			<div className='post-top'>
				<Link className='post-user-link' to={`/${post.user.id}`}>
					<img
						className='post-user-link-avatar'
						src={post.user.image}
					/>
					<div className='post-user-link-name-and-username-parent'>
						<div className='post-user-link-name'>
							{post.user.name}
						</div>
						<div className='post-user-link-username'>
							@{post.user.username}
						</div>
					</div>
				</Link>
				<div className='post-top-right'>
					<div className='post-date'>{timeSince(post.createdAt)}</div>
				</div>
			</div>
			<Link className='post-middle' to={`/${post.user.id}/${post.id}`}>
				<img className='post-image' src={post.image} />
			</Link>
			<div className='post-bottom'>
				<LinkCopied linkCopied={linkCopied} />
				<PostButtons
					postId={post.id}
					postOwnerId={post.user.id}
					inputRef={inputRef}
					likesNum={likesNum}
					setLikesNum={setLikesNum}
					setLinkCopied={setLinkCopied}
				/>
				<Link className='post-likes' to={`/${post.user.id}/${post.id}`}>
					{(() => {
						if (likesNum == 0) {
							return `0 likes`;
						} else if (likesNum == 1) {
							return `1 like`;
						} else {
							return `${likesNum} likes`;
						}
					})()}
				</Link>
				<div className='post-text-parent'>
					<Link className='post-text-name' to={`/${post.user.id}`}>
						{post.user.name}
					</Link>
					<div className='post-text'>{post.caption}</div>
				</div>
				<Link
					className='post-view-comments'
					to={`/${post.user.id}/${post.id}`}
				>
					{(() => {
						if (commentsNum == 0) {
							return `No comments yet...`;
						} else if (commentsNum == 1) {
							return `View 1 comment...`;
						} else {
							return `View all ${commentsNum} comments...`;
						}
					})()}
				</Link>
				<CommentsPreview
					postId={post.id}
					postOwnerId={post.user.id}
					commentsNum={commentsNum}
				/>
				<CommentsBar
					postId={post.id}
					postOwnerId={post.user.id}
					commentsNum={commentsNum}
					setCommentsNum={setCommentsNum}
					inputRef={inputRef}
				/>
			</div>
		</div>
	);
};

export { PostReel };

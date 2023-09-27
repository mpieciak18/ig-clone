import '../styles/PostReel.css';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CommentsBar } from './Comments/CommentsBar.js';
import { CommentsPreview } from './Comments/CommentsPreview.js';
import { PostButtons } from './PostButtons.js';
import { findUser } from '../../../firebase/users.js';
import { getUrl } from '../../../firebase/storage.js';
import { timeSince } from '../../../other/timeSince.js';
import { LinkCopied } from './LinkCopied.js';

const PostReel = (props) => {
	// Init props
	const {
		postId,
		postText,
		postImage,
		postDate,
		postOwnerId,
		postLikes,
		postComments,
		user,
	} = props;

	// Init post owner name
	const [postOwnerName, setPostOwnerName] = useState(null);

	// Init post owner username
	const [postOwnerUsername, setPostOwnerUsername] = useState(null);

	// Init post owner image state
	const [postOwnerImgSrc, setPostOwnerImgSrc] = useState(null);

	// Init post image state
	const [postImgSrc, setPostImgSrc] = useState(null);

	// Init post likes count state
	const [likesNum, setLikesNum] = useState(postLikes);

	// Init post comments count state
	const [commentsNum, setCommentsNum] = useState(postComments);

	// Set up ref for comment bar / comment button
	const inputRef = useRef(null);

	const updateStates = async () => {
		const pOwner = await findUser(postOwnerId);
		setPostOwnerName(pOwner.data.name);
		setPostOwnerUsername(pOwner.data.username);
		const pOwnerImgSrc = await getUrl(pOwner.data.image);
		setPostOwnerImgSrc(pOwnerImgSrc);
		const pImgSrc = await getUrl(postImage);
		setPostImgSrc(pImgSrc);
	};

	// Update previous states on render & changes
	useEffect(() => {
		updateStates();
	}, []);

	// Init linkCopied state for share button
	const [linkCopied, setLinkCopied] = useState(false);

	return (
		<div className='single-post-component'>
			<div className='post-top'>
				<Link className='post-user-link' to={`/${postOwnerId}`}>
					<img
						className='post-user-link-avatar'
						src={postOwnerImgSrc}
					/>
					<div className='post-user-link-name-and-username-parent'>
						<div className='post-user-link-name'>
							{postOwnerName}
						</div>
						<div className='post-user-link-username'>
							@{postOwnerUsername}
						</div>
					</div>
				</Link>
				<div className='post-top-right'>
					<div className='post-date'>{timeSince(postDate)}</div>
				</div>
			</div>
			<Link className='post-middle' to={`/${postOwnerId}/${postId}`}>
				<img className='post-image' src={postImgSrc} />
			</Link>
			<div className='post-bottom'>
				<LinkCopied linkCopied={linkCopied} />
				<PostButtons
					user={user}
					postId={postId}
					postOwnerId={postOwnerId}
					inputRef={inputRef}
					likesNum={likesNum}
					setLikesNum={setLikesNum}
					setLinkCopied={setLinkCopied}
				/>
				<Link className='post-likes' to={`/${postOwnerId}/${postId}`}>
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
					<Link className='post-text-name' to={`/${postOwnerId}`}>
						{postOwnerName}
					</Link>
					<div className='post-text'>{postText}</div>
				</div>
				<Link
					className='post-view-comments'
					to={`/${postOwnerId}/${postId}`}
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
					postId={postId}
					postOwnerId={postOwnerId}
					commentsNum={commentsNum}
				/>
				<CommentsBar
					user={user}
					postId={postId}
					postOwnerId={postOwnerId}
					commentsNum={commentsNum}
					setCommentsNum={setCommentsNum}
					inputRef={inputRef}
				/>
			</div>
		</div>
	);
};

export { PostReel };

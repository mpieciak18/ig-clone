import './styles/Post.css';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { findSinglePost } from '../../services/posts.js';
import { Navbar } from '../other/Navbar.js';
import { useEffect, useState, useRef } from 'react';
import { findUser } from '../../services/users';
import { Likes } from './children/Likes';
import { PostButtons } from './children/PostButtons';
import { timeSince } from '../../other/timeSince';
import { CommentsBar } from './children/Comments/CommentsBar';
import { CommentsFull } from './children/Comments/CommentsFull';
import { LinkCopied } from './children/LinkCopied';
import { useAuth } from '../../contexts/AuthContext';
import { usePopUp } from '../../contexts/PopUpContext';

const Post = () => {
	const { user } = useAuth();
	const { popUpState, updatePopUp } = usePopUp();

	const { postOwnerId, postId } = useParams();

	// Init post owner name
	const [postOwnerName, setPostOwnerName] = useState(null);

	// Init post owner username
	const [postOwnerUsername, setPostOwnerUsername] = useState(null);

	// Init post owner image state
	const [postOwnerImage, setPostOwnerImage] = useState(null);

	// Init post image state
	const [postImage, setPostImage] = useState(null);

	// Init post likes count state
	const [postLikes, setPostLikes] = useState(null);

	// Init post comments count state
	const [postComments, setPostComments] = useState(null);

	// Init post text
	const [postText, setPostText] = useState(null);

	// Init post date
	const [postDate, setPostDate] = useState(null);

	// Set up ref for comment bar / comment button
	const inputRef = useRef(null);

	const updatePostOwnerStates = async () => {
		const pOwner = await findUser(postOwnerId);
		setPostOwnerName(pOwner.name);
		setPostOwnerUsername(pOwner.username);
		setPostOwnerImage(pOwner.image);
	};

	const updatePostStates = async () => {
		const post = await findSinglePost(postId);
		setPostImage(post.image);
		setPostComments(post.comments);
		setPostDate(post.date);
		setPostLikes(post.likes);
		setPostText(post.text);
	};

	// Update previous states on render & changes
	useEffect(() => {
		// Update post owner states
		updatePostOwnerStates();
		// Update post states
		updatePostStates();
	}, []);

	// Init linkCopied state for share button
	const [linkCopied, setLinkCopied] = useState(false);

	// Set likesOn to true (or redirect to signup page) when likes are clicked
	const path = useLocation().pathname;
	const navigate = useNavigate();
	const clickLikes = () => {
		if (user == null) {
			navigate('/signup', { state: { path: path } });
		} else {
			updatePopUp('likesOn');
		}
	};

	return (
		<div id='post' className='page'>
			<Navbar />
			{popUpState.likesOn && user ? <Likes postId={postId} /> : null}
			<div id='single-post-page'>
				<LinkCopied linkCopied={linkCopied} />
				<div id='content-grid'>
					<img id='post-image' src={postImage} />
				</div>
				<div id='user-grid'>
					<div id='user-grid-child'>
						<Link id='user-link' to={`/${postOwnerId}`}>
							<img id='user-avatar' src={postOwnerImage} />
							<div id='user-name-parent'>
								<div id='user-name'>{postOwnerName}</div>
								<div id='user-username'>
									@{postOwnerUsername}
								</div>
							</div>
						</Link>
						<div id='date'>{timeSince(postDate)}</div>
					</div>
				</div>
				<CommentsFull
					postId={postId}
					postOwnerId={postOwnerId}
					postOwnerImage={postOwnerImage}
					postText={postText}
					postOwnerName={postOwnerName}
					commentsNum={postComments}
				/>
				<div id='buttons-grid'>
					<PostButtons
						postId={postId}
						postOwnerId={postOwnerId}
						inputRef={inputRef}
						likesNum={postLikes}
						setLikesNum={setPostLikes}
						setLinkCopied={setLinkCopied}
					/>
					<div id='beneath-buttons'>
						<div id='likes-count' onClick={clickLikes}>
							{postLikes == 0
								? `0 likes`
								: postLikes == 1
								? `1 like`
								: `${postLikes} likes`}
						</div>
					</div>
				</div>
				<div id='comment-bar-grid'>
					<CommentsBar
						postId={postId}
						postOwnerId={postOwnerId}
						commentsNum={postComments}
						setCommentsNum={setPostComments}
						inputRef={inputRef}
					/>
				</div>
			</div>
		</div>
	);
};

export { Post };

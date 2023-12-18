import './styles/Post.css';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { findSinglePost } from '../../services/posts.js';
import { Navbar } from '../other/Navbar.js';
import { useEffect, useState, useRef } from 'react';
import { Likes } from './children/Likes';
import { PostButtons } from './children/PostButtons';
import { timeSince } from '../../other/timeSince';
import { CommentsBar } from './children/Comments/CommentsBar';
import { CommentsFull } from './children/Comments/CommentsFull';
import { LinkCopied } from './children/LinkCopied';
import { useAuth } from '../../contexts/AuthContext';
import { usePopUp } from '../../contexts/PopUpContext';
import { Post, PostStatsCount, User } from 'shared';

interface PostRecord extends Post, PostStatsCount {
	user: User;
}

const PostPage = () => {
	const { user } = useAuth();
	const { popUpState, updatePopUp } = usePopUp();

	const postOwnerId = Number(useParams().postOwnerId);
	const postId = Number(useParams().postId);

	// Init post db entry state
	const [post, setPost] = useState<PostRecord>();

	// Init comments num state
	const [commentsNum, setCommentsNum] = useState<number>();

	// Init comments num state
	const [likesNum, setLikesNum] = useState<number>();

	// Set up ref for comment bar / comment button
	const inputRef = useRef<HTMLInputElement>(null);

	// Update post state on render
	useEffect(() => {
		findSinglePost(postId).then((post) => {
			setPost(post);
			setCommentsNum(post._count.comments);
			setLikesNum(post._count.likes);
		});
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
			{post && commentsNum && likesNum ? (
				<div id='single-post-page'>
					<LinkCopied linkCopied={linkCopied} />
					<div id='content-grid'>
						<img id='post-image' src={post.image} />
					</div>
					<div id='user-grid'>
						<div id='user-grid-child'>
							<Link id='user-link' to={`/${postOwnerId}`}>
								<img
									id='user-avatar'
									src={
										post.user.image
											? post.user.image
											: undefined
									}
								/>
								<div id='user-name-parent'>
									<div id='user-name'>{post.user.name}</div>
									<div id='user-username'>
										@{post.user.username}
									</div>
								</div>
							</Link>
							<div id='date'>{timeSince(post.createdAt)}</div>
						</div>
					</div>
					<CommentsFull post={post} commentsNum={commentsNum} />
					<div id='buttons-grid'>
						<PostButtons
							postId={postId}
							postOwnerId={postOwnerId}
							inputRef={inputRef}
							likesNum={likesNum}
							setLikesNum={setLikesNum}
							setLinkCopied={setLinkCopied}
						/>
						<div id='beneath-buttons'>
							<div id='likes-count' onClick={clickLikes}>
								{likesNum == 0
									? '0 likes'
									: likesNum == 1
									? '1 like'
									: `${likesNum} likes`}
							</div>
						</div>
					</div>
					<div id='comment-bar-grid'>
						<CommentsBar
							postId={postId}
							postOwnerId={postOwnerId}
							commentsNum={commentsNum}
							setCommentsNum={setCommentsNum}
							inputRef={inputRef}
						/>
					</div>
				</div>
			) : null}
		</div>
	);
};

export { PostPage };

import '../styles/PostReel.css';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CommentsBar } from './Comments/CommentsBar.js';
import { CommentsPreview } from './Comments/CommentsPreview.js';
import { PostButtons } from './PostButtons.js';
import { timeSince } from '../../../other/timeSince.js';
import { LinkCopied } from './LinkCopied.js';
import { Post, PostStatsCount, User } from 'shared';

interface PostRecord extends Post, PostStatsCount {
	user: User;
}

const PostReel = (props: { post: PostRecord }) => {
	// Init props
	const { post } = props;

	// Init post likes count state
	const [likesNum, setLikesNum] = useState<number | undefined>(
		post._count.likes
	);

	// Init post comments count state
	const [commentsNum, setCommentsNum] = useState<number | undefined>(
		post._count.comments
	);

	// Set up ref for comment bar / comment button
	const inputRef = useRef(null);

	// Init linkCopied state for share button
	const [linkCopied, setLinkCopied] = useState(false);

	return (
		<div className='single-post-component'>
			<div className='post-top'>
				<Link className='post-user-link' to={`/${post.user.id}`}>
					<img
						className='post-user-link-avatar'
						src={post.user?.image || undefined}
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
					{likesNum == 0
						? '0 likes'
						: likesNum == 1
						? '1 like'
						: `${likesNum} likes`}
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
					{commentsNum == 0
						? 'No comments yet...'
						: commentsNum == 1
						? 'View 1 comment...'
						: `View all ${commentsNum} comments...`}
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

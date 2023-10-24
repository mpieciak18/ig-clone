import './Profile.css';
import { Navbar } from '../other/Navbar.js';
import { PostPreview } from '../Post/children/PostPreview.js';
import { ProfileCard } from './children/ProfileCard.js';
import { ProfileButtons } from './children/ProfileButtons.js';
import { findPostsFromUser } from '../../services/posts.js';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
	const { user } = useAuth();

	// Get other user id from url parameters
	const { otherUserId } = useParams();

	// Init postsNumber state
	const [postsNumber, setPostsNumber] = useState(21);

	// Init posts component state
	const [posts, setPosts] = useState(null);

	// Init all loaded state
	const [allLoaded, setAllLoaded] = useState(false);

	// Update posts state when postsNumber state changes
	useEffect(() => {
		findPostsFromUser(otherUserId, postsNumber).then((newPosts) => {
			if (newPosts != null) {
				setPosts(newPosts);
				if (newPosts.length < postsNumber) {
					setAllLoaded(true);
				}
			} else {
				setPosts(null);
			}
		});
	}, [postsNumber]);

	// Load-more function that updates the posts reel
	const loadMore = () => {
		if (allLoaded == false) {
			const newPostsNumber = postsNumber + 9;
			setPostsNumber(newPostsNumber);
		}
	};

	// Load more content when user reaches bottom of document
	window.addEventListener('scroll', () => {
		if (
			window.innerHeight + Math.ceil(window.pageYOffset) >=
			document.body.offsetHeight - 2
		) {
			loadMore();
		}
	});

	return (
		<div id='profile'>
			<Navbar />
			<div id='profile-contents'>
				<div id='profile-contents-left'>
					<ProfileCard otherUserId={otherUserId} />
				</div>
				<div id='profile-contents-right'>
					<ProfileButtons otherUserId={otherUserId} />
					{posts ? (
						<div id='user-posts'>
							{posts.map((post) => {
								return <PostPreview post={post} user={user} />;
							})}
						</div>
					) : (
						<div id='user-posts-empty'>This user has no posts.</div>
					)}
				</div>
			</div>
		</div>
	);
};

export { Profile };

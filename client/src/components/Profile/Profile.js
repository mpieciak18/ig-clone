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

	// Init postsArr state
	const [postsArr, setPostsArr] = useState(null);

	// Init posts component state
	const [posts, setPosts] = useState(null);

	// Init all loaded state
	const [allLoaded, setAllLoaded] = useState(false);

	// Update posts arr state when postsNumber state changes
	useEffect(() => {
		findPostsFromUser(otherUserId, postsNumber).then((newPostsArr) => {
			if (newPostsArr != null) {
				setPostsArr(newPostsArr);
				if (newPostsArr.length < postsNumber) {
					setAllLoaded(true);
				}
			} else {
				setPostsArr(null);
			}
		});
	}, [postsNumber]);

	// Update posts component state on render & when postsArr state changes
	useEffect(() => {
		if (postsArr != null) {
			setPosts(
				<div id='user-posts'>
					{postsArr.map((post) => {
						return (
							<PostPreview
								postId={post.id}
								postText={post.data.text}
								postImage={post.data.image}
								postDate={post.data.date}
								postOwnerId={post.data.user}
								postLikes={post.data.likes}
								postComments={post.data.comments}
								user={user}
							/>
						);
					})}
				</div>
			);
		} else {
			setPosts(<div id='user-posts-empty'>This user has no posts.</div>);
		}
	}, [postsArr]);

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
					{posts}
				</div>
			</div>
		</div>
	);
};

export { Profile };

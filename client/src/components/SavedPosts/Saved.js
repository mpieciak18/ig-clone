import './Saved.css';
import { findSaves } from '../../firebase/saves.js';
import { findSinglePost } from '../../firebase/posts.js';
import { PostPreview } from '../Post/children/PostPreview.js';
import { useState, useEffect } from 'react';
import { Navbar } from '../other/Navbar.js';
import { useAuth } from '../../contexts/AuthContext';

const Saved = () => {
	// Redirect to signup page if not signed in
	const { user } = useAuth();

	// Init postsNumber state
	const [postsNumber, setPostsNumber] = useState(21);

	// Init postsArr state
	const [postsArr, setPostsArr] = useState(null);

	// Init posts state
	const [posts, setPosts] = useState(null);

	// Init all loaded state
	const [allLoaded, setAllLoaded] = useState(false);

	const updatePostsArr = async () => {
		const savedArr = await findSaves(postsNumber);
		if (savedArr != null) {
			let newPostsArr = [];
			for (const save of savedArr) {
				const result = await findSinglePost(
					save.data.postId,
					save.data.postOwner
				);
				newPostsArr = [...newPostsArr, result];
			}
			setPostsArr(newPostsArr);
			if (newPostsArr.length < postsNumber) {
				setAllLoaded(true);
			}
		} else {
			setPostsArr(null);
		}
	};

	// Update posts state when postsNumber state changes
	useEffect(() => {
		if (user != null) {
			updatePostsArr();
		} else {
			setPostsArr(null);
		}
	}, [postsNumber, user]);

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
		<div id='saved' className='page'>
			<Navbar />
			{postsArr != null ? (
				<div id='saved-posts'>
					<div id='saved-posts-title'>Saved Posts</div>
					<div id='saved-posts-content'>
						{postsArr.map((post) => {
							return (
								<PostPreview
									key={post.id}
									postId={post.id}
									postText={post.data.text}
									postImage={post.data.image}
									postDate={post.data.date}
									postOwnerId={post.data.user}
									postLikes={post.data.likes}
									postComments={post.data.comments}
								/>
							);
						})}
					</div>
				</div>
			) : (
				<div id='user-posts-empty'>This user has no posts.</div>
			)}
		</div>
	);
};

export { Saved };

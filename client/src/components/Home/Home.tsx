import './Home.css';
import { findPosts } from '../../services/posts.js';
import { Navbar } from '../other/Navbar.js';
import { PostReel } from '../Post/children/PostReel.js';
import { UserCard } from './children/UserCard.js';
import { useEffect, useState } from 'react';
import { Post } from 'shared';

const Home = () => {
	// Init postsNumber state
	const [postsNumber, setPostsNumber] = useState(5);

	// Init posts array state
	const [postsArr, setPostsArr] = useState([]);

	// Init all loaded state
	const [allLoaded, setAllLoaded] = useState(false);

	// Init isLoading state
	const [isLoading, setIsLoading] = useState(false);

	// Load more content when user reaches bottom of document
	const loadMore = async (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
		const elem = e.target as HTMLDivElement;
		if (
			Math.ceil(elem.scrollHeight - elem.scrollTop) ==
				elem.clientHeight &&
			allLoaded == false &&
			isLoading == false
		) {
			setIsLoading(true);
			setPostsNumber(postsNumber + 5);
		}
	};

	// Update postsArr state when postsNumber state changes
	useEffect(() => {
		findPosts(postsNumber).then((newPostsArr) => {
			if (newPostsArr.length < postsNumber) {
				setAllLoaded(true);
			}
			setPostsArr(newPostsArr);
			setIsLoading(false);
		});
	}, [postsNumber]);

	return (
		<div id='home' className='page'>
			<Navbar />
			<div id='home-container' onScroll={(e) => loadMore(e)}>
				<UserCard />
				<div id='home-posts'>
					{postsArr.map((post: Post) => {
						return <PostReel key={post.id} post={post} />;
					})}
				</div>
			</div>
		</div>
	);
};

export { Home };

import './Saved.css';
import { getSaves } from '../../services/saves.js';
import { PostPreview } from '../Post/children/PostPreview.js';
import { useState, useEffect } from 'react';
import { Navbar } from '../other/Navbar.js';
import { useAuth } from '../../contexts/AuthContext';

const Saved = () => {
	// Redirect to signup page if not signed in
	const { user } = useAuth();

	// Init savesNumber state
	const [savesNumber, setSavesNumber] = useState(21);

	// Init savesArr state
	const [savesArr, setSavesArr] = useState(null);

	// Init all loaded state
	const [allLoaded, setAllLoaded] = useState(false);

	// Update savesArr state when savesNumber or user state changes
	useEffect(() => {
		if (user != null) {
			getSaves(savesNumber).then((savedArr) => {
				setSavesArr(savedArr);
				if (savedArr.length < savesNumber) {
					setAllLoaded(true);
				}
			});
		} else {
			setSavesArr([]);
		}
	}, [savesNumber, user]);

	// Load-more function that updates the saves reel
	const loadMore = () => {
		if (allLoaded == false) {
			const newSavesNumber = savesNumber + 9;
			setSavesNumber(newSavesNumber);
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
			{savesArr?.length > 0 ? (
				<div id='saved-posts'>
					<div id='saved-posts-title'>Saved Posts</div>
					<div id='saved-posts-content'>
						{savesArr.map((save) => {
							return (
								<PostPreview
									key={save.postId}
									postId={save.postId}
									postCaption={save.post.text}
									postImage={save.post.image}
									postDate={save.post.createdAt}
									postOwnerId={save.post.userId}
									postLikes={save.post.likes}
									postComments={save.post.comments}
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

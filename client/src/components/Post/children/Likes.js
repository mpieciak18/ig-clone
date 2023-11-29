import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getLikes } from '../../../services/likes.js';
import { FollowButton } from '../../other/FollowButton.js';
import '../styles/Likes.css';
import { usePopUp } from '../../../contexts/PopUpContext.js';

const Likes = (props) => {
	const { updatePopUp } = usePopUp();
	const { postId } = props;

	// Init likesNumber state
	const [likesNumber, setLikesNumber] = useState(10);

	// Init users state
	const [likesArr, setLikesArr] = useState([]);

	// Init all likes loaded state
	const [allLoaded, setAllLoaded] = useState(false);

	// Update likesNumber upon render
	useEffect(() => {
		setLikesNumber(10);
	}, []);

	// Update likesArr when likesNumber changes (ie, upon render or upon scroll-to-bottom)
	useEffect(() => {
		getLikes(postId, likesNumber).then((newLikesArr) => {
			setLikesArr(newLikesArr);
			if (newLikesArr.length < likesNumber) {
				setAllLoaded(true);
			}
		});
	}, [likesNumber]);

	// Load more likes when user reaches bottom of pop-up
	const loadMore = (e) => {
		const elem = e.target;
		if (
			Math.ceil(elem.scrollHeight - elem.scrollTop) ==
				elem.clientHeight &&
			allLoaded == false
		) {
			const newLikesNumber = likesNumber + 20;
			setLikesNumber(newLikesNumber);
		}
	};

	// Closes likes pop-up
	const hideLikes = (e) => {
		const id = e.target.id;
		if (id == 'likes' || id == 'likes-x-button') {
			updatePopUp();
		}
	};

	return (
		<div id='likes' onClick={hideLikes}>
			<div id='likes-pop-up'>
				<div id='likes-header'>
					<div id='likes-x-button'>« Go Back</div>
					<div id='likes-title'>Likes</div>
					<div id='likes-x-button-hidden'>« Go Back</div>
				</div>
				<div id='likes-divider' />
				<div id='likes-list' onScroll={loadMore}>
					{likesArr.length
						? likesArr.map((like) => {
								return (
									<div className='like-row' key={like.id}>
										<Link
											className='like-row-left'
											to={`/${like.user.id}`}
										>
											<img
												className='like-image'
												src={like.user.image}
											/>
											<div className='like-text'>
												<div className='like-name'>
													{like.user.name}
												</div>
												<div className='like-username'>
													@{like.user.username}
												</div>
											</div>
										</Link>
										<div className='like-row-right'>
											<FollowButton
												otherUserId={like.user.id}
											/>
										</div>
									</div>
								);
						  })
						: null}
				</div>
			</div>
		</div>
	);
};

export { Likes };

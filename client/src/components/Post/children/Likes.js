import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getLikes } from '../../../services/likes.js';
import { FollowButton } from '../../other/FollowButton.js';
import { findUser } from '../../../services/users.js';
import '../styles/Likes.css';
import { usePopUp } from '../../../contexts/PopUpContext.js';

const Likes = (props) => {
	const { updatePopUp } = usePopUp();
	const { postId, postOwnerId } = props;

	// Init likesNumber state
	const [likesNumber, setLikesNumber] = useState(10);

	// Init users state
	const [likesArr, setLikesArr] = useState(null);

	// Init all likes loaded state
	const [allLoaded, setAllLoaded] = useState(false);

	// Init likes component state
	const [likes, setLikes] = useState(null);

	// Update likesNumber upon render
	useEffect(() => {
		setLikesNumber(10);
	}, []);

	// Update likesArr when likesNumber changes (ie, upon render or upon scroll-to-bottom)
	useEffect(() => {
		getLikes(postId, postOwnerId, likesNumber).then((newLikesArr) => {
			setLikesArr(newLikesArr);
			if (newLikesArr.length < likesNumber) {
				setAllLoaded(true);
			}
		});
	}, [likesNumber]);

	const updateLikes = async () => {
		const likesObjs = likesArr.map(async (like) => {
			const likerId = like.data.user;
			const liker = await findUser(likerId);
			const likerName = liker.data.name;
			const likerUsername = liker.data.username;
			const likerImage = liker.data.image;
			return (
				<div className='like-row' key={like.id}>
					<Link className='like-row-left' to={`/${likerId}`}>
						<img className='like-image' src={likerImage} />
						<div className='like-text'>
							<div className='like-name'>{likerName}</div>
							<div className='like-username'>
								@{likerUsername}
							</div>
						</div>
					</Link>
					<div className='like-row-right'>
						<FollowButton otherUserId={likerId} />
					</div>
				</div>
			);
		});
		const returnVal = await Promise.all(likesObjs);
		setLikes(returnVal);
	};

	// Update the likes component when the likesArr changes
	useEffect(() => {
		if (likesArr != null) {
			updateLikes();
		} else {
			setLikes(null);
		}
	}, [likesArr]);

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
					{likes}
				</div>
			</div>
		</div>
	);
};

export { Likes };

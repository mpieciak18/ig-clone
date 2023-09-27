import { getUrl } from '../../../firebase/storage.js';
import { useState, useEffect } from 'react';
import { findUser } from '../../../firebase/users.js';
import { Follows } from '../../other/Follows.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext.js';
import { usePopUp } from '../../../contexts/PopUpContext.js';

const ProfileCard = (props) => {
	const { user } = useAuth();
	const { popUpState, updatePopUp } = usePopUp();
	const { otherUserId } = props;

	const navigate = useNavigate();

	// Init profile image state
	const [img, setImg] = useState(null);

	// Init otherUser id/data state
	const [otherUser, setOtherUser] = useState(null);

	// Init profileCard component state
	const [profileCard, setProfileCard] = useState(null);

	// Init state for follows pop-up component
	const [follows, setFollows] = useState(null);

	// Init state to determine if pop-up shows following or followers
	const [followingVsFollower, setFollowingVsFollower] = useState('following');

	// Open Follows pop-up (following)
	const clickFollowing = () => {
		if (user != null) {
			setFollowingVsFollower('following');
			updatePopUp('followsOn');
		} else {
			navigate('/signup');
		}
	};

	// Open Follows pop-up (followers)
	const clickFollowers = () => {
		if (user != null) {
			setFollowingVsFollower('followers');
			updatePopUp('followsOn');
		} else {
			navigate('/signup');
		}
	};

	// Update img, otherUser, & otherUserFollowers states on render
	useEffect(() => {
		findUser(otherUserId).then((newUser) => {
			getUrl(newUser.data.image).then(setImg);
			setOtherUser(newUser);
		});
	}, []);

	useEffect(() => {
		// if (otherUser != null && popUpState != null) {
		if (otherUser != null) {
			setProfileCard(
				<div id='profile-card'>
					<div id='profile-card-top'>
						<img id='profile-card-icon' src={img} />
						<div id='profile-card-text'>
							<div id='profile-card-name'>
								{otherUser.data.name}
							</div>
							<div id='profile-card-username'>
								@{otherUser.data.username}
							</div>
						</div>
					</div>
					<div id='profile-card-bottom'>
						<div id='profile-card-stats'>
							<div id='profile-card-posts'>
								<p className='profile-stats-child-num'>
									{otherUser.data.posts}
								</p>
								<p className='profile-stats-child-type'>
									Posts
								</p>
							</div>
							<div
								id='profile-card-following'
								onClick={clickFollowing}
							>
								<p className='profile-stats-child-num'>
									{otherUser.data.following}
								</p>
								<p className='profile-stats-child-type'>
									Following
								</p>
							</div>
							<div
								id='profile-card-followers'
								onClick={clickFollowers}
							>
								<p className='profile-stats-child-num'>
									{otherUser.data.followers}
								</p>
								<p className='profile-stats-child-type'>
									Followers
								</p>
							</div>
						</div>
						<div id='profile-card-bio'>{otherUser.data.bio}</div>
					</div>
					{follows}
				</div>
			);
		}
	}, [otherUser, follows]);

	// Update follows state if followsOn state changes
	useEffect(() => {
		if (popUpState != null) {
			const body = document.querySelector('body');
			if (popUpState.followsOn == false) {
				body.style.overflow = 'auto';
				setFollows(null);
			} else {
				body.style.overflow = 'hidden';
				setFollows(
					<Follows
						otherUserId={otherUserId}
						initTab={followingVsFollower}
					/>
				);
			}
		}
	}, [popUpState]);

	return profileCard;
};

export { ProfileCard };

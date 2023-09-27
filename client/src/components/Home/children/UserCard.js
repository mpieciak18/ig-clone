import { useNavigate } from 'react-router-dom';
import { getUrl } from '../../../firebase/storage.js';
import { Follows } from '../../other/Follows.js';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext.js';
import { usePopUp } from '../../../contexts/PopUpContext.js';

const UserCard = () => {
	const { user } = useAuth();
	const { popUpState, updatePopUp } = usePopUp();

	const navigate = useNavigate();

	// Init user card component state
	const [userCard, setUserCard] = useState(null);

	// Init state for user's profile image
	const [userImage, setUserImage] = useState(null);

	// Init state for follows pop-up component
	const [follows, setFollows] = useState(null);

	// Init state to determine if pop-up shows following or followers
	const [followingVsFollower, setFollowingVsFollower] = useState('following');

	// Open Follows pop-up (following)
	const clickFollowing = () => {
		setFollowingVsFollower('following');
		updatePopUp('followsOn');
	};

	// Open Follows pop-up (followers)
	const clickFollowers = () => {
		setFollowingVsFollower('followers');
		updatePopUp('followsOn');
	};

	// Redirect to user's profile
	const redirectToProfile = () => navigate(`/${user.id}`);

	// Redirect to sign-up
	const redirectToSignup = () => navigate('/signup');

	// Redirect to login
	const redirectToLogin = () => navigate('/login');

	// Update user card state or user image state when user prop changes
	useEffect(() => {
		if (user == null) {
			setUserCard(
				<div id='user-card'>
					<div id='user-card-sign-up' onClick={redirectToSignup}>
						Sign Up
					</div>
					<div id='user-card-login' onClick={redirectToLogin}>
						Login
					</div>
				</div>
			);
		} else {
			const path = user.data.image;
			getUrl(path).then(setUserImage);
		}
	}, [user]);

	// Update user card state when user image state or follows state change
	useEffect(() => {
		if (user != null) {
			setUserCard(
				<div id='user-card'>
					<div id='user-card-top' onClick={redirectToProfile}>
						<img id='user-card-icon' src={userImage} />
						<div id='user-card-names'>
							<div id='user-card-name'>{user.data.name}</div>
							<div id='user-card-username'>{`@${user.data.username}`}</div>
						</div>
					</div>
					<div id='user-card-bottom'>
						<div id='user-card-posts' onClick={redirectToProfile}>
							<p className='user-stats-child-num'>
								{user.data.posts}
							</p>
							<p className='user-stats-child-type'>Posts</p>
						</div>
						<div id='user-card-following' onClick={clickFollowing}>
							<p className='user-stats-child-num'>
								{user.data.following}
							</p>
							<p className='user-stats-child-type'>Following</p>
						</div>
						<div id='user-card-followers' onClick={clickFollowers}>
							<p className='user-stats-child-num'>
								{user.data.followers}
							</p>
							<p className='user-stats-child-type'>Followers</p>
						</div>
					</div>
					{follows}
				</div>
			);
		}
	}, [userImage, follows]);

	// Update follows state if followsOn state changes
	useEffect(() => {
		if (popUpState.followsOn == false) {
			setFollows(null);
			// clearAllBodyScrollLocks();
		} else {
			setFollows(
				<Follows
					user={user}
					otherUserId={user.id}
					initTab={followingVsFollower}
				/>
			);
			// disableBodyScroll(document.getElementById('follow'));
		}
	}, [popUpState.followsOn]);

	return userCard;
};

export { UserCard };

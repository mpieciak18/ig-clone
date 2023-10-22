import { useNavigate, useParams } from 'react-router-dom';
import { getFollowing, getFollowers } from '../../services/followers.js';
import { FollowButton } from './FollowButton.js';
import './other.css';
import { useEffect, useState } from 'react';
import { findUser } from '../../services/users.js';
import { usePopUp } from '../../contexts/PopUpContext.js';

const Follows = (props) => {
	const { otherUserId, initTab } = props;
	const { updatePopUp } = usePopUp();

	const navigate = useNavigate();

	const location = useParams();

	// Init following/follower users count
	const [usersCount, setUsersCount] = useState(20);

	// Init following/follower users arr state
	const [usersArr, setUsersArr] = useState(null);

	// Init following/follower component state
	const [users, setUsers] = useState(null);

	// Init all loaded state
	const [allLoaded, setAllLoaded] = useState(false);

	// Init loading state
	const [isLoading, setIsLoading] = useState(false);

	// Init whichTab state
	const [whichTab, setWhichTab] = useState(null);

	// Init followers & following buttons classes
	const [buttonOne, setButtonOne] = useState(null);
	const [buttonTwo, setButtonTwo] = useState(null);

	// Change whichTab upon render & initTab prop change
	useEffect(() => {
		setWhichTab(initTab);
	}, [initTab]);

	// Change usersArr, allLoaded, and button states when whichTab changes
	useEffect(() => {
		setAllLoaded(false);
		if (whichTab == 'following') {
			setButtonOne('active');
			setButtonTwo('inactive');
			getFollowing(otherUserId, usersCount).then(setUsersArr);
		} else {
			setButtonOne('inactive');
			setButtonTwo('active');
			getFollowers(otherUserId, usersCount).then(setUsersArr);
		}
	}, [whichTab]);

	const updateUsers = async () => {
		const newUsers = usersArr.map(async (otherUser) => {
			const userId = otherUser.data.otherUser;
			const userInfo = await findUser(userId);
			const redirect = () => {
				updatePopUp();
				if (location.otherUserId == null) {
					navigate(`/${userId}`);
				} else {
					navigate(`/${userId}`);
					window.location.reload();
				}
			};
			return (
				<div className='follow-row' key={userId}>
					<div className='follow-row-left' onClick={redirect}>
						<img
							className='follow-image'
							src={userInfo.data.image}
						/>
						<div className='follow-text'>
							<div className='follow-name'>
								{userInfo.data.name}
							</div>
							<div className='follow-username'>
								@{userInfo.data.username}
							</div>
						</div>
					</div>
					<div className='follow-row-right'>
						<FollowButton otherUserId={userId} />
					</div>
				</div>
			);
		});
		const returnVal = await Promise.all(newUsers);
		setUsers(returnVal);
	};

	// Update users component state when usersArr changes
	useEffect(() => {
		if (usersArr != null) {
			updateUsers();
		}
	}, [usersArr]);

	// Load more follows/followers when user reaches bottom of pop-up
	const loadMore = async (e) => {
		if (allLoaded == false && isLoading == false) {
			const elem = e.target;
			if (
				Math.ceil(elem.scrollHeight - elem.scrollTop) ==
				elem.clientHeight
			) {
				setIsLoading(true);
				const newCount = usersCount + 20;
				setUsersCount(newCount);
				let newUsersArr;
				if (whichTab == 'following') {
					await getFollowing(otherUserId, newCount).then(setUsersArr);
				} else {
					await getFollowers(otherUserId, newCount).then(setUsersArr);
				}
				if (newUsersArr.length < newCount) {
					setAllLoaded(true);
				}
				setIsLoading(false);
			}
		}
	};

	// Event handlers for buttons
	const followingClick = () => setWhichTab('following');

	const followersClick = () => setWhichTab('followers');

	const xButtonClick = () => updatePopUp();

	return (
		<div id='follow'>
			<div id='follows-pop-up'>
				<div id='follows-header'>
					<div id='follows-x-button' onClick={xButtonClick}>
						« Go Back
					</div>
					<div id='follows-header-menu'>
						<div
							id='following-button'
							className={buttonOne}
							onClick={followingClick}
						>
							Following
						</div>
						<div
							id='followers-button'
							className={buttonTwo}
							onClick={followersClick}
						>
							Followers
						</div>
					</div>
					<div id='follows-x-button-hidden'>« Go Back</div>
				</div>
				<div id='follows-divider' />
				<div id='follows-list' onScroll={loadMore}>
					{users}
				</div>
			</div>
		</div>
	);
};

export { Follows };

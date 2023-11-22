import { useNavigate, useParams } from 'react-router-dom';
import { getFollowing, getFollowers } from '../../services/followers.js';
import { FollowButton } from './FollowButton.js';
import './other.css';
import { useEffect, useState } from 'react';
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
					newUsersArr = await getFollowing(otherUserId, newCount);
					setUsersArr(newUsersArr);
				} else {
					newUsersArr = await getFollowers(otherUserId, newCount);
					setUsersArr(newUsersArr);
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
					{usersArr?.length
						? usersArr.map((otherUser) => {
								const redirect = () => {
									updatePopUp();
									if (location.otherUserId == null) {
										navigate(`/${otherUser.id}`);
									} else {
										navigate(`/${otherUser.id}`);
										window.location.reload();
									}
								};
								return (
									<div
										className='follow-row'
										key={otherUser.id}
									>
										<div
											className='follow-row-left'
											onClick={redirect}
										>
											<img
												className='follow-image'
												src={otherUser.image}
											/>
											<div className='follow-text'>
												<div className='follow-name'>
													{otherUser.name}
												</div>
												<div className='follow-username'>
													@{otherUser.username}
												</div>
											</div>
										</div>
										<div className='follow-row-right'>
											<FollowButton
												otherUserId={otherUser.id}
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

export { Follows };

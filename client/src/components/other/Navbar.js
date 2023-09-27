import './other.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NewPost } from './NewPost.js';
import { SettingsPopup } from './SettingsPopup.js';
import { Notifications } from './Notifications.js';
import { SearchPopup } from './SearchPopup.js';
import Logo from '../../assets/images/ig-logo-2.png';
import HomeHollow from '../../assets/images/home.png';
import HomeSolid from '../../assets/images/home-solid.png';
import SettingsHollow from '../../assets/images/profile.png';
import SettingsSolid from '../../assets/images/profile-solid.png';
import PostHollow from '../../assets/images/post.png';
import PostSolid from '../../assets/images/post-solid.png';
import NotificationsHollow from '../../assets/images/like.png';
import NotificationsSolid from '../../assets/images/like-solid.png';
import MessagesHollow from '../../assets/images/messages.png';
import MessagesSolid from '../../assets/images/messages-solid.png';

const Navbar = (props) => {
	const { user, setUser, popUpState, updatePopUp } = props;

	const navigate = useNavigate();

	// Init settings pop-up visibility state
	const [viewSettings, setViewSettings] = useState(false);

	// Init navbar buttons
	const [homeImg, setHomeImg] = useState(HomeHollow);
	const [messageImg, setMessageImg] = useState(MessagesHollow);
	const [postImg, setPostImg] = useState(PostHollow);
	const [notifImg, setNotifImg] = useState(NotificationsHollow);
	const [settingsImg, setSettingsImg] = useState(SettingsHollow);

	// Init search bar value
	const [searchVal, setSearchVal] = useState('');

	const updateSearchVal = (e) => setSearchVal(e.target.value);

	// Update popUpState.searchOn
	const clickSearch = () => updatePopUp('searchOn');

	// Redirect to home & update popUpState
	const clickHome = () => {
		updatePopUp();
		navigate('/');
	};

	// Update popUpState.newPostOn (or redirect to sign-up page)
	const clickNewPost = () => {
		if (user == null) {
			navigate('/signup');
		} else if (popUpState.newPostOn == false) {
			updatePopUp('newPostOn');
		} else {
			updatePopUp();
		}
	};

	// Update popUpState.notifsOn (or redirect to sign-up page)
	const clickNotifications = async () => {
		if (user == null) {
			navigate('/signup');
		} else if (popUpState.notifsOn == false) {
			await updatePopUp('notifsOn');
		} else {
			updatePopUp();
		}
	};

	// Navigate to direct messages & update popUpState (or redirect to sign-up page)
	const clickMessages = () => {
		if (user == null) {
			navigate('/signup');
		} else {
			updatePopUp();
			navigate('/messages');
		}
	};

	// Update viewSettings (or redirect to sign-up page)
	const clickSettings = () => {
		if (user == null) {
			navigate('/signup');
		} else if (viewSettings == false) {
			setViewSettings(true);
		} else {
			setViewSettings(false);
		}
	};

	// Init notifications component state
	const [notifications, setNotifications] = useState(null);

	// Init new post component state
	const [newPost, setNewPost] = useState(null);

	// Init search pop-up component state
	const [searchPopUp, setSearchPopUp] = useState(null);

	// Update various states when popUpState changes
	useEffect(() => {
		if (popUpState.notifsOn == true) {
			setNotifications(
				<Notifications user={user} updatePopUp={updatePopUp} />
			);
			setNewPost(null);
			setSearchPopUp(null);
			// disableBodyScroll(document.getElementById('notifs-list'));
		} else if (popUpState.newPostOn == true) {
			setNewPost(
				<NewPost
					user={user}
					setUser={setUser}
					updatePopUp={updatePopUp}
				/>
			);
			setNotifications(null);
			setSearchPopUp(null);
			// disableBodyScroll(document.getElementById('new-post'));
		} else if (popUpState.searchOn == true) {
			setSearchPopUp(
				<SearchPopup
					user={user}
					updatePopUp={updatePopUp}
					searchVal={searchVal}
				/>
			);
			setNotifications(null);
			setNewPost(null);
			// disableBodyScroll(document.getElementById('search-popup'));
		} else {
			setNotifications(null);
			setNewPost(null);
			setSearchPopUp(null);
			// clearAllBodyScrollLocks();
		}
	}, [popUpState, searchVal]);

	return (
		<div id='navbar'>
			{notifications}
			{newPost}
			<div id='navbar-logo' onClick={clickHome}>
				<img id='navbar-logo-icon' src={Logo} />
				<div id='navbar-logo-text'>Markstagram</div>
			</div>
			<input
				id='navbar-search'
				type='text'
				placeholder='Search'
				onChange={updateSearchVal}
				onFocus={clickSearch}
			/>
			{searchPopUp}
			<div id='navbar-buttons'>
				<img
					id='home-button'
					src={homeImg}
					onClick={clickHome}
					onMouseDown={() => setHomeImg(HomeSolid)}
					onMouseUp={() => setHomeImg(HomeHollow)}
					onMouseOver={() => setHomeImg(HomeSolid)}
					onMouseOut={() => setHomeImg(HomeHollow)}
				/>
				<img
					id='messages-button'
					src={messageImg}
					onClick={clickMessages}
					onMouseDown={() => setMessageImg(MessagesSolid)}
					onMouseUp={() => setMessageImg(MessagesHollow)}
					onMouseOver={() => setMessageImg(MessagesSolid)}
					onMouseOut={() => setMessageImg(MessagesHollow)}
				/>
				<img
					id='post-button'
					src={postImg}
					onClick={clickNewPost}
					onMouseDown={() => setPostImg(PostSolid)}
					onMouseUp={() => setPostImg(PostHollow)}
					onMouseOver={() => setPostImg(PostSolid)}
					onMouseOut={() => setPostImg(PostHollow)}
				/>
				<div id='notifications-button-container'>
					<img
						id='notifications-button'
						src={notifImg}
						onClick={clickNotifications}
						onMouseDown={() => setNotifImg(NotificationsSolid)}
						onMouseUp={() => setNotifImg(NotificationsHollow)}
						onMouseOver={() => setNotifImg(NotificationsSolid)}
						onMouseOut={() => setNotifImg(NotificationsHollow)}
					/>
				</div>
				<img
					id='settings-button'
					src={settingsImg}
					onClick={clickSettings}
					onMouseDown={() => setSettingsImg(SettingsSolid)}
					onMouseUp={() => setSettingsImg(SettingsHollow)}
					onMouseOver={() => setSettingsImg(SettingsSolid)}
					onMouseOut={() => setSettingsImg(SettingsHollow)}
				/>
				<SettingsPopup
					user={user}
					viewSettings={viewSettings}
					setViewSettings={setViewSettings}
				/>
			</div>
		</div>
	);
};

export { Navbar };

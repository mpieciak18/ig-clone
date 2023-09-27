import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	getNewNotifications,
	getOldNotifications,
	readNotifications,
} from '../../firebase/notifications';
import { getUrl } from '../../firebase/storage';
import { findUser } from '../../firebase/users';
import { timeSince } from '../../other/timeSince';

const Notifications = (props) => {
	const { user, updatePopUp } = props;

	const navigate = useNavigate();

	// Init notifcations count state
	const [notifsCount, setNotifsCount] = useState(0);

	// Init notifications arr state
	const [notifsArr, setNotifsArr] = useState(null);

	// Init notifications child component state
	const [notifs, setNotifs] = useState(null);

	// Init notifications pop-up component state
	const [notifsPopup, setNotifsPopup] = useState(null);

	// Init all loaded state
	const [allLoaded, setAllLoaded] = useState(false);

	// Init loading state
	const [loadingMore, setLoadingMore] = useState(false);

	// Init whichTab state
	const [whichTab, setWhichTab] = useState('new');

	// Init new & old notifications button classes
	const [buttonOne, setButtonOne] = useState(null);
	const [buttonTwo, setButtonTwo] = useState(null);

	// Init markAllRead component
	const [markAllRead, setMarkAllRead] = useState(null);

	// Change notifsCount, allLoaded, button, and markAllRead states when whichTab changes
	useEffect(() => {
		setAllLoaded(false);
		console.log(whichTab);
		if (whichTab == 'new') {
			setButtonOne('active');
			setButtonTwo('inactive');
		} else {
			setButtonOne('inactive');
			setButtonTwo('active');
		}
		if (notifsCount == 20) {
			updateNotifsArr();
		} else {
			setNotifsCount(20);
		}
	}, [whichTab]);

	const updateNotifsArr = async () => {
		if (whichTab == 'new') {
			getNewNotifications(notifsCount).then((newNotifsArr) => {
				setNotifsArr(newNotifsArr);
				if (newNotifsArr != null) {
					setMarkAllRead(
						<div
							id='notifs-clear'
							className='button'
							onClick={clearNotifs}
						>
							Mark All Read
						</div>
					);
				} else {
					setMarkAllRead(
						<div id='notifs-clear' className='message'>
							No Unread Notifications
						</div>
					);
				}
				if (newNotifsArr.length < notifsCount) {
					setAllLoaded(true);
				}
			});
		} else {
			getOldNotifications(notifsCount).then((newNotifsArr) => {
				setNotifsArr(newNotifsArr);
				if (newNotifsArr != null) {
					setMarkAllRead(null);
				} else {
					setMarkAllRead(
						<div id='notifs-clear' className='message'>
							No Read Notifications
						</div>
					);
				}
				if (newNotifsArr?.length < notifsCount) {
					setAllLoaded(true);
				}
			});
		}
	};

	// Change notifsArr state when notifsCount changes
	useEffect(() => {
		if (notifsCount > 0) {
			updateNotifsArr();
		} else {
			setNotifsArr(null);
		}
	}, [notifsCount]);

	const updateNotifs = async () => {
		const newNotifs = notifsArr.map(async (notif) => {
			// Set up requisite variables
			const otherUserId = notif.data.otherUser;
			const otherUser = await findUser(otherUserId);
			const redirectToProfile = () => {
				navigate(`/${otherUserId}`);
				updatePopUp();
			};
			const image = await getUrl(otherUser.data.image);
			// Set up text portion of returned component
			let path;
			let text;
			if (notif.data.type == 'like') {
				path = `/${user.id}/${notif.data.post}`;
				text = 'liked your post.';
			} else if (notif.data.type == 'comment') {
				path = `/${user.id}/${notif.data.post}`;
				text = 'commented on a post.';
			} else if (notif.data.type == 'follow') {
				path = `/${otherUserId}`;
				text = 'is following you.';
			} else {
				path = `/messages/${otherUserId}`;
				text = 'messaged you.';
			}
			const redirectToPath = () => {
				navigate(`/${path}`);
				updatePopUp();
			};
			const time = timeSince(notif.data.date);
			return (
				<div className='notif-row' key={notif.id}>
					<div className='notif-row-left'>
						<img
							className='notif-image'
							onClick={redirectToProfile}
							src={image}
						/>
						<div className='notif-text' onClick={redirectToPath}>
							<div className='notif-name'>
								{otherUser.data.name}
							</div>
							<div className='notif-action'>{text}</div>
						</div>
					</div>
					<div className='notif-row-right'>
						<div className='notif-time'>{time}</div>
					</div>
				</div>
			);
		});
		const returnVal = await Promise.all(newNotifs);
		setNotifs(returnVal);
	};

	// Update notifs component state when notifsArr changes
	useEffect(() => {
		if (notifsArr != null) {
			updateNotifs();
		} else {
			setNotifs(null);
		}
	}, [notifsArr]);

	// Update notifsPopup component
	useEffect(() => {
		setNotifsPopup(
			<div id='notifs'>
				<div id='notifs-pop-up'>
					<div id='notifs-header'>
						<div id='notifs-x-button' onClick={xButtonClick}>
							« Go Back
						</div>
						<div id='notifs-header-menu'>
							<div id='notifs-button-label'>Notifications:</div>
							<div
								id='new-button'
								className={buttonOne}
								onClick={newClick}
							>
								New
							</div>
							<div
								id='old-button'
								className={buttonTwo}
								onClick={oldClick}
							>
								Old
							</div>
						</div>
						<div id='notifs-x-button-hidden'>« Go Back</div>
					</div>
					<div id='notifs-divider' />
					<div
						id='notifs-list'
						className={buttonOne}
						onScroll={loadMore}
					>
						{notifs}
					</div>
					{markAllRead}
				</div>
			</div>
		);
	}, [buttonOne, buttonTwo, notifs, markAllRead]);

	// Load more notifications when user reaches bottom of pop-up
	const loadMore = async (e) => {
		if (allLoaded == false && loadingMore == false) {
			const elem = e.target;
			if (
				Math.ceil(elem.scrollHeight - elem.scrollTop) ==
				elem.clientHeight
			) {
				await setLoadingMore(true);
				const newCount = notifsCount + 20;
				await setNotifsCount(newCount);
				await setLoadingMore(false);
			}
		}
	};

	// Event handlers for buttons
	const newClick = () => setWhichTab('new');

	const oldClick = () => setWhichTab('old');

	const xButtonClick = () => updatePopUp();

	const clearNotifs = () => {
		readNotifications();
		setNotifsCount(0);
	};

	return notifsPopup;
};

export { Notifications };

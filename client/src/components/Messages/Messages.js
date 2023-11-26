import './Messages.css';
import { getConvos } from '../../services/messages.js';
import { useState, useEffect } from 'react';
import { Navbar } from '../other/Navbar.js';
import MessageSolid from '../../assets/images/dm.png';
import { ConvoPopup } from '../other/ConvoPopup.js';
import { useAuth } from '../../contexts/AuthContext';
import { usePopUp } from '../../contexts/PopUpContext';
import { MessagesChild } from './children/MessagesChild';

const Messages = () => {
	const { user } = useAuth();
	const { popUpState, updatePopUp } = usePopUp();

	// Init user image state
	const [userImage, setUserImage] = useState(null);

	// Init convos count state
	const [convosCount, setConvosCount] = useState(20);

	// Init convos arr state
	const [convosArr, setConvosArr] = useState([]);

	// Init all convos loaded state
	const [allLoaded, setAllLoaded] = useState(false);

	// Init search popup
	const [searchPopUp, setSearchPopUp] = useState(null);

	// Update search pop up state when popUpState changes
	useEffect(() => {
		if (popUpState.convosOn == true) {
			setSearchPopUp(<ConvoPopup />);
			// disableBodyScroll(document.getElementById('convo-popup-bottom'));
		} else {
			setSearchPopUp(null);
			// clearAllBodyScrollLocks();
		}
	}, [popUpState.convosOn]);

	// Open search pop-up on click
	const openPopup = () => updatePopUp('convosOn');

	// Update userImage state when user changes
	useEffect(() => {
		if (user != null) {
			setUserImage(user.image);
		} else {
			setUserImage(null);
		}
	}, [user]);

	// Update convosArr state when convosCount or user changes
	useEffect(() => {
		if (user != null) {
			getConvos(convosCount).then((newConvosArr) => {
				if (newConvosArr != null) {
					setConvosArr(newConvosArr);
					if (newConvosArr.length < convosCount) {
						setAllLoaded('true');
					}
				} else {
					setConvosArr(null);
				}
			});
		} else {
			setConvosArr([]);
		}
	}, [convosCount, user]);

	// Load-more function that updates the convos component
	const loadMore = () => {
		if (allLoaded == false) {
			const newConvosCount = convosCount + 10;
			setConvosCount(newConvosCount);
		}
	};

	// Trigger loadMore when user scrolls to bottom of page
	window.addEventListener('scroll', () => {
		if (
			window.innerHeight + Math.ceil(window.pageYOffset) >=
			document.body.offsetHeight - 2
		) {
			loadMore();
		}
	});

	return (
		<div id='messages' className='page'>
			<Navbar />
			{user ? (
				<div id='convos'>
					{searchPopUp}
					<div id='convos-top'>
						<img id='convos-user-icon' src={userImage} />
						<div id='convos-title'>Messages</div>
						<div id='convos-message-icon-container'>
							<img
								id='convos-message-icon'
								src={MessageSolid}
								onClick={openPopup}
							/>
						</div>
					</div>
					<div id='convos-divider'></div>
					<div id='convos-bottom'>
						{convosArr?.length
							? convosArr.map((convo) => (
									<MessagesChild
										key={convo.id}
										convo={convo}
									/>
							  ))
							: null}
					</div>
				</div>
			) : null}
		</div>
	);
};

export { Messages };

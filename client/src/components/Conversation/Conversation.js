import { useParams, useNavigate } from 'react-router-dom';
import './Conversation.css';
import { sendMessage, retrieveSingleConvo } from '../../firebase/messages.js';
import { useEffect, useState, useRef } from 'react';
import { ConvoMessages } from './children/ConvoMessages';
import { ConvoForm } from './children/ConvoForm';
import { Navbar } from '../other/Navbar';
import { findUser } from '../../firebase/users';
import { convoSnapshot } from '../../firebase/messages.js';
import { useAuth } from '../../contexts/AuthContext';

const Conversation = () => {
	const { user } = useAuth();

	const navigate = useNavigate();

	// Grab other user's id from url parameters
	const { otherUserId } = useParams();

	// Init other user state
	const [otherUser, setOtherUser] = useState(null);

	// Init convo title component state
	const [convoTitle, setConvoTitle] = useState(null);

	// Init messages number state
	const [messagesNumber, setMessagesNumber] = useState(20);

	// Init allLoades state
	const [allLoaded, setAllLoaded] = useState(false);

	// Init messages array state
	const [messagesArr, setMessagesArr] = useState(null);

	// Set initial message input value & reset it on submission
	const [messageValue, setMessageValue] = useState('');

	// Use onSnapshot to update messages array real-time
	useEffect(() => {
		convoSnapshot(otherUserId, setMessagesArr, messagesNumber);
	}, []);

	// Update other user & messages array states when user changes
	useEffect(() => {
		if (user != null) {
			findUser(otherUserId).then((otherUser) => {
				setOtherUser(otherUser);
				retrieveSingleConvo(otherUserId, messagesNumber).then(
					(newMessagesArr) => {
						setMessagesArr(newMessagesArr);
					}
				);
			});
		}
	}, [user]);

	// Update messagesArr when messagesNumber changes
	useEffect(() => {
		retrieveSingleConvo(otherUserId, messagesNumber).then(
			(newMessagesArr) => {
				setMessagesArr(newMessagesArr);
				if (newMessagesArr.length < messagesNumber) {
					setAllLoaded(true);
				}
			}
		);
	}, [messagesNumber]);

	// Load more messages when user reaches bottom of messages component
	const loadMore = (e) => {
		const elem = e.target;
		if (elem.scrollTop == 0) {
			const newMessagesNumber = messagesNumber + 20;
			setMessagesNumber(newMessagesNumber);
		}
	};

	// Update convo title component when other user state changes
	useEffect(() => {
		if (otherUser != null) {
			setConvoTitle(
				<div id='convo-title-container'>
					<div id='title'>{otherUser.data.name}</div>
					<div id='subtitle' onClick={redirect}>
						@{otherUser.data.username}
					</div>
				</div>
			);
		}
	}, [otherUser]);

	// Updates message state / field
	const updateMessage = (e) => {
		const val = e.target.value;
		setMessageValue(val);
	};

	// Add new message to specific convo in db
	const sendNewMessage = async (e) => {
		e.preventDefault();
		if (messageValue.length > 0) {
			const message = messageValue;
			setMessageValue('');
			await sendMessage(messageValue, otherUserId);
			const elem = document.getElementById('convo-messages');
			elem.scrollTop = elem.scrollHeight;
		}
	};

	// Redirect back to messages page
	const goBack = () => navigate('/messages');

	// Redirect to other user's page
	const redirect = () => navigate(`/${otherUserId}`);

	return (
		<div id='conversation' className='page'>
			<Navbar />
			<div id='conversation-container'>
				<div id='convo-header'>
					<div id='convo-back-arrow' onClick={goBack}>
						« Go Back
					</div>
					{convoTitle}
					<div id='convo-back-arrow-hidden'>« Go Back</div>
				</div>
				<ConvoMessages
					otherUser={otherUser}
					messagesArr={messagesArr}
					loadMore={loadMore}
				/>
				<ConvoForm
					messageValue={messageValue}
					updateMessage={updateMessage}
					sendNewMessage={sendNewMessage}
				/>
			</div>
		</div>
	);
};

export { Conversation };

import { useParams, useNavigate } from 'react-router-dom';
import './Conversation.css';
import { sendMessage, getSingleConvo } from '../../services/messages.js';
import { useEffect, useState } from 'react';
import { ConvoMessages } from './children/ConvoMessages';
import { Navbar } from '../other/Navbar';
import { findUser } from '../../services/users';

const Conversation = () => {
	const navigate = useNavigate();

	// Grab other user's id from url parameters
	const { otherUserId } = useParams();

	// Init other user state
	const [otherUser, setOtherUser] = useState(null);

	// Init messages number state
	const [messagesNumber, setMessagesNumber] = useState(20);

	// Init convo db record array state
	const [convo, setConvo] = useState(null);

	// Set initial message input value & reset it on submission
	const [messageValue, setMessageValue] = useState('');

	// Use onSnapshot to update messages array real-time
	useEffect(() => {
		if (otherUserId) {
			findUser(otherUserId).then(setOtherUser);
		}
	}, []);

	// Update convo state when otherUser or messagesNumber changes
	useEffect(() => {
		if (otherUser && messagesNumber) {
			getSingleConvo(otherUserId, messagesNumber).then(setConvo);
		}
	}, [otherUser, messagesNumber]);

	// Load more messages when user reaches bottom of messages component
	const loadMore = (e) => {
		const elem = e.target;
		if (elem.scrollTop == 0) {
			const newMessagesNumber = messagesNumber + 20;
			setMessagesNumber(newMessagesNumber);
		}
	};

	// Updates message state / field
	const updateMessage = (e) => {
		const val = e.target.value;
		setMessageValue(val);
	};

	// Add new message to specific convo in db
	const sendNewMessage = async (e) => {
		e.preventDefault();
		if (messageValue.length > 0) {
			setMessageValue('');
			await sendMessage(messageValue, convo.id, otherUser.id);
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
					{otherUser ? (
						<div id='convo-title-container'>
							<div id='title'>{otherUser.data.name}</div>
							<div id='subtitle' onClick={redirect}>
								@{otherUser.data.username}
							</div>
						</div>
					) : null}
					<div id='convo-back-arrow-hidden'>« Go Back</div>
				</div>
				<ConvoMessages
					otherUser={otherUser}
					messagesArr={convo.messages}
					loadMore={loadMore}
				/>
				<form id='convo-message-bar' onSubmit={sendNewMessage}>
					<input
						type='text'
						id='convo-message-bar-input'
						placeholder='Send a message...'
						value={messageValue}
						onChange={updateMessage}
					/>
					<button
						type={messageValue.length > 0 ? 'active' : 'inactive'}
						id='convo-message-button'
						className={
							messageValue.length > 0 ? 'submit' : 'button'
						}
					>
						Send
					</button>
				</form>
			</div>
		</div>
	);
};

export { Conversation };

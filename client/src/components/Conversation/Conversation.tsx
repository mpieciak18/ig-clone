import { useParams, useNavigate } from 'react-router-dom';
import './Conversation.css';
import { getSingleConvo, createConvo } from '../../services/messages.js';
import { useEffect, useState } from 'react';
import { ConvoMessages } from './children/ConvoMessages.js';
import { Navbar } from '../other/Navbar.js';
import { findUser } from '../../services/users.js';
import io from 'socket.io-client';
import { getToken } from '../../services/localstor.js';

const Conversation = () => {
	const navigate = useNavigate();

	// Socket state
	const [socket, setSocket] = useState();

	// Grab other user's id from url parameters
	const otherUserId = Number(useParams().otherUserId);

	// Init other user state
	const [otherUser, setOtherUser] = useState(null);

	// Init messages number state
	const [messagesNumber, setMessagesNumber] = useState(10);

	// Init diffMessNumber state
	const [diffMessNumber, setDiffMessNumber] = useState(0);

	// Init convo db record array state
	const [convo, setConvo] = useState(null);

	// Set initial message input value & reset it on submission
	const [messageValue, setMessageValue] = useState('');

	const initSocket = async () => {
		return new Promise((resolve, reject) => {
			const socket = io(import.meta.env.VITE_API_URL, {
				auth: {
					token: getToken(),
				},
			});
			socket.on('connect', () => {
				resolve(socket);
			});

			socket.on('connect_error', (error) => {
				reject(error);
			});
		});
	};

	// Update otherUser state upon init render
	useEffect(() => {
		initSocket().then((newSocket) => {
			setSocket(newSocket);
			if (otherUserId && !otherUser) {
				findUser(otherUserId).then(setOtherUser);
			}
		});
	}, []);

	// Update convo state when otherUser or messagesNumber changes
	useEffect(() => {
		// If this useEffect fires off to retrieve a new convo + messages data,
		// but there have been new messages sent since this component rendered,
		// as tracked by diffMessNumber, then we must clear out diffMessNumber
		// and add its prev value to messagesNumber, which will retrigger this useEffect.
		// This will ensure we grab the correct number of messages.
		if (diffMessNumber > 0) {
			const newNum = messagesNumber + diffMessNumber;
			setDiffMessNumber(0);
			setMessagesNumber(newNum);
		} else if (otherUser && messagesNumber) {
			getSingleConvo(otherUserId, messagesNumber).then(setConvo);
		}
	}, [otherUser, messagesNumber]);

	// Init websocket & establish connection to it once we have a convo id
	useEffect(() => {
		if (convo?.id && socket) {
			// Establish WebSocket connection
			socket.emit('joinConversation', { conversationId: convo.id });
			socket.on('receiveNewMessage', (newMessage) => {
				setConvo((convo) => ({
					...convo,
					messages: [newMessage, ...convo.messages],
				}));
			});
			// Disconnect from WebSocket on unmount
			return () => {
				socket.disconnect();
				socket.off('sendNewMessage');
				socket.off('receiveNewMessage');
				setSocket();
			};
		}
	}, [convo?.id, socket]);

	// Update scroll height when convo.messages changes (only on new message, ie diffMessNumber > 0)
	useEffect(() => {
		if (diffMessNumber > 0) {
			const elem = document.getElementById('convo-messages');
			elem.scrollTop = elem.scrollHeight;
		}
	}, [convo?.messages]);

	// Load more messages when user reaches bottom of messages component
	const loadMore = (e) => {
		const elem = e.target;
		if (elem.scrollTop == 0) {
			const newMessagesNumber = messagesNumber + diffMessNumber + 10;
			setDiffMessNumber(0);
			setMessagesNumber(newMessagesNumber);
		}
	};

	// Updates message state / field
	const updateMessage = (e) => {
		const val = e.target.value;
		setMessageValue(val);
	};

	// Add new message to specific convo in db
	const sendMessage = async (e) => {
		e.preventDefault();
		if (messageValue.length > 0) {
			setMessageValue('');
			let id = convo?.id;
			if (!id) {
				const newConvo = await createConvo(otherUserId);
				setConvo(newConvo);
				id = newConvo.id;
			}
			socket.emit('sendNewMessage', {
				id,
				message: messageValue,
			});
			setDiffMessNumber(diffMessNumber + 1);
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
							<div id='title'>{otherUser.name}</div>
							<div id='subtitle' onClick={redirect}>
								@{otherUser.username}
							</div>
						</div>
					) : null}
					<div id='convo-back-arrow-hidden'>« Go Back</div>
				</div>
				{convo ? (
					<ConvoMessages
						otherUser={otherUser}
						messagesArr={convo.messages}
						loadMore={loadMore}
					/>
				) : null}
				<form id='convo-message-bar' onSubmit={sendMessage}>
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

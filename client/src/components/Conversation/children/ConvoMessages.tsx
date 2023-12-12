import { useState, useEffect, useRef } from 'react';
import { timeSince } from '../../../other/timeSince.js';
import { useAuth } from '../../../contexts/AuthContext.js';

const ConvoMessages = (props) => {
	const { user } = useAuth();

	const { otherUser, messagesArr, loadMore } = props;

	const [otherUserImg, setOtherUserImg] = useState(null);

	const [otherUserName, setOtherUserName] = useState(null);

	const [isInit, setIsInit] = useState(false);

	const ref = useRef();

	// Update image source on render
	useEffect(() => {
		if (otherUser != null) {
			setOtherUserImg(otherUser.image);
			setOtherUserName(otherUser.name);
		}
	}, [otherUser]);

	// Scroll down when messages changes
	useEffect(() => {
		if (isInit == false && messagesArr) {
			const elem = document.getElementById('convo-messages');
			elem.scrollTop = elem.scrollHeight;
			setIsInit(true);
		}
	}, [messagesArr]);

	// Update messages state when messagesArr changes
	const generateMessages = () => {
		return messagesArr.toReversed().map((message, i) => {
			let sender;
			if (user.id == message.senderId) {
				sender = 'self';
			} else {
				sender = 'other';
			}

			let icon;
			let name = null;
			let senderChange = false;

			if (i == 0) {
				senderChange = true;
			} else if (messagesArr[i - 1].senderId != message.senderId) {
				senderChange = true;
			}

			if (senderChange) {
				if (sender == 'self') {
					icon = <div className='message-block-icon' />;
					name = (
						<div className='message-name'>
							You, {timeSince(message.createdAt)}:
						</div>
					);
				} else {
					icon = (
						<img
							className='message-block-icon'
							src={otherUserImg}
						/>
					);
					name = (
						<div className='message-name'>
							{otherUserName}, {timeSince(message.createdAt)}:
						</div>
					);
				}
			}

			return (
				<div
					className={`message-block-container ${sender}`}
					key={message.id}
				>
					{name}
					<div className='message-block'>
						<div className='message-block-icon-container'>
							{icon}
						</div>
						<div className='message-block-bubble'>
							<div className='message-block-message'>
								{message.message}
							</div>
						</div>
					</div>
				</div>
			);
		});
	};

	return (
		<div id='convo-messages' onScroll={loadMore} ref={ref}>
			{messagesArr?.length > 0 ? generateMessages() : null}
		</div>
	);
};

export { ConvoMessages };

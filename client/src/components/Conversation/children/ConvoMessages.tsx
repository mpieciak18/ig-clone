import { useState, useEffect, useRef } from 'react';
import { timeSince } from '../../../other/timeSince.js';
import { useAuth } from '../../../contexts/AuthContext.js';
import { Message, User, UserStatsCount } from 'shared';

const ConvoMessages = (props: {
	otherUser: User & UserStatsCount;
	messages: Message[];
	loadMore: (e: React.UIEvent<HTMLDivElement>) => void;
}) => {
	const { user } = useAuth();

	const { otherUser, messages, loadMore } = props;

	const [isInit, setIsInit] = useState(false);

	const ref = useRef<HTMLDivElement>(null);

	// Scroll down when messages changes
	useEffect(() => {
		if (isInit == false && messages) {
			const elem = document.getElementById('convo-messages');
			if (elem !== null) {
				elem.scrollTop = elem.scrollHeight;
				setIsInit(true);
			}
		}
	}, [messages]);

	// Update messages state when messages changes
	const generateMessages = () => {
		return messages.toReversed().map((message, i) => {
			let sender;
			if (user?.id == message.senderId) {
				sender = 'self';
			} else {
				sender = 'other';
			}

			let icon;
			let name = null;
			let senderChange = false;

			if (i == 0) {
				senderChange = true;
			} else if (messages[i - 1].senderId != message.senderId) {
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
							src={otherUser.image ? otherUser.image : undefined}
						/>
					);
					name = (
						<div className='message-name'>
							{otherUser.username}, {timeSince(message.createdAt)}
							:
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
			{messages?.length > 0 ? generateMessages() : null}
		</div>
	);
};

export { ConvoMessages };

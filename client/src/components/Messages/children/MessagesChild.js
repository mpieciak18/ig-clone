import { useEffect, useState } from 'react';
import { timeSinceTrunc } from '../../../other/timeSinceTrunc';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export const MessagesChild = (props) => {
	const { convo } = props;
	const { user } = useAuth();
	const [otherUser, setOtherUser] = useState();

	// Update otherUser when convo changes
	useEffect(() => {
		if (convo?.users?.length == 2) {
			for (const convoUser of convo.users) {
				if (user.id == convoUser.id) {
					continue;
				} else {
					setOtherUser(convoUser);
				}
			}
		}
	}, [convo]);

	return otherUser ? (
		<Link
			className='convo-row'
			key={convo.id}
			to={`/messages/${otherUser.id}`}
		>
			<div className='convo-row-left'>
				<img className='convo-image' src={otherUser.image} />
				<div className='convo-text'>
					<div className='convo-name'>{otherUser.name}</div>
					<div className='convo-username'>@{otherUser.username}</div>
				</div>
			</div>
			<div className='convo-row-right'>
				<div className='convo-row-message'>
					{`${message.senderId == user.id ? 'You' : 'Them'}: "${
						convo.messages[0].message
					}"`}
				</div>
				<div className='convo-row-time'>
					{timeSinceTrunc(convo.messages[0].createdAt)}
				</div>
			</div>
		</Link>
	) : null;
};

import { useEffect, useState } from 'react';
import { timeSinceTrunc } from '../../../other/timeSinceTrunc';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { findUser } from '../../../services/users';

export const MessagesChild = (props) => {
	const { convo } = props;
	const { user } = useAuth();
	const [otherUser, setOtherUser] = useState();
	const [image, setImage] = useState();

	// Update otherUser when convo changes
	useEffect(() => {
		if (convo) {
			findUser(convo.id).then(setOtherUser);
		}
	}, [convo]);

	// Update image when otherUser changes
	useEffect(() => {
		if (otherUser) {
			setImage(otherUser.image);
		}
	}, [otherUser]);

	const name = otherUser?.name;
	const username = otherUser?.username;
	const message = convo.messages[0];
	const time = timeSinceTrunc(message.createdAt);
	let sender;
	if (message.senderId == user.id) {
		sender = 'You';
	} else {
		sender = 'Them';
	}

	return (
		<Link className='convo-row' key={convo.id} to={`/messages/${convo.id}`}>
			<div className='convo-row-left'>
				<img className='convo-image' src={image} />
				<div className='convo-text'>
					<div className='convo-name'>{name}</div>
					<div className='convo-username'>@{username}</div>
				</div>
			</div>
			<div className='convo-row-right'>
				<div className='convo-row-message'>
					{`${sender}: "${message.message}"`}
				</div>
				<div className='convo-row-time'>{time}</div>
			</div>
		</Link>
	);
};

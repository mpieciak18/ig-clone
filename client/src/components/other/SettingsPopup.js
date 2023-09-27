import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOutUser } from '../../firebase/users.js';
import { useAuth } from '../../contexts/AuthContext.js';

const SettingsPopup = (props) => {
	const { user } = useAuth();
	const { viewSettings, setViewSettings } = props;

	const navigate = useNavigate();

	// Init popup component state
	const [popup, setPopup] = useState(null);

	// Event handler that updates viewSettings
	const closeSettings = () => {
		const func = (e) => {
			if (e.target.id != 'settings-popup') {
				setViewSettings(false);
				document
					.querySelector('body')
					.removeEventListener('click', eHandler);
			}
		};
		return func;
	};

	// Store closeSettings in a variable
	const eHandler = closeSettings();

	// Logout user
	const logout = async () => {
		await signOutUser();
		navigate('/');
	};

	// Update popup when viewSettings changes
	useEffect(() => {
		if (viewSettings == true) {
			document.querySelector('body').addEventListener('click', eHandler);
			setPopup(
				<div id='settings-popup'>
					<div
						id='settings-profile'
						className='settings-popup-button'
						onClick={() => navigate(`/${user.id}`)}
					>
						View Profile
					</div>
					<div
						id='settings-settings'
						className='settings-popup-button'
						onClick={() => navigate('/settings')}
					>
						Change Settings
					</div>
					<div
						id='settings-posts'
						className='settings-popup-button'
						onClick={() => navigate('/saved')}
					>
						View Saved Posts
					</div>
					<div
						id='settings-logout'
						className='settings-popup-button'
						onClick={logout}
					>
						Sign Out
					</div>
				</div>
			);
		} else {
			setPopup(null);
		}
	}, [viewSettings]);

	return popup;
};

export { SettingsPopup };

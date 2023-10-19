import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import { usePopUp } from '../../contexts/PopUpContext.js';

const SettingsPopup = () => {
	const { user, setUser } = useAuth();
	const { updatePopUp } = usePopUp();
	const navigate = useNavigate();

	// Logout user
	const logout = async () => {
		await setUser(null);
		localStorage.removeItem('markstagramUser');
		navigate('/');
	};

	return (
		<div id='settings-popup' onClick={updatePopUp}>
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
};

export { SettingsPopup };

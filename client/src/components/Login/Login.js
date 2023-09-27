import './Login.css';
import { Navbar } from '../other/Navbar.js';
import { signInUser } from '../../firebase/users.js';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
	const { user } = useAuth();

	const navigate = useNavigate();

	const [email, setEmail] = useState('');

	const updateEmail = (e) => setEmail(e.target.value);

	const [password, setPassword] = useState('');

	const updatePassword = (e) => setPassword(e.target.value);

	const [errorClass, setErrorClass] = useState('inactive');

	const [loginParent, setLoginParent] = useState(null);

	const newLogin = async (e) => {
		e.preventDefault();
		// Add new user to firebase/auth & return any errors
		const newUserId = await signInUser(email, password);
		if (newUserId == null) {
			setErrorClass('active');
			setTimeout(() => {
				setErrorClass('inactive');
			}, 3000);
		} else {
			navigate('/');
		}
	};

	useEffect(() => {
		if (user == null) {
			setLoginParent(
				<div id='login-parent'>
					<div id='login-error' className={errorClass}>
						There was an error! Please try again.
					</div>
					<form id='login-form' onSubmit={newLogin}>
						<div id='login-header'>
							<img id='login-logo' />
							<div id='login-title'>Login</div>
						</div>
						<div id='login-email-input-parent'>
							<input
								id='login-email-input'
								placeholder='email'
								value={email}
								onChange={updateEmail}
							/>
						</div>
						<div id='login-password-input-parent'>
							<input
								id='login-password-input'
								type='password'
								placeholder='password'
								value={password}
								onChange={updatePassword}
							/>
						</div>
						<button
							type='submit'
							id='login-button-submit'
							className='active'
						>
							Login
						</button>
					</form>
				</div>
			);
		}
	}, [errorClass, user, email, password]);

	return (
		<div id='login' className='page'>
			<Navbar />
			{loginParent}
		</div>
	);
};

export { Login };

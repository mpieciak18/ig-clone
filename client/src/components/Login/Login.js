import './Login.css';
import { Navbar } from '../other/Navbar.js';
import { signInUser } from '../../services/users.js';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
	const { user, setUser } = useAuth();

	const navigate = useNavigate();

	const [email, setEmail] = useState('');

	const updateEmail = (e) => setEmail(e.target.value);

	const [password, setPassword] = useState('');

	const updatePassword = (e) => setPassword(e.target.value);

	const [errorClass, setErrorClass] = useState('inactive');

	const newLogin = async (e) => {
		e.preventDefault();
		try {
			const signedInUser = await signInUser(email, password);
			await setUser(signedInUser);
			localStorage.setItem('markstagramUser', signedInUser);
			navigate('/');
		} catch (error) {
			setErrorClass('active');
			setTimeout(() => {
				setErrorClass('inactive');
			}, 3000);
		}
	};

	return (
		<div id='login' className='page'>
			<Navbar />
			{!user ? (
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
			) : null}
		</div>
	);
};

export { Login };

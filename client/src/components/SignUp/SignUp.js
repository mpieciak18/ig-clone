import './SignUp.css';
import { Navbar } from '../other/Navbar.js';
import { UsernameFooter } from './children/UsernameFooter.js';
import { PasswordFooter } from './children/PasswordFooter.js';
import { NameFooter } from './children/NameFooter.js';
import { EmailFooter } from './children/EmailFooter.js';
import { newUser, findUser } from '../../firebase/users.js';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const SignUp = (props) => {
	// Redirect to settings if already signed in
	const { setUser } = useAuth();
	const { popUpState, updatePopUp } = props;

	const navigate = useNavigate();

	// Init criteria for form validation
	const [username, setUsername] = useState('');
	const [usernamePasses, setUsernamePasses] = useState(false);
	const updateUsername = (e) => setUsername(e.target.value);

	const [name, setName] = useState('');
	const [namePasses, setNamePasses] = useState(false);
	const updateName = (e) => setName(e.target.value);

	const [email, setEmail] = useState('');
	const [emailPasses, setEmailPasses] = useState(false);
	const updateEmail = (e) => setEmail(e.target.value);

	const [password, setPassword] = useState('');
	const [passwordPasses, setPasswordPasses] = useState(false);
	const updatePassword = (e) => setPassword(e.target.value);

	const [allPass, setAllPass] = useState(false);

	const [signUpButtonType, setSignUpButtonType] = useState('button');

	const [signUpButtonClass, setSignUpButtonClass] = useState('inactive');

	const [errorClass, setErrorClass] = useState('inactive');

	// Update allPass when any of the input pass states change
	useEffect(() => {
		setAllPass(
			usernamePasses && namePasses && passwordPasses && emailPasses
		);
	}, [usernamePasses, namePasses, passwordPasses, emailPasses]);

	// Update sign-up button type & class when allPass changes
	useEffect(() => {
		if (allPass == true) {
			setSignUpButtonType('submit');
			setSignUpButtonClass('active');
		} else {
			setSignUpButtonType('button');
			setSignUpButtonClass('inactive');
		}
	}, [allPass]);

	const newSignUp = async (e) => {
		e.preventDefault();
		// Add new user to firebase/auth & return any errors
		const newUserId = await newUser(username, name, email, password);
		if (newUserId != null) {
			const newUser = await findUser(newUserId);
			await setUser(newUser);
			navigate('/settings', { state: { newSignUp: true } });
		} else {
			setErrorClass('active');
			setTimeout(() => {
				setErrorClass('inactive');
			}, 3000);
		}
	};

	return (
		<div id='sign-up' className='page'>
			<Navbar popUpState={popUpState} updatePopUp={updatePopUp} />
			<div id='sign-up-parent'>
				<div id='sign-up-error' className={errorClass}>
					There was an error! Please try again.
				</div>
				<form id='sign-up-form' onSubmit={newSignUp}>
					<div id='sign-up-header'>
						<img id='sign-up-logo' />
						<div id='sign-up-title'>Sign Up</div>
					</div>
					<div id='sign-up-username-section'>
						<div id='sign-up-username-input-parent'>
							<div id='sign-up-username-symbol'>@</div>
							<input
								id='sign-up-username-input'
								value={username}
								placeholder='username'
								onChange={updateUsername}
							/>
							<div id='sign-up-username-symbol-hidden'>@</div>
						</div>
						<UsernameFooter
							setUsernamePasses={setUsernamePasses}
							username={username}
						/>
					</div>
					<div id='sign-up-name-section'>
						<input
							id='sign-up-name-input'
							value={name}
							placeholder='your real name'
							onChange={updateName}
						/>
						<NameFooter setNamePasses={setNamePasses} name={name} />
					</div>
					<div id='sign-up-email-section'>
						<input
							id='sign-up-email-input'
							value={email}
							placeholder='email'
							onChange={updateEmail}
						/>
						<EmailFooter
							setEmailPasses={setEmailPasses}
							email={email}
						/>
					</div>
					<div id='sign-up-password-section'>
						<input
							id='sign-up-password-input'
							value={password}
							placeholder='password'
							type='password'
							onChange={updatePassword}
						/>
						<PasswordFooter
							setPasswordPasses={setPasswordPasses}
							password={password}
						/>
					</div>
					<button
						type={signUpButtonType}
						id='sign-up-button-submit'
						className={signUpButtonClass}
					>
						Sign Up
					</button>
					<div id='sign-up-login-section'>
						<div id='sign-up-login-message'>Already Signed Up?</div>
						<button
							id='sign-up-button-login'
							onClick={() => navigate('/login')}
						>
							Login
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export { SignUp };

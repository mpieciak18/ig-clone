import './Settings.css';
import { updateUser } from '../../firebase/users.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { NameFooter } from './children/NameFooter.js';
import { ImageInput } from './children/ImageInput.js';
import { uploadFile } from '../../firebase/storage';
import { Navbar } from '../other/Navbar.js';
import { findUser } from '../../firebase/users.js';
import { useAuth } from '../../contexts/AuthContext';

const Settings = () => {
	const { user, setUser } = useAuth();

	const location = useLocation();

	// Track initial mounting status
	const isInitMount = useRef(true);

	// Store pathname to variable
	const path = location.pathname;

	// Store (potential) state from previous page to variable
	const [prevState, setPrevState] = useState(null);

	// Init useNavigate function
	const navigate = useNavigate();

	// Redirect to signup page (if not signed in)
	const redirectToSignUp = () =>
		navigate('/signup', { state: { path: path } });

	// Redirect to own profile page
	const redirectToProfile = () => navigate(`/${user.id}`);

	// Init user loaded state
	const [userLoaded, setUserLoaded] = useState(null);

	// Init settings component state
	const [settings, setSettings] = useState(null);

	// Init file state
	const [file, setFile] = useState(null);

	// Init ref for ImageInput component
	const inputRef = useRef();

	// Init error message class state
	const [errorClass, setErrorClass] = useState('inactive');

	// Init new user registration message class state
	const [welcomeClass, setWelcomeClass] = useState('inactive');

	// Init name field value form validation state
	const [namePasses, setNamePasses] = useState(true);

	// Init name field value state
	const [name, setName] = useState(null);

	// Init bio field value state
	const [bio, setBio] = useState(null);

	// OnChange event handler for for name field on form
	const updateName = (e) => {
		setName(e.target.value);
	};

	// OnChange event handler for for bio field on form
	const updateBio = (e) => setBio(e.target.value);

	// Init form button type state
	const [button, setButton] = useState('submit');

	// Init form buttonc class state
	const [buttonClass, setButtonClass] = useState('active');

	// Updates user's settings with form values
	const updateSettings = async (e) => {
		e.preventDefault();
		// Check validation first
		if (namePasses == true) {
			let path;
			if (file == null) {
				path = user.data.image;
			} else {
				const image = file.name;
				path = `${user.id}/${image}`;
				await uploadFile(file, path);
			}
			const possibleError = await updateUser(path, name, bio);
			if (possibleError == null) {
				// Redirect to own profile upon successful settings update
				const updatedUser = await findUser(user.id);
				await setUser(updatedUser);
				navigate(`/${user.id}`);
			} else {
				setErrorClass('active');
				setTimeout(() => {
					setErrorClass('inactive');
				}, 2000);
			}
		}
	};

	// Wait 2 seconds & update userLoaded, name, & bio states upon render & user prop change
	useEffect(() => {
		setTimeout(async () => {
			if (user != null) {
				await setName(user.data.name);
				await setBio(user.data.bio);
				setUserLoaded(true);
			} else {
				setUserLoaded(false);
			}
		}, 2000);
	}, [user]);

	// Update prev state upon render
	useEffect(() => {
		setPrevState(location.state);
	}, []);

	// Update welcomeClass state when prev state change
	useEffect(() => {
		if (prevState != null) {
			setWelcomeClass('active');
			setTimeout(() => {
				setWelcomeClass('inactive');
			}, 3500);
		}
	}, [prevState]);

	// Update settings component state (or trigger redirect) upon render & when user prop changes
	useEffect(() => {
		if (isInitMount.current) {
			isInitMount.current = false;
		} else {
			if (userLoaded == true) {
				setSettings(
					<div id='settings-parent'>
						<div id='settings-welcome' className={welcomeClass}>
							<p>You've successfully registered!</p>
							<p>Please update your bio and image.</p>
						</div>
						<form id='settings-form' onSubmit={updateSettings}>
							<div id='settings-error' className={errorClass}>
								<p>There was an error!</p>
								<p>Please try again.</p>
							</div>
							<div id='settings-header'>
								<div id='settings-title'>Settings</div>
							</div>
							<div id='settings-image-section'>
								<label
									id='settings-image-footer'
									htmlFor='image'
								>
									File size limit: 5 mb
								</label>
								<ImageInput
									setFile={setFile}
									setErrorClass={setErrorClass}
									inputRef={inputRef}
									name='image'
								/>
							</div>
							<div id='settings-name-section'>
								<label id='settings-name-label' htmlFor='name'>
									Your Name:
								</label>
								<input
									id='settings-name-input'
									name='name'
									type='text'
									value={name}
									onChange={updateName}
								></input>
								<NameFooter
									setNamePasses={setNamePasses}
									name={name}
								/>
							</div>
							<div id='settings-bio-section'>
								<label id='settings-bio-label' htmlFor='bio'>
									Your Bio:
								</label>
								<textarea
									id='settings-bio-input'
									name='bio'
									type='text'
									value={bio}
									maxLength='150'
									onChange={updateBio}
								/>
							</div>
							<div id='settings-buttons-section'>
								<button
									id='settings-button-submit'
									type={button}
									className={buttonClass}
								>
									Update Settings
								</button>
								<button
									id='settings-button-back'
									type='button'
									onClick={redirectToProfile}
								>
									Back to Profile
								</button>
							</div>
						</form>
					</div>
				);
			} else {
				if (user == null) {
					redirectToSignUp();
				} else {
					setName(user.data.name);
					setBio(user.data.bio);
					setUserLoaded(true);
				}
			}
		}
	}, [userLoaded, bio, name, button, buttonClass, file, welcomeClass]);

	useEffect(() => {
		if (namePasses == true) {
			setButton('submit');
			setButtonClass('active');
		} else {
			setButton('button');
			setButtonClass('inactive');
		}
	}, [namePasses]);

	return (
		<div id='settings' className='page'>
			<Navbar />
			{settings}
		</div>
	);
};

export { Settings };

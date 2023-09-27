import { Routes, Route, HashRouter } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Home } from './components/Home/Home.js';
import { Messages } from './components/Messages/Messages.js';
import { Post } from './components/Post/Post.js';
import { Profile } from './components/Profile/Profile.js';
import { Settings } from './components/Settings/Settings.js';
import { Saved } from './components/SavedPosts/Saved.js';
import { SignUp } from './components/SignUp/SignUp.js';
import { Login } from './components/Login/Login.js';
import { Conversation } from './components/Conversation/Conversation.js';
import { auth, firebaseObserver } from './firebase/firebase.js';
import { findUser } from './firebase/users.js';
import { useAuth } from './contexts/AuthContext.js';

const App = () => {
	// Init user context
	const { user, setUser } = useAuth();

	// Init loading state
	const [isLoading, setIsLoading] = useState(true);

	// Update logged-in and loading states on mount
	useEffect(() => {
		firebaseObserver.subscribe('authStateChanged', (result) => {
			if (auth?.currentUser?.uid) {
				findUser(auth.currentUser.uid).then((newUser) => {
					setUser(newUser);
					setIsLoading(false);
				});
			} else {
				setUser(null);
				setIsLoading(false);
			}
		});
		return () => {
			firebaseObserver.unsubscribe('authStateChanged');
		};
	}, []);

	// Initialize pop-ups state
	const [popUpState, setPopUpState] = useState({
		newPostOn: false,
		followsOn: false,
		notifsOn: false,
		likesOn: false,
		searchOn: false,
		convosOn: false,
	});

	// Updates pop-ups state. If a popUpState property is passed, then said property is set to true
	const updatePopUp = (popUp = null) => {
		const newState = { ...popUpState };
		for (const [key, val] of Object.entries(popUpState)) {
			if (key == popUp) {
				newState[key] = true;
			} else {
				newState[key] = false;
			}
		}
		setPopUpState(newState);
	};

	// return routes;
	return isLoading == false && !user ? (
		<HashRouter>
			<Routes>
				<Route
					exact
					path='/'
					element={
						<Home
							user={user}
							setUser={setUser}
							popUpState={popUpState}
							updatePopUp={updatePopUp}
						/>
					}
				/>
				<Route
					exact
					path='/messages'
					element={
						<Messages
							user={user}
							setUser={setUser}
							popUpState={popUpState}
							updatePopUp={updatePopUp}
						/>
					}
				/>
				<Route
					exact
					path='/:postOwnerId/:postId'
					element={
						<Post
							user={user}
							setUser={setUser}
							popUpState={popUpState}
							updatePopUp={updatePopUp}
						/>
					}
				/>
				<Route
					exact
					path='/:otherUserId'
					element={
						<Profile
							user={user}
							setUser={setUser}
							popUpState={popUpState}
							updatePopUp={updatePopUp}
						/>
					}
				/>
				<Route
					exact
					path='/messages/:otherUserId'
					element={
						<Conversation
							user={user}
							setUser={setUser}
							popUpState={popUpState}
							updatePopUp={updatePopUp}
						/>
					}
				/>
				<Route
					exact
					path='/saved'
					element={
						<Saved
							user={user}
							setUser={setUser}
							popUpState={popUpState}
							updatePopUp={updatePopUp}
						/>
					}
				/>
				<Route
					exact
					path='/settings'
					element={
						<Settings
							user={user}
							setUser={setUser}
							popUpState={popUpState}
							updatePopUp={updatePopUp}
						/>
					}
				/>
				<Route
					exact
					path='/signup'
					element={
						<SignUp
							user={user}
							setUser={setUser}
							popUpState={popUpState}
							updatePopUp={updatePopUp}
						/>
					}
				/>
				<Route
					exact
					path={'/login'}
					element={
						<Login
							user={user}
							setUser={setUser}
							popUpState={popUpState}
							updatePopUp={updatePopUp}
						/>
					}
				/>
			</Routes>
		</HashRouter>
	) : isLoading == false && user ? (
		<HashRouter>
			<Routes>
				<Route
					exact
					path='/'
					element={
						<Home
							user={user}
							setUser={setUser}
							popUpState={popUpState}
							updatePopUp={updatePopUp}
						/>
					}
				/>
				<Route
					exact
					path='/messages'
					element={
						<Login
							user={user}
							setUser={setUser}
							popUpState={popUpState}
							updatePopUp={updatePopUp}
						/>
					}
				/>
				<Route
					exact
					path='/:postOwnerId/:postId'
					element={
						<Post
							user={user}
							setUser={setUser}
							popUpState={popUpState}
							updatePopUp={updatePopUp}
						/>
					}
				/>
				<Route
					exact
					path='/:otherUserId'
					element={
						<Profile
							user={user}
							setUser={setUser}
							popUpState={popUpState}
							updatePopUp={updatePopUp}
						/>
					}
				/>
				<Route
					exact
					path='/messages/:otherUserId'
					element={
						<Login
							user={user}
							setUser={setUser}
							popUpState={popUpState}
							updatePopUp={updatePopUp}
						/>
					}
				/>
				<Route
					exact
					path='/saved'
					element={
						<Login
							user={user}
							setUser={setUser}
							popUpState={popUpState}
							updatePopUp={updatePopUp}
						/>
					}
				/>
				<Route
					exact
					path='/settings'
					element={
						<Login
							user={user}
							setUser={setUser}
							popUpState={popUpState}
							updatePopUp={updatePopUp}
						/>
					}
				/>
				<Route
					exact
					path='/signup'
					element={
						<SignUp
							user={user}
							setUser={setUser}
							popUpState={popUpState}
							updatePopUp={updatePopUp}
						/>
					}
				/>
				<Route
					exact
					path='/login'
					element={
						<Login
							user={user}
							setUser={setUser}
							popUpState={popUpState}
							updatePopUp={updatePopUp}
						/>
					}
				/>
			</Routes>
		</HashRouter>
	) : null;
};

export { App };

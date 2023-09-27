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

	// return routes;
	return isLoading == false ? (
		<HashRouter>
			<Routes>
				<Route exact path='/' element={<Home />} />
				<Route
					exact
					path='/messages'
					element={user ? <Messages /> : <Login />}
				/>
				<Route exact path='/:postOwnerId/:postId' element={<Post />} />
				<Route exact path='/:otherUserId' element={<Profile />} />
				<Route
					exact
					path='/messages/:otherUserId'
					element={user ? <Conversation /> : <Login />}
				/>
				<Route
					exact
					path='/saved'
					element={user ? <Saved /> : <Login />}
				/>
				<Route
					exact
					path='/settings'
					element={user ? <Settings /> : <Login />}
				/>
				<Route
					exact
					path='/signup'
					element={user ? <Settings /> : <SignUp />}
				/>
				<Route
					exact
					path='/login'
					element={user ? <Settings /> : <Login />}
				/>
			</Routes>
		</HashRouter>
	) : null;
};

export { App };

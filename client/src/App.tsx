import { Routes, Route, HashRouter, Navigate } from 'react-router-dom';
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
import { useAuth } from './contexts/AuthContext.js';
import { getLocalUser } from './services/localstor.js';
import { HomeLoggedOut } from './components/Home/HomeLoggedOut.js';

const App = () => {
	// Init user context
	const { user, setUser } = useAuth();

	// Init loading state
	const [isLoading, setIsLoading] = useState(true);

	// Update user (with anything stored locally) and loading states on mount
	useEffect(() => {
		const localUser = getLocalUser();
		if (localUser && !user && setUser) {
			setUser(localUser);
			setIsLoading(false);
		} else {
			setIsLoading(false);
		}
	}, []);

	// return routes;
	return isLoading == false && user ? (
		<HashRouter>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/messages' element={<Messages />} />
				<Route path='/:postOwnerId/:postId' element={<Post />} />
				<Route path='/:otherUserId' element={<Profile />} />
				<Route
					path='/messages/:otherUserId'
					element={<Conversation />}
				/>
				<Route path='/saved' element={<Saved />} />
				<Route path='/settings' element={<Settings />} />
				<Route path='/signup' element={<Navigate to='/' replace />} />
				<Route path='/login' element={<Navigate to='/' replace />} />
			</Routes>
		</HashRouter>
	) : isLoading == false && !user ? (
		<HashRouter>
			<Routes>
				<Route path='/signup' element={<SignUp />} />
				<Route path='/login' element={<Login />} />
				<Route path='*' element={<HomeLoggedOut />} />
			</Routes>
		</HashRouter>
	) : null;
};

export { App };

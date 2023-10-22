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
import { useAuth } from './contexts/AuthContext.js';
import { getLocalUser } from './services/localstor.js';

const App = () => {
	// Init user context
	const { user, setUser } = useAuth();

	// Init loading state
	const [isLoading, setIsLoading] = useState(true);

	// Update user and loading states on mount
	useEffect(() => {
		if (user) {
			const localUser = getLocalUser();
			if (localUser) {
				setUser(localUser).then(() => {
					setIsLoading(false);
				});
			} else {
				setUser(null).then(() => {
					setIsLoading(false);
				});
			}
		} else {
			setUser(null).then(() => {
				setIsLoading(false);
			});
		}
	}, []);

	// return routes;
	return isLoading == false && user ? (
		<HashRouter>
			<Routes>
				<Route exact path='/' element={<Home />} />
				<Route exact path='/messages' element={<Messages />} />
				<Route exact path='/:postOwnerId/:postId' element={<Post />} />
				<Route exact path='/:otherUserId' element={<Profile />} />
				<Route
					exact
					path='/messages/:otherUserId'
					element={<Conversation />}
				/>
				<Route exact path='/saved' element={<Saved />} />
				<Route exact path='/settings' element={<Settings />} />
				<Route exact path='/signup' element={<SignUp />} />
				<Route exact path='/login' element={<Login />} />
			</Routes>
		</HashRouter>
	) : isLoading == false && !user ? (
		<HashRouter>
			<Routes>
				<Route exact path='/' element={<Home />} />
				<Route exact path='/messages' element={<Login />} />
				<Route exact path='/:postOwnerId/:postId' element={<Post />} />
				<Route exact path='/:otherUserId' element={<Profile />} />
				<Route
					exact
					path='/messages/:otherUserId'
					element={<Login />}
				/>
				<Route exact path='/saved' element={<Login />} />
				<Route exact path='/settings' element={<Login />} />
				<Route exact path='/signup' element={<SignUp />} />
				<Route exact path='/login' element={<Login />} />
			</Routes>
		</HashRouter>
	) : null;
};

export { App };

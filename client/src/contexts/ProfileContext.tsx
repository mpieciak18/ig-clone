import { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
	const [otherUser, setOtherUser] = useState(null);

	return (
		<ProfileContext.Provider value={{ otherUser, setOtherUser }}>
			{children}
		</ProfileContext.Provider>
	);
};

export const useProfile = () => {
	return useContext(ProfileContext);
};

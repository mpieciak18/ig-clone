import { PropsWithChildren, createContext, useContext, useState } from 'react';
import { User } from 'shared';

const ProfileContext = createContext<User | null | undefined>(undefined);

export const ProfileProvider = ({ children }: PropsWithChildren) => {
	const [otherUser, setOtherUser] = useState<User | null>(null);

	return (
		<ProfileContext.Provider value={{ otherUser, setOtherUser }}>
			{children}
		</ProfileContext.Provider>
	);
};

export const useProfile = () => {
	return useContext(ProfileContext);
};

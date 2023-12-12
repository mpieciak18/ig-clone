import { createContext, useContext, useState } from 'react';
import { User } from 'shared';

const AuthContext = createContext<User | undefined>(undefined);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	return (
		<AuthContext.Provider value={{ user, setUser }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};

import { createContext, useContext, useState, PropsWithChildren } from 'react';
import { User } from 'shared';

const AuthContext = createContext<User | null | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const [user, setUser] = useState<User | null>(null);

	return (
		<AuthContext.Provider value={{ user, setUser }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};

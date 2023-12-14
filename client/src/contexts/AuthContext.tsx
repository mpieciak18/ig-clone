import { createContext, useContext, useState, PropsWithChildren } from 'react';
import { User, UserStatsCount } from 'shared';

interface AuthContextType {
	user: (User & UserStatsCount) | null;
	setUser: React.Dispatch<
		React.SetStateAction<(User & UserStatsCount) | null>
	>;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	setUser: () => null,
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const [user, setUser] = useState<(User & UserStatsCount) | null>(null);

	return (
		<AuthContext.Provider value={{ user, setUser }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};

// src/context/AuthContext.tsx
import {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from 'react';

interface User {
	id: string;
	name: string;
	email: string;
	avatar?: string;
}

interface AuthContextType {
	user: User | null;
	login: (userData: User) => void;
	logout: () => void;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);

	// Check for saved session on initial load
	useEffect(() => {
		const savedUser = localStorage.getItem('user');
		if (savedUser) {
			setUser(JSON.parse(savedUser));
		}
	}, []);

	const login = (userData: User) => {
		setUser(userData);
		localStorage.setItem('user', JSON.stringify(userData));
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem('user');
	};

	const value = {
		user,
		login,
		logout,
		isAuthenticated: !!user,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}

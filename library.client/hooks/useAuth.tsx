import { createContext, ReactNode, useContext, useState, useMemo } from 'react';
import axios from 'axios';

// Define types
type User = {
	username: string;
	email: string;
};

type AuthContextType = {
	user: User | null;
	login: (data: { username: string; email: string; token: string }) => void;
	logout: () => void;
	isAuthenticated: boolean;
};

// Create context with initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom provider component
export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(() => {
		const saved = localStorage.getItem('auth');
		return saved ? JSON.parse(saved).user : null;
	});

	// Memoized authentication state
	const isAuthenticated = useMemo(() => !!user, [user]);

	const login = (data: {
		username: string;
		email: string;
		token: string;
	}) => {
		localStorage.setItem(
			'auth',
			JSON.stringify({
				user: { username: data.username, email: data.email },
				token: data.token,
			})
		);
		setUser({ username: data.username, email: data.email });
		axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
	};

	const logout = () => {
		localStorage.removeItem('auth');
		setUser(null);
		delete axios.defaults.headers.common['Authorization'];
		// Refresh the page after logout
		window.location.reload();
	};

	// Memoize the context value to prevent unnecessary re-renders
	const contextValue = useMemo(
		() => ({
			user,
			login,
			logout,
			isAuthenticated,
		}),
		[user, isAuthenticated]
	);

	return (
		<AuthContext.Provider value={contextValue}>
			{children}
		</AuthContext.Provider>
	);
}

// Custom hook for consuming context
export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}

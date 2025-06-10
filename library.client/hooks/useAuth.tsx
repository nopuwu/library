import {
	createContext,
	ReactNode,
	useContext,
	useState,
	useMemo,
	useEffect,
} from 'react';
import axios from 'axios';

type User = {
	id: number;
	username: string;
	email: string;
};

type AuthContextType = {
	user: User | null;
	token: string | null;
	login: (data: {
		id: number;
		username: string;
		email: string;
		token: string;
	}) => void;
	logout: () => void;
	isAuthenticated: boolean;
	setToken: (token: string) => void;
	initializeAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [token, setTokenState] = useState<string | null>(null);
	const [isInitialized, setIsInitialized] = useState(false);

	// Initialize auth state from localStorage
	const initializeAuth = () => {
		try {
			const saved = localStorage.getItem('auth');

			if (saved) {
				const parsed = JSON.parse(saved);
				if (parsed.user && parsed.token) {
					const userData = {
						id: parsed.user.id,
						username: parsed.user.username,
						email: parsed.user.email,
					};
					setUser(userData);
					setTokenState(parsed.token);
				}
			}
		} catch (error) {
			console.error('Failed to initialize auth:', error);
			localStorage.removeItem('auth');
		} finally {
			setIsInitialized(true);
		}
	};

	// Set up axios interceptors
	useEffect(() => {
		const requestInterceptor = axios.interceptors.request.use(
			(config) => {
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		return () => {
			axios.interceptors.request.eject(requestInterceptor);
		};
	}, [token]);

	const isAuthenticated = useMemo(() => !!user && !!token, [user, token]);

	const login = (data: {
		id: number;
		username: string;
		email: string;
		token: string;
	}) => {
		const authData = {
			user: {
				id: data.id,
				username: data.username,
				email: data.email,
			},
			token: data.token,
		};
		localStorage.setItem('auth', JSON.stringify(authData));
		setUser(authData.user);
		setTokenState(authData.token);
	};

	const setToken = (newToken: string) => {
		const authData = JSON.parse(localStorage.getItem('auth') || '{}');
		authData.token = newToken;
		localStorage.setItem('auth', JSON.stringify(authData));
		setTokenState(newToken);
	};

	const logout = () => {
		localStorage.removeItem('auth');
		setUser(null);
		setTokenState(null);
		window.location.href = '/';
	};

	const contextValue = useMemo(
		() => ({
			user,
			token,
			login,
			logout,
			isAuthenticated,
			setToken,
			initializeAuth,
		}),
		[user, token, isAuthenticated]
	);

	// Initialize auth on mount
	useEffect(() => {
		if (!isInitialized) {
			initializeAuth();
		}
	}, []);

	return (
		<AuthContext.Provider value={contextValue}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}

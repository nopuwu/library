// components/auth/LoginForm.tsx
import React from 'react';
import { loginUser } from '../../services/authService';
import { useAuth } from '../../../hooks/useAuth';

interface LoginFormProps {
	onSuccess: () => void;
	onSwitchToRegister: () => void;
}

interface LoginResponse {
	username: string;
	email: string;
	token: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
	onSuccess,
	onSwitchToRegister,
}) => {
	const [username, setUsername] = React.useState('');
	const [password, setPassword] = React.useState('');
	const { login } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await loginUser({ username, password });
			login({
				username: response.username,
				email: response.email,
				token: response.token,
			});
			onSuccess();
			// Refresh the page after successful login
			window.location.reload();
		} catch (error) {
			console.error('Error logging in:', error);
		}
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-4'>
			<div>
				<label className='block text-sm font-medium text-gray-700'>
					Username
				</label>
				<input
					type='text'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					className='mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border'
					required
				/>
			</div>
			<div>
				<label className='block text-sm font-medium text-gray-700'>
					Password
				</label>
				<input
					type='password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className='mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border'
					required
				/>
			</div>
			<button
				type='submit'
				className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700'
			>
				Login
			</button>
			<div className='text-center text-sm'>
				Don't have an account?{' '}
				<button
					type='button'
					onClick={onSwitchToRegister}
					className='text-blue-600 hover:underline'
				>
					Register
				</button>
			</div>
		</form>
	);
};

export default LoginForm;

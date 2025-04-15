// components/auth/LoginForm.tsx
import React from 'react';

interface LoginFormProps {
	onSuccess: () => void;
	onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
	onSuccess,
	onSwitchToRegister,
}) => {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Login logic here
		onSuccess();
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-4'>
			<div>
				<label className='block text-sm font-medium text-gray-700'>
					Email
				</label>
				<input
					type='email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
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

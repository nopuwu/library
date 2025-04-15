import React from 'react';

interface RegisterFormProps {
	onSuccess: () => void;
	onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
	onSuccess,
	onSwitchToLogin,
}) => {
	const [nickname, setNickname] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [confirmPassword, setConfirmPassword] = React.useState('');
	const [error, setError] = React.useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}
		// Registration logic here
		onSuccess();
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-4'>
			<div>
				<label className='block text-sm font-medium text-gray-700'>
					Nickname
				</label>
				<input
					type='text'
					value={nickname}
					onChange={(e) => setNickname(e.target.value)}
					className='mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border'
					required
				/>
			</div>
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
			<div>
				<label className='block text-sm font-medium text-gray-700'>
					Confirm Password
				</label>
				<input
					type='password'
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					className='mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border'
					required
				/>
			</div>
			<button
				type='submit'
				className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700'
			>
				Register
			</button>
			<div className='text-center text-sm'>
				Don't have an account?{' '}
				<button
					type='button'
					onClick={onSwitchToLogin}
					className='text-blue-600 hover:underline'
				>
					Login
				</button>
			</div>
		</form>
	);
};

export default RegisterForm;

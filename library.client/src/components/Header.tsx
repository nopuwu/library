import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';
import Modal from './Modal';

interface HeaderProps {
	className?: string;
	userDisplayName?: string;
	isLoggedIn?: boolean;
	onLogin?: () => void;
	onLogout?: () => void;
	onRegister?: () => void;
}

const Header: React.FC<HeaderProps> = ({
	className,
	userDisplayName,
	isLoggedIn,
	onLogin,
	onLogout,
	onRegister,
}) => {
	const [authModalOpen, setAuthModalOpen] = React.useState(false);
	const [authMode, setAuthMode] = React.useState<'login' | 'register'>(
		'login'
	);

	const handleLoginClick = () => {
		setAuthMode('login');
		setAuthModalOpen(true);
	};

	const handleRegisterClick = () => {
		setAuthMode('register');
		setAuthModalOpen(true);
	};

	const handleAuthSuccess = () => {
		setAuthModalOpen(false);
		// Logic to handle successful authentication
	};

	return (
		<>
			<header
				className={` flex justify-between items-center p-4 px-16 bg-white shadow-md header ${className}`}
			>
				<div className=' text-xl font-bold'>
					<Link
						to='/'
						className=' text-gray-800 hover:text-blue-600 transition-colors'
					>
						📚 Library System{' '}
					</Link>
				</div>
				<nav className=' flex-grow mx-8'>
					<ul className=' flex gap-8'>
						<li>
							<Link
								to='/books'
								className=' text-gray-800 font-medium hover:text-blue-600 transition-colors'
							>
								Books
							</Link>
						</li>
						<li>
							<Link
								to='/about'
								className=' text-gray-800 font-medium hover:text-blue-600 transition-colors'
							>
								About
							</Link>
						</li>
					</ul>
				</nav>
				<div className='flex gap-4'>
					{isLoggedIn ? (
						<div className='flex items-center gap-4'>
							<Link
								to='/profile'
								className=' text-gray-800 font-medium hover:text-blue-600 transition-colors'
							>
								{userDisplayName}
							</Link>

							<button
								onClick={onLogout}
								className='px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-800 transition-colors'
							>
								Logout
							</button>
						</div>
					) : (
						<>
							<button
								onClick={handleLoginClick}
								className='px-4 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-800 hover:text-white transition-colors'
							>
								Login
							</button>
							<button
								onClick={handleRegisterClick}
								className='px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-800 transition-colors'
							>
								Register
							</button>
						</>
					)}
				</div>
			</header>

			<Modal
				isOpen={authModalOpen}
				onClose={() => setAuthModalOpen(false)}
				title={authMode === 'login' ? 'Login' : 'Register'}
			>
				{authMode === 'login' ? (
					<LoginForm
						onSuccess={handleAuthSuccess}
						onSwitchToRegister={() => setAuthMode('register')}
					/>
				) : (
					<RegisterForm
						onSuccess={handleAuthSuccess}
						onSwitchToLogin={() => setAuthMode('login')}
					/>
				)}
			</Modal>
		</>
	);
};

export default Header;

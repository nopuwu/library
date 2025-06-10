import { useState } from 'react';
import { updateUser } from '../../services/usersService';

interface User {
	id: number;
	username: string;
	email: string;
}

export default function ProfilePanel({ user }: { user: User }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formData, setFormData] = useState({
		username: user.username,
		email: user.email,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [showAlert, setShowAlert] = useState(false);

	const handleEditProfile = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setFormData({
			username: user.username,
			email: user.email,
		});
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			await updateUser(user.id, formData);
			setIsModalOpen(false);
			setShowAlert(true);
			setTimeout(() => setShowAlert(false), 5000);
		} catch (error) {
			console.error('Error updating profile:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='w-full md:w-80 bg-white rounded-lg shadow p-6 h-fit relative'>
			{/* Alert notification */}
			{showAlert && (
				<div className='absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded z-50'>
					<span className='block sm:inline'>
						Relogin with new credentials to see updates
					</span>
					<button
						className='absolute top-0 right-0 px-2 py-1'
						onClick={() => setShowAlert(false)}
					>
						×
					</button>
				</div>
			)}

			{/* Profile content */}
			<div className='flex flex-col items-center'>
				<div className='w-32 h-32 mb-4 rounded-full bg-gray-100 flex items-center justify-center'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='w-16 h-16 text-gray-400'
						fill='currentColor'
						viewBox='0 0 24 24'
					>
						<path d='M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.3 0-9.9 1.7-9.9 5v2.7h19.8v-2.7c0-3.3-6.6-5-9.9-5z' />
					</svg>
				</div>
				<h2 className='text-xl font-bold'>{user.username}</h2>
				<p className='text-gray-600 mb-2'>{user.email}</p>
				<p className='text-sm text-gray-500 mb-6'>
					Member since 02/03/2023
				</p>

				<div className='w-full border-t border-gray-200 pt-4'>
					<h3 className='font-medium mb-2'>About</h3>
					<p className='text-gray-600 text-sm'>User's bio</p>
				</div>

				<button
					onClick={handleEditProfile}
					className='mt-6 w-full py-2 px-4 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors'
				>
					Edit Profile
				</button>
			</div>

			{/* Edit Profile Modal */}
			{isModalOpen && (
				<div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
					<div className='bg-white rounded-lg p-6 w-full max-w-md'>
						<h2 className='text-xl font-bold mb-4'>Edit Profile</h2>

						<form onSubmit={handleSubmit}>
							<div className='mb-4'>
								<label
									className='block text-gray-700 mb-2'
									htmlFor='username'
								>
									Username
								</label>
								<input
									type='text'
									id='username'
									name='username'
									value={formData.username}
									onChange={handleInputChange}
									className='w-full p-2 border rounded'
									required
								/>
							</div>

							<div className='mb-4'>
								<label
									className='block text-gray-700 mb-2'
									htmlFor='email'
								>
									Email
								</label>
								<input
									type='email'
									id='email'
									name='email'
									value={formData.email}
									onChange={handleInputChange}
									className='w-full p-2 border rounded'
									required
								/>
							</div>

							<div className='flex justify-end gap-2'>
								<button
									type='button'
									onClick={handleCloseModal}
									className='px-4 py-2 text-gray-600 hover:text-gray-800'
									disabled={isLoading}
								>
									Cancel
								</button>
								<button
									type='submit'
									className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300'
									disabled={isLoading}
								>
									{isLoading ? 'Saving...' : 'Save Changes'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

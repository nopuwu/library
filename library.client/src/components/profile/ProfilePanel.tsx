interface User {
	id: string;
	name: string;
	email: string;
	avatar: string;
	membershipDate: string;
	bio: string;
}

interface ProfilePanelProps {
	user: User;
}

export default function ProfilePanel({ user }: ProfilePanelProps) {
	return (
		<div className='w-full md:w-80 bg-white rounded-lg shadow p-6 h-fit'>
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
				<h2 className='text-xl font-bold'>{user.name}</h2>
				<p className='text-gray-600 mb-2'>{user.email}</p>
				<p className='text-sm text-gray-500 mb-6'>
					Member since{' '}
					{new Date(user.membershipDate).toLocaleDateString()}
				</p>

				<div className='w-full border-t border-gray-200 pt-4'>
					<h3 className='font-medium mb-2'>About</h3>
					<p className='text-gray-600 text-sm'>{user.bio}</p>
				</div>

				<button className='mt-6 w-full py-2 px-4 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors'>
					Edit Profile
				</button>
			</div>
		</div>
	);
}

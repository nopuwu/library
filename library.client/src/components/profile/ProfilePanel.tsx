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
				<img
					src={user.avatar}
					alt='Profile'
					className='w-32 h-32 rounded-full object-cover mb-4'
				/>
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

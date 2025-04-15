// src/pages/Profile/ProfilePage.tsx
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import ProfilePanel from '../../components/profile/ProfilePanel';
import Header from '../../components/Header';

type ProfileTab = 'borrowed' | 'history' | 'favorites';

interface User {
	id: string;
	name: string;
	email: string;
	avatar: string;
	membershipDate: string;
	bio: string;
}

export default function ProfilePage() {
	const [activeTab, setActiveTab] = useState<ProfileTab>('borrowed');
	const navigate = useNavigate();

	// Mock user data - replace with real data from your auth context
	const [user, setUser] = useState<User>({
		id: '1',
		name: 'John Doe',
		email: 'john@example.com',
		avatar: '/default-avatar.jpg',
		membershipDate: '2023-01-15',
		bio: 'Book enthusiast and avid reader',
	});

	const handleTabChange = (tab: ProfileTab) => {
		setActiveTab(tab);
		navigate(`/profile/${tab}`);
	};

	return (
		<>
			<Header />
			<div className='min-h-screen bg-gray-50'>
				{/* Your existing header will be rendered by the Layout component */}

				<main className='container mx-auto py-8 px-4'>
					<div className='flex flex-col md:flex-row gap-8'>
						{/* Left Side - Profile Panel */}
						<ProfilePanel user={user} />

						{/* Right Side - Content Area */}
						<div className='flex-1 bg-white rounded-lg shadow p-6'>
							{/* Tabs Navigation */}
							<div className='border-b border-gray-200 mb-6'>
								<nav className='flex space-x-8'>
									{(
										[
											'borrowed',
											'history',
											'favorites',
										] as ProfileTab[]
									).map((tab) => (
										<button
											key={tab}
											onClick={() => handleTabChange(tab)}
											className={`py-4 px-1 font-medium text-sm border-b-2 ${
												activeTab === tab
													? 'border-blue-500 text-blue-600'
													: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
											}`}
										>
											{tab.charAt(0).toUpperCase() +
												tab.slice(1)}
										</button>
									))}
								</nav>
							</div>

							{/* Tab Content */}
							<Outlet />
						</div>
					</div>
				</main>
			</div>
		</>
	);
}

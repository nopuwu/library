import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser, User } from '../../services/usersService';
import Header from '../../components/Header';
import { returnBook } from '../../services/borrowService';

const UsersPage: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [error, setError] = useState('');
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [tab, setTab] = useState<'reservations' | 'borrowings'>('borrowings');

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const data = await getUsers();
				setUsers(data);
			} catch {
				setError('Failed to fetch users');
			}
		};

		fetchUsers();
	}, []);

	const filteredUsers = users.filter((user) =>
		`${user.username} ${user.email}`
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	);

	const handleDelete = async (id: number) => {
		if (!confirm('Are you sure you want to delete this user?')) return;
		try {
			await deleteUser(id);
			setUsers(users.filter((u) => u.id !== id));
		} catch {
			alert('Failed to delete user');
		}
	};

	const handleReturnBook = async (borrowId: number) => {
		try {
			await returnBook(borrowId);
			alert('Book returned successfully');

			// Update local state
			if (!selectedUser) return;

			const updatedBorrowings = selectedUser.borrowings.map((b) =>
				b.id === borrowId ? { ...b, status: 1 } : b
			);

			setSelectedUser({ ...selectedUser, borrowings: updatedBorrowings });
		} catch {
			alert('Failed to return book');
		}
	};

	const handleShowDetails = (user: User) => {
		setSelectedUser(user);
		setShowModal(true);
	};

	const tabs: ('borrowings' | 'reservations')[] = [
		'borrowings',
		'reservations',
	];

	return (
		<>
			<Header />
			<div className='p-6 max-w-5xl mx-auto'>
				<h1 className='text-2xl font-bold mb-4'>Users</h1>

				<input
					type='text'
					placeholder='Search by username or email...'
					className='w-full border border-gray-300 rounded-md p-2 mb-4'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>

				{error && <p className='text-red-500'>{error}</p>}

				<div className='bg-white rounded-lg shadow divide-y'>
					{filteredUsers.map((user) => (
						<div
							key={user.id}
							className='p-4 flex justify-between items-center gap-2'
						>
							<div>
								<p className='font-medium'>{user.username}</p>
								<p className='text-sm text-gray-600'>
									{user.email}
								</p>
							</div>
							<div className='flex gap-2'>
								<button
									onClick={() => handleShowDetails(user)}
									className='px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600'
								>
									View Details
								</button>
								<button
									onClick={() => handleDelete(user.id)}
									className='px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600'
								>
									Delete
								</button>
							</div>
						</div>
					))}
				</div>
				{showModal && selectedUser && (
					<div className='fixed inset-0 bg-black/50 flex justify-center items-center z-50'>
						<div className='bg-white w-full max-w-lg max-h-[80vh] overflow-y-auto p-6 rounded shadow-lg relative'>
							<button
								className='absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl'
								onClick={() => setShowModal(false)}
							>
								&times;
							</button>

							<h2 className='text-xl font-bold mb-4'>
								User Details
							</h2>

							{/* Tabs */}
							<div className='flex border-b mb-4'>
								{tabs.map((tabName) => (
									<button
										key={tabName}
										onClick={() => setTab(tabName)}
										className={`px-4 py-2 capitalize ${
											tab === tabName
												? 'border-b-2 border-blue-500 font-semibold'
												: 'text-gray-500'
										}`}
									>
										{tabName}
									</button>
								))}
							</div>

							{/* Content */}
							{tab === 'borrowings' && (
								<div>
									{selectedUser.borrowings.length > 0 ? (
										<ul className='text-sm list-disc pl-5'>
											{selectedUser.borrowings.map(
												(b) => (
													<li
														key={b.id}
														className='mb-2 flex justify-between items-center'
													>
														<div>
															<strong>
																{b.id}.{' '}
																{
																	b.copy
																		?.title
																}{' '}
															</strong>
															Borrowed on{' '}
															{new Date(
																b.borrowDate
															).toLocaleDateString()}{' '}
														</div>
														{b.status === 0 && (
															<button
																onClick={() =>
																	handleReturnBook(
																		b.id
																	)
																}
																className='ml-4 px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600'
															>
																Return
															</button>
														)}
													</li>
												)
											)}
										</ul>
									) : (
										<p className='text-sm'>
											No borrowings.
										</p>
									)}
								</div>
							)}

							{tab === 'reservations' && (
								<div>
									{selectedUser.reservations.length > 0 ? (
										<ul className='text-sm list-disc pl-5'>
											{selectedUser.reservations.map(
												(r) => (
													<li key={r.id}>
														Reserved on{' '}
														{new Date(
															r.reservationDate
														).toLocaleDateString()}
													</li>
												)
											)}
										</ul>
									) : (
										<p className='text-sm'>
											No reservations.
										</p>
									)}
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default UsersPage;

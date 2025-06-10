import { useEffect, useState } from 'react';
import { getBorrowings, Borrowing } from '../../../services/borrowService';
import BorrowingCard from '../../../components/profile/BorrowingCard';

export default function BorrowedBooks() {
	const [borrowings, setBorrowings] = useState<Borrowing[]>([]);

	useEffect(() => {
		const loadBorrowings = async () => {
			try {
				const data = await getBorrowings();
				setBorrowings(data);
			} catch (error) {
				console.error('Error fetching borrowings:', error);
			}
		};
		loadBorrowings();
	}, []);

	return (
		<div>
			<h3 className='text-lg font-medium mb-4'>
				Currently Borrowed Books
			</h3>
			{borrowings.length > 0 ? (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{borrowings.map((borrowing) => (
						<BorrowingCard
							key={borrowing.id}
							borrowing={borrowing}
						/>
					))}
				</div>
			) : (
				<p className='text-gray-500'>
					You don't have any borrowed books at the moment.
				</p>
			)}
		</div>
	);
}

// src/pages/Profile/components/BorrowingHistory.tsx
import { BookCard } from '../../../components/profile/BookCard';

import greatGatsbyCover from '../../../assets/book-covers/great-gatsby.jpg';
import mockingbirdCover from '../../../assets/book-covers/mockingbird.jpg';
import nineteenEightyFourCover from '../../../assets/book-covers/1984.jpg';

const mockHistory = [
	{
		id: '1',
		title: 'The Great Gatsby',
		author: 'F. Scott Fitzgerald',
		coverImage: greatGatsbyCover,
		borrowedDate: '2023-05-10',
		dueDate: '2023-06-10',
	},
	{
		id: '2',
		title: '1984',
		author: 'George Orwell',
		coverImage: nineteenEightyFourCover,
		borrowedDate: '2023-07-15',
		dueDate: '2023-08-15',
	},
	{
		id: '3',
		title: 'To Kill a Mockingbird',
		author: 'Harper Lee',
		coverImage: mockingbirdCover,
		borrowedDate: '2023-06-01',
		dueDate: '2023-07-01',
	},
];

export default function BorrowingHistory() {
	return (
		<div className='space-y-4'>
			<h3 className='text-xl font-semibold mb-4'>
				Your Borrowing History
			</h3>
			{mockHistory.length > 0 ? (
				mockHistory.map((book) => (
					<BookCard
						key={book.id}
						book={book}
						showBorrowedDate
						showDueDate
					/>
				))
			) : (
				<p className='text-gray-500'>No borrowing history found</p>
			)}
		</div>
	);
}

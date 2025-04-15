// src/pages/Profile/components/FavoriteBooks.tsx
import { BookCard } from '../../../components/profile/BookCard';

import greatGatsbyCover from '../../../assets/book-covers/great-gatsby.jpg';
import mockingbirdCover from '../../../assets/book-covers/mockingbird.jpg';
import nineteenEightyFourCover from '../../../assets/book-covers/1984.jpg';

const mockFavorites = [
	{
		id: '2',
		title: 'To Kill a Mockingbird',
		author: 'Harper Lee',
		coverImage: mockingbirdCover,
	},
	{
		id: '3',
		title: '1984',
		author: 'George Orwell',
		coverImage: nineteenEightyFourCover,
	},
	{
		id: '1',
		title: 'The Great Gatsby',
		author: 'F. Scott Fitzgerald',
		coverImage: greatGatsbyCover,
	},
];

export default function FavoriteBooks() {
	return (
		<div className='space-y-4'>
			<h3 className='text-xl font-semibold mb-4'>Your Favorite Books</h3>
			{mockFavorites.length > 0 ? (
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					{mockFavorites.map((book) => (
						<BookCard key={book.id} book={book} />
					))}
				</div>
			) : (
				<p className='text-gray-500'>
					You haven't saved any favorites yet
				</p>
			)}
		</div>
	);
}

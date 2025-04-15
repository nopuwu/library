// src/pages/Profile/components/FavoriteBooks.tsx
import { BookCard } from '../../../components/profile/BookCard';

const mockFavorites = [
	{
		id: '2',
		title: 'To Kill a Mockingbird',
		author: 'Harper Lee',
		coverImage: '/covers/mockingbird.jpg',
	},
	{
		id: '3',
		title: '1984',
		author: 'George Orwell',
		coverImage: '/covers/1984.jpg',
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

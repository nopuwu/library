// src/pages/Books/BooksPage.tsx
import { useState } from 'react';
import Header from '../../components/Header';
import BookCard from '../../components/BookCard';

interface Book {
	id: string;
	title: string;
	author: string;
	coverImage: string;
	description: string;
	available: boolean;
}

export default function BooksPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [books, setBooks] = useState<Book[]>([
		{
			id: '1',
			title: 'The Great Gatsby',
			author: 'F. Scott Fitzgerald',
			coverImage: '/book-covers/great-gatsby.jpg',
			description:
				'A story of wealth, love, and the American Dream in the 1920s.',
			available: true,
		},
		{
			id: '2',
			title: 'To Kill a Mockingbird',
			author: 'Harper Lee',
			coverImage: '/book-covers/mockingbird.jpg',
			description:
				'A powerful story of racial injustice and moral growth.',
			available: false,
		},
		{
			id: '3',
			title: '1984',
			author: 'George Orwell',
			coverImage: '/book-covers/1984.jpg',
			description:
				'A dystopian novel about totalitarianism and surveillance.',
			available: true,
		},
		// Add more books as needed
	]);

	const handleBorrow = (bookId: string) => {
		setBooks(
			books.map((book) =>
				book.id === bookId ? { ...book, available: false } : book
			)
		);
		// In a real app, you would call your API here
		console.log(`Borrowed book ${bookId}`);
	};

	const filteredBooks = books.filter(
		(book) =>
			book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			book.author.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className='min-h-screen bg-gray-50'>
			<Header />
			<main className='container mx-auto py-8 px-4'>
				{/* Search Bar */}
				<div className='mb-8'>
					<div className='relative max-w-md mx-auto'>
						<input
							type='text'
							placeholder='Search books by title or author...'
							className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						<svg
							className='absolute right-3 top-3 h-5 w-5 text-gray-400'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
							/>
						</svg>
					</div>
				</div>

				{/* Books Grid */}
				{filteredBooks.length > 0 ? (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
						{filteredBooks.map((book) => (
							<BookCard
								key={book.id}
								book={book}
								onBorrow={handleBorrow}
							/>
						))}
					</div>
				) : (
					<div className='text-center py-12'>
						<p className='text-gray-500 text-lg'>
							{searchQuery
								? 'No books match your search.'
								: 'No books available.'}
						</p>
					</div>
				)}
			</main>
		</div>
	);
}

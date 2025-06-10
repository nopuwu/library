// src/pages/Books/BooksPage.tsx
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import BookCard from '../../components/BookCard';
import { getBooks } from '../../services/bookService';
import AddBookForm from '../../components/AddBookForm';
import Modal from '../../components/Modal';
import { borrowBook } from '../../services/borrowService';

interface BookCopy {
	id: number;
	bookId: number;
	availability: number;
}

interface Book {
	id: number;
	title: string;
	author: string;
	genre: string;
	copies: number;
	isbn: string;
	available: boolean;
	bookCopies: BookCopy[];
}

export default function BooksPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [books, setBooks] = useState<Book[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleBorrow = (bookId: number) => {
		if (!confirm('Are you sure you want to borrow this book?')) {
			return;
		}

		// Optimistically update the UI first
		setBooks(
			books.map((book) => {
				if (book.id === bookId) {
					const availableCopyIndex = book.bookCopies.findIndex(
						(copy) => copy.availability === 0
					);
					if (availableCopyIndex !== -1) {
						const updatedCopies = [...book.bookCopies];

						return {
							...book,
							bookCopies: updatedCopies,
							available: updatedCopies.some(
								(copy) => copy.availability === 0
							),
							copies: updatedCopies.filter(
								(copy) => copy.availability === 0
							).length,
						};
					}
				}
				return book;
			})
		);

		borrowBook(bookId)
			.then(() => {
				// After successful borrow, refresh the data from server
				return getBooks();
			})
			.then((data) => {
				const updatedBooks = data.map((book: any) => {
					const bookCopiesExist = 'bookCopies' in book;
					const available = bookCopiesExist
						? book.bookCopies.some(
								(copy: any) => copy.availability === 0
							)
						: book.copies === 0;

					const copies = bookCopiesExist
						? book.bookCopies.filter(
								(copy: any) => copy.availability === 0
							).length
						: book.copies === 0
							? 1
							: 0;

					return {
						...book,
						available,
						copies,
						bookCopies: bookCopiesExist ? book.bookCopies : [],
					};
				});

				const sortedBooks = [...updatedBooks].sort((a, b) => {
					if (a.available === b.available) return 0;
					return a.available ? -1 : 1;
				});

				setBooks(sortedBooks);
			})
			.catch((error) => {
				console.error('Error borrowing book:', error);
				// Revert optimistic update if there was an error
				getBooks().then((data) => {
					const booksWithAvailability = data.map((book: any) => {
						const bookCopiesExist = 'bookCopies' in book;
						const available = bookCopiesExist
							? book.bookCopies.some(
									(copy: any) => copy.availability === 0
								)
							: book.copies === 0;

						const copies = bookCopiesExist
							? book.bookCopies.filter(
									(copy: any) => copy.availability === 0
								).length
							: book.copies === 0
								? 1
								: 0;

						return {
							...book,
							available,
							copies,
							bookCopies: bookCopiesExist ? book.bookCopies : [],
						};
					});

					setBooks(booksWithAvailability);
				});
			});
	};

	useEffect(() => {
		const fetchBooks = async () => {
			try {
				const data = await getBooks();
				const booksWithAvailability = data.map((book: any) => {
					// Handle cases where bookCopies might be missing
					const bookCopiesExist = 'bookCopies' in book;

					// Calculate availability
					const available = bookCopiesExist
						? book.bookCopies.some(
								(copy: any) => copy.availability === 0
							)
						: book.copies > 0;

					// Calculate available copies count
					const copies = bookCopiesExist
						? book.bookCopies.filter(
								(copy: any) => copy.availability === 0
							).length
						: book.copies;

					return {
						...book,
						available,
						copies,
						// Ensure bookCopies is always defined in our state
						bookCopies: bookCopiesExist ? book.bookCopies : [],
					};
				});

				// Sort books: available first
				const sortedBooks = [...booksWithAvailability].sort((a, b) => {
					if (a.available === b.available) return 0;
					return a.available ? -1 : 1;
				});

				setBooks(sortedBooks);
			} catch (err) {
				setError('Failed to fetch books. Please try again later.');
				console.error('Error fetching books:', err);
			} finally {
				setLoading(false);
			}
		};
		fetchBooks();
	}, []);

	const filteredBooks = books.filter(
		(book) =>
			book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
			book.genre.toLowerCase().includes(searchQuery.toLowerCase())
	);

	if (loading) return <div className='text-center py-12'>Loading...</div>;
	if (error)
		return <div className='text-center py-12 text-red-500'>{error}</div>;

	return (
		<div className='min-h-screen bg-gray-50'>
			<Header />
			<main className='container mx-auto py-8 px-4'>
				<div className='flex justify-end mb-4'>
					<button
						onClick={() => setIsModalOpen(true)}
						className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'
					>
						Add Book
					</button>
				</div>

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
			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title='Add New Book'
			>
				<AddBookForm
					onSuccess={() => {
						setIsModalOpen(false);
						// refetch books after adding a new one
						getBooks().then((data) => {
							const booksWithAvailability = data.map(
								(book: any) => {
									// Check if bookCopies exists
									const bookCopiesExist =
										'bookCopies' in book;

									// Calculate availability (available when copy.availability === 0)
									const available = bookCopiesExist
										? book.bookCopies.some(
												(copy: any) =>
													copy.availability === 0
											)
										: book.copies === 0; // Fallback logic if no bookCopies

									// Count available copies (where availability === 0)
									const copies = bookCopiesExist
										? book.bookCopies.filter(
												(copy: any) =>
													copy.availability === 0
											).length
										: book.copies === 0
											? 1
											: 0; // Fallback logic if no bookCopies

									return {
										...book,
										available,
										copies,
										// Ensure bookCopies is always defined
										bookCopies: bookCopiesExist
											? book.bookCopies
											: [],
									};
								}
							);

							// Sort books: available first
							const sortedBooks = [...booksWithAvailability].sort(
								(a, b) => {
									if (a.available === b.available) return 0;
									return a.available ? -1 : 1;
								}
							);

							setBooks(sortedBooks);
						});
					}}
				/>
			</Modal>
		</div>
	);
}

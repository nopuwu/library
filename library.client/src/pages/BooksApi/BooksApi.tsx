import React, { useState } from 'react';
import axios from 'axios';
import {
	fetchBooksByTitleFromApi,
	postBooks,
} from '../../services/bookService';
import Headers from '../../components/Header';

interface Author {
	name: string;
	url: string | null;
}

interface Book {
	id: string | null;
	title: string;
	authors: Author[];
	publishDate: string | null;
	numberOfPages: number | null;
	identifiers: any; // or a more specific type
	isbn: string | null;
	genre: string | null;
}

const BookSearchPage = () => {
	const [title, setTitle] = useState('');
	const [books, setBooks] = useState<Book[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Modal state
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedBook, setSelectedBook] = useState<Book | null>(null);
	const [modalGenre, setModalGenre] = useState('');
	const [copyCount, setCopyCount] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const fetchBooksByTitle = async (title: string) => {
		try {
			setLoading(true);
			setError(null);
			const response = await fetchBooksByTitleFromApi(title);

			// Defensive programming: ensure we always set an array
			if (response && response.data && Array.isArray(response.data)) {
				setBooks(response.data);
			} else if (response && Array.isArray(response)) {
				// In case the API returns data directly without .data wrapper
				setBooks(response);
			} else {
				console.warn('Unexpected API response format:', response);
				setBooks([]);
				setError('Unexpected response format from the API');
			}
		} catch (error) {
			console.error('Error fetching books:', error);
			setBooks([]); // Always ensure books is an array
			setError('Failed to fetch books. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = () => {
		if (title.trim() !== '') {
			fetchBooksByTitle(title);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

	const openModal = (book: Book) => {
		setSelectedBook(book);
		setModalGenre(book.genre || '');
		setCopyCount(1);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedBook(null);
		setModalGenre('');
		setCopyCount(1);
		setIsSubmitting(false);
	};

	const handleSubmitBook = async () => {
		if (!selectedBook) return;

		try {
			setIsSubmitting(true);
			const author =
				selectedBook.authors && selectedBook.authors.length > 0
					? selectedBook.authors.map((a) => a.name).join(', ')
					: 'Unknown';

			await postBooks(
				selectedBook.title,
				author,
				selectedBook.isbn || '',
				modalGenre,
				copyCount
			);

			// Show success message or handle success
			alert('Book added successfully!');
			closeModal();
		} catch (error) {
			console.error('Error adding book:', error);
			alert('Failed to add book. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<Headers />
			<div className='p-6 max-w-4xl mx-auto'>
				<h1 className='text-2xl font-bold mb-4'>Book Search</h1>
				<div className='flex gap-2 mb-6'>
					<input
						type='text'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder='Enter book title...'
						className='flex-1 border border-gray-300 rounded px-3 py-2'
					/>
					<button
						onClick={handleSearch}
						disabled={loading || !title.trim()}
						className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
					>
						{loading ? 'Searching...' : 'Search'}
					</button>
				</div>

				{error && (
					<div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
						{error}
					</div>
				)}

				{loading ? (
					<div className='text-center py-8'>
						<p>Loading...</p>
					</div>
				) : books && books.length === 0 && !error ? (
					<p className='text-gray-600'>
						{title
							? 'No results found.'
							: 'Enter a book title to search.'}
					</p>
				) : books && books.length > 0 ? (
					<div>
						<p className='mb-4 text-sm text-gray-600'>
							Found {books.length} result
							{books.length !== 1 ? 's' : ''}
						</p>
						<ul className='space-y-4'>
							{books.map((book, index) => (
								<li
									key={book.id || index}
									className='p-4 border border-gray-200 rounded shadow-sm hover:shadow-md transition-shadow'
								>
									<div className='flex justify-between items-start'>
										<div className='flex-1'>
											<h2 className='text-xl font-semibold mb-2'>
												{book.title || 'Untitled'}
											</h2>
											<p className='mb-1'>
												<strong>Author:</strong>{' '}
												{book.authors &&
												book.authors.length > 0
													? book.authors
															.map((a) => a.name)
															.join(', ')
													: 'Unknown'}
											</p>
											<p className='mb-1'>
												<strong>Published:</strong>{' '}
												{book.publishDate || 'N/A'}
											</p>
											<p className='mb-1'>
												<strong>ISBN:</strong>{' '}
												{book.isbn || 'N/A'}
											</p>
											<p className='mb-1'>
												<strong>Genre:</strong>{' '}
												{book.genre || 'N/A'}
											</p>
											{book.numberOfPages && (
												<p className='mb-1'>
													<strong>Pages:</strong>{' '}
													{book.numberOfPages}
												</p>
											)}
										</div>
										<button
											onClick={() => openModal(book)}
											className='ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors'
										>
											Add to Library
										</button>
									</div>
								</li>
							))}
						</ul>
					</div>
				) : null}

				{/* Modal */}
				{isModalOpen && selectedBook && (
					<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
						<div className='bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4'>
							<h3 className='text-lg font-semibold mb-4'>
								Add Book to Library
							</h3>

							<div className='mb-4'>
								<h4 className='font-medium text-gray-700'>
									{selectedBook.title}
								</h4>
								<p className='text-sm text-gray-600'>
									by{' '}
									{selectedBook.authors &&
									selectedBook.authors.length > 0
										? selectedBook.authors
												.map((a) => a.name)
												.join(', ')
										: 'Unknown'}
								</p>
							</div>

							<div className='space-y-4'>
								<div>
									<label
										htmlFor='genre'
										className='block text-sm font-medium text-gray-700 mb-1'
									>
										Genre
									</label>
									<input
										id='genre'
										type='text'
										value={modalGenre}
										onChange={(e) =>
											setModalGenre(e.target.value)
										}
										className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
										placeholder='Enter genre'
									/>
								</div>

								<div>
									<label
										htmlFor='copies'
										className='block text-sm font-medium text-gray-700 mb-1'
									>
										Number of Copies
									</label>
									<input
										id='copies'
										type='number'
										min='1'
										value={copyCount}
										onChange={(e) =>
											setCopyCount(
												Math.max(
													1,
													parseInt(e.target.value) ||
														1
												)
											)
										}
										className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
									/>
								</div>
							</div>

							<div className='flex gap-3 mt-6'>
								<button
									onClick={closeModal}
									disabled={isSubmitting}
									className='flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50'
								>
									Cancel
								</button>
								<button
									onClick={handleSubmitBook}
									disabled={
										isSubmitting || !modalGenre.trim()
									}
									className='flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
								>
									{isSubmitting ? 'Adding...' : 'Add Book'}
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default BookSearchPage;

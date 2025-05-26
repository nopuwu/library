import React from 'react';
import { postBooks } from '../services/bookService';

interface AddBookFormProps {
	onSuccess: () => void;
	onCancel?: () => void;
}

const AddBookForm: React.FC<AddBookFormProps> = ({ onSuccess, onCancel }) => {
	const [title, setTitle] = React.useState('');
	const [author, setAuthor] = React.useState('');
	const [isbn, setIsbn] = React.useState('');
	const [genre, setGenre] = React.useState('');
	const [error, setError] = React.useState('');

	const handleAddBook = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title || !author || !isbn || !genre) {
			setError('All fields are required');
			console.error('All fields are required');
			return;
		}

		try {
			await postBooks(title, author, isbn, genre);
			onSuccess();
		} catch (err) {
			console.error('Error adding book:', err);
		}
	};

	return (
		<form onSubmit={handleAddBook} className='space-y-4'>
			{error && <div className='text-red-600'>{error}</div>}

			<div>
				<label className='block text-sm font-medium text-gray-700'>
					Title
				</label>
				<input
					type='text'
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className='mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border'
					required
				/>
			</div>

			<div>
				<label className='block text-sm font-medium text-gray-700'>
					Author
				</label>
				<input
					type='text'
					value={author}
					onChange={(e) => setAuthor(e.target.value)}
					className='mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border'
					required
				/>
			</div>

			<div>
				<label className='block text-sm font-medium text-gray-700'>
					ISBN
				</label>
				<input
					type='text'
					value={isbn}
					onChange={(e) => setIsbn(e.target.value)}
					className='mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border'
					required
				/>
			</div>

			<div>
				<label className='block text-sm font-medium text-gray-700'>
					Genre
				</label>
				<input
					type='text'
					value={genre}
					onChange={(e) => setGenre(e.target.value)}
					className='mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border'
					required
				/>
			</div>

			<div className='flex justify-between'>
				<button
					type='submit'
					className='bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700'
				>
					Add Book
				</button>
				{onCancel && (
					<button
						type='button'
						onClick={onCancel}
						className='text-gray-600 hover:underline'
					>
						Cancel
					</button>
				)}
			</div>
		</form>
	);
};

export default AddBookForm;

// src/components/BookCard.tsx
import { Link } from 'react-router-dom';

interface Book {
	id: number;
	title: string;
	author: string;
	genre: string;
	copies: number;
	isbn: string;
	available: boolean;
}

interface BookCardProps {
	book: Book;
	onBorrow: (bookId: number) => void;
}

export default function BookCard({ book, onBorrow }: BookCardProps) {
	return (
		<div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
			<div className='p-4'>
				<h3 className='font-bold text-lg mb-1'>
					<Link
						to={`/books/${book.id}`}
						className='hover:text-blue-600'
					>
						{book.title}
					</Link>
				</h3>
				<p className='text-gray-600 text-sm mb-2'>by {book.author}</p>
				<p className='text-gray-700 text-sm mb-4 line-clamp-2'>
					{book.genre}
				</p>
				<div className='flex justify-between items-center'>
					<span
						className={`px-2 py-1 text-xs rounded-full ${
							book.available
								? 'bg-green-100 text-green-800'
								: 'bg-red-100 text-red-800'
						}`}
					>
						{book.available ? 'Available' : 'Unavailable'}
					</span>
					<button
						onClick={() => onBorrow(book.id)}
						disabled={!book.available}
						className={`px-3 py-1 text-sm rounded ${
							book.available
								? 'bg-blue-600 text-white hover:bg-blue-700'
								: 'bg-gray-300 text-gray-500 cursor-not-allowed'
						}`}
					>
						{book.available ? 'Borrow' : 'Unavailable'}
					</button>
				</div>
			</div>
		</div>
	);
}

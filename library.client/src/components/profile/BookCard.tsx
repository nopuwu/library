import { Link } from 'react-router-dom';

interface Book {
	id: string;
	title: string;
	author: string;
	coverImage: string;
	dueDate?: string;
	borrowedDate?: string;
}

interface BookCardProps {
	book: Book;
	showDueDate?: boolean;
	showBorrowedDate?: boolean;
}

export const BookCard = ({
	book,
	showDueDate,
	showBorrowedDate,
}: BookCardProps) => (
	<div className='border rounded-lg p-4 flex items-start space-x-4 hover:shadow-md transition-shadow'>
		<img
			src={book.coverImage}
			alt={`${book.title} cover`}
			className='w-20 h-28 object-cover rounded'
		/>
		<div className='flex-1'>
			<h3 className='font-medium text-lg'>
				<Link to={`/books/${book.id}`} className='hover:text-blue-600'>
					{book.title}
				</Link>
			</h3>
			<p className='text-gray-600'>{book.author}</p>
			{showBorrowedDate && book.borrowedDate && (
				<p className='text-sm mt-2'>
					Borrowed: {new Date(book.borrowedDate).toLocaleDateString()}
				</p>
			)}
			{showDueDate && book.dueDate && (
				<p
					className={`text-sm mt-1 ${
						new Date(book.dueDate) < new Date()
							? 'text-red-500'
							: 'text-gray-700'
					}`}
				>
					Due: {new Date(book.dueDate).toLocaleDateString()}
				</p>
			)}
		</div>
	</div>
);

import React from 'react';

interface BookCardProps {
	bookReservation: {
		id: number;
		title: string;
		author: string;
		reservationDate: string;
	};
	onDelete: (reservationId: number) => void;
}

const BookCard: React.FC<BookCardProps> = ({ bookReservation, onDelete }) => {
	const { id, title, author, reservationDate } = bookReservation;
	const formattedDate = new Date(reservationDate).toLocaleDateString(
		undefined,
		{
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}
	);

	const handleDelete = () => {
		onDelete(id);
	};

	return (
		<div className='bg-white rounded-2xl shadow p-4'>
			<h2 className='text-xl font-semibold'>{title}</h2>
			<p className='text-gray-600'>by {author}</p>
			<div className='flex justify-between items-center mt-2'>
				<p className='text-sm text-gray-500'>
					Reserved on:{' '}
					<span className='font-medium'>{formattedDate}</span>
				</p>
				<button
					onClick={handleDelete}
					className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors'
				>
					Delete
				</button>
			</div>
		</div>
	);
};

export default BookCard;

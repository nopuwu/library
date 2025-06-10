import React from 'react';

interface Borrowing {
	id: number;
	title: string;
	author: string;
	borrowDate: string;
	returnDate: string;
}

interface BorrowingCardProps {
	borrowing: Borrowing;
}

const BorrowingCard: React.FC<BorrowingCardProps> = ({ borrowing }) => {
	const { title, author, borrowDate, returnDate } = borrowing;

	const formatDate = (dateString: string) =>
		new Date(dateString).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});

	return (
		<div className='bg-white rounded-2xl shadow p-4'>
			<h2 className='text-xl font-semibold'>{title}</h2>
			<p className='text-gray-600'>by {author}</p>
			<p className='text-sm text-gray-500 mt-2'>
				Borrowed on:{' '}
				<span className='font-medium'>{formatDate(borrowDate)}</span>
			</p>
			<p className='text-sm text-gray-500'>
				Due on:{' '}
				<span className='font-medium'>{formatDate(returnDate)}</span>
			</p>
		</div>
	);
};

export default BorrowingCard;

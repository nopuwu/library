import greatGatsbyCover from '../../../assets/book-covers/great-gatsby.jpg';
import mockingbirdCover from '../../../assets/book-covers/mockingbird.jpg';
import nineteenEightyFourCover from '../../../assets/book-covers/1984.jpg';

export default function BorrowedBooks() {
	const borrowedBooks = [
		{
			id: '1',
			title: 'The Great Gatsby',
			author: 'F. Scott Fitzgerald',
			dueDate: '2023-06-15',
			image: greatGatsbyCover,
		},
		{
			id: '2',
			title: '1984',
			author: 'George Orwell',
			dueDate: '2023-07-01',
			image: mockingbirdCover,
		},
		{
			id: '3',
			title: 'To Kill a Mockingbird',
			author: 'Harper Lee',
			dueDate: '2023-07-15',
			image: nineteenEightyFourCover,
		},
	];

	return (
		<div>
			<h3 className='text-lg font-medium mb-4'>
				Currently Borrowed Books
			</h3>
			{borrowedBooks.length > 0 ? (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{borrowedBooks.map((book) => (
						<div
							key={book.id}
							className='border rounded-lg p-4 flex items-center'
						>
							<img
								src={book.image}
								alt={book.title}
								className='w-16 h-24 object-cover mr-4'
							/>
							<div>
								<h4 className='font-medium'>{book.title}</h4>
								<p className='text-sm text-gray-600'>
									{book.author}
								</p>
								<p className='text-sm mt-2'>
									Due:{' '}
									{new Date(
										book.dueDate
									).toLocaleDateString()}
								</p>
							</div>
						</div>
					))}
				</div>
			) : (
				<p className='text-gray-500'>
					You don't have any borrowed books at the moment.
				</p>
			)}
		</div>
	);
}

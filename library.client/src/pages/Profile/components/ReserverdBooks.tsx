// src/pages/Profile/components/FavoriteBooks.tsx
import ReservationCard from '../../../components/profile/ReservationCard';
import { useEffect, useState } from 'react';
import { Reservation } from '../../../services/reservationService';
import { getReservations } from '../../../services/reservationService';
import { deleteReservation } from '../../../services/reservationService';

export default function ReservedBooks() {
	const [reservations, setReservations] = useState<Reservation[]>([]);

	useEffect(() => {
		const loadReservations = async () => {
			try {
				const data = await getReservations();
				setReservations(data);
			} catch (error) {
				console.error('Error fetching reservations:', error);
			}
		};
		loadReservations();
	}, []);

	const handleDeleteReservation = async (reservationId: number) => {
		try {
			await deleteReservation(reservationId);
			// Remove the deleted reservation from the local state
			setReservations((prev) =>
				prev.filter((reservation) => reservation.id !== reservationId)
			);
		} catch (error) {
			console.error('Failed to delete reservation:', error);
			// Handle error (show toast, alert, etc.)
		}
	};

	console.log('Reservations:', reservations);

	return (
		<div className='space-y-4'>
			<h3 className='text-xl font-semibold mb-4'>Your Reserved Books</h3>
			{reservations.length > 0 ? (
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					{reservations.map((bookReservation) => (
						<ReservationCard
							key={bookReservation.id}
							bookReservation={bookReservation}
							onDelete={handleDeleteReservation}
						/>
					))}
				</div>
			) : (
				<p className='text-gray-500'>
					You haven't reserved any books yet
				</p>
			)}
		</div>
	);
}

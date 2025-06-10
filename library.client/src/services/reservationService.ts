import axios from 'axios';

const API_BASE_URL = 'http://localhost:5237/api';

const authToken = localStorage.getItem('auth');
const token = authToken ? JSON.parse(authToken).token : null;

export interface Reservation {
	id: number;
	title: string;
	author: string;
	reservationDate: string;
}

export const getReservations = async (): Promise<Reservation[]> => {
	try {
		const response = await axios.get<Reservation[]>(
			`${API_BASE_URL}/reservations/user`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error fetching reservations:', error);
		throw error; // Re-throw the error for handling in components
	}
};

export const deleteReservation = async (
	reservationId: number
): Promise<void> => {
	try {
		await axios.delete(`${API_BASE_URL}/reservations/${reservationId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	} catch (error) {
		console.error(`Error deleting reservation ${reservationId}:`, error);
		throw error; // Re-throw the error for handling in components
	}
};

export const createReservation = async (
	bookId: number
): Promise<Reservation> => {
	try {
		const response = await axios.post<Reservation>(
			`${API_BASE_URL}/api/Reservations/${bookId}`,
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error creating reservation:', error);
		throw error; // Re-throw the error for handling in components
	}
};

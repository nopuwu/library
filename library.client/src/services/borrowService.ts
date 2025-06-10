import axios from 'axios';

const API_BASE_URL = 'http://localhost:5237/api';

const authToken = localStorage.getItem('auth');
const token = authToken ? JSON.parse(authToken).token : null;

export interface Borrowing {
	id: number;
	title: string;
	author: string;
	borrowDate: string;
	returnDate: string;
}

export const getBorrowings = async (): Promise<Borrowing[]> => {
	try {
		const response = await axios.get<Borrowing[]>(
			`${API_BASE_URL}/borrows/user`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error fetching borrowings:', error);
		throw error; // Re-throw the error for handling in components
	}
};

export const borrowBook = async (bookId: number): Promise<Borrowing> => {
	try {
		const response = await axios.post<Borrowing>(
			`${API_BASE_URL}/borrows/${bookId}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error borrowing book:', error);
		throw error; // Re-throw the error for handling in components
	}
};

export const returnBook = async (borrowId: number) => {
	try {
		await axios.put(`${API_BASE_URL}/borrows/return/${borrowId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	} catch (error) {
		console.error('Error returning book:', error);
		throw error; // Re-throw the error for handling in components
	}
};

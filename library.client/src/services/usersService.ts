// services/userService.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5237/api';

const authToken = localStorage.getItem('auth');
const token = authToken ? JSON.parse(authToken).token : null;

export interface Reservation {
	id: number;
	userId: number;
	copyId: number;
	reservationDate: string;
	copy: any | null;
}

export interface Borrowing {
	id: number;
	userId: number;
	copyId: number;
	borrowDate: string;
	returnDate: string;
	status: number;
	copy: any | null;
}

export interface User {
	id: number;
	username: string;
	email: string;
	passwordHash?: string;
	passwordSalt?: string;
	role: number;
	status: number;
	reservations: Reservation[];
	borrowings: Borrowing[];
}

export async function getUsers(): Promise<User[]> {
	try {
		const response = await axios.get<User[]>(`${API_BASE_URL}/Users`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error: any) {
		console.error('Error fetching users:', error);
		throw error;
	}
}

// services/userService.ts

export async function deleteUser(id: number): Promise<void> {
	try {
		await axios.delete(`${API_BASE_URL}/Users/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	} catch (error: any) {
		console.error(`Failed to delete user ${id}:`, error);
		throw error;
	}
}

export async function updateUser(
	id: number,
	data: {
		username: string;
		email: string;
	}
) {
	try {
		const response = await axios.put<User>(
			`${API_BASE_URL}/Users/${id}`,
			data,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (error: any) {
		console.error(`Failed to update user ${id}:`, error);
		throw error;
	}
}

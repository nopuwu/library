import axios from 'axios';

const API_BASE_URL = '/api';

const authToken = localStorage.getItem('auth');
const token = authToken ? JSON.parse(authToken).token : null;

export interface Book {
	id: number;
	title: string;
	author: string;
	genre: string;
	copies: number;
	isbn: string;
}

export const getBooks = async (): Promise<Book[]> => {
	try {
		const response = await axios.get<Book[]>(`${API_BASE_URL}/Books`);
		return response.data;
	} catch (error) {
		console.error('Error fetching books:', error);
		throw error;
	}
};

export const postBooks = async (
	title: string,
	author: string,
	isbn: string,
	genre: string,
	copyCount: number = 1
): Promise<void> => {
	try {
		await axios.post(
			`${API_BASE_URL}/Books`,
			{
				book: {
					title,
					author,
					isbn,
					genre,
				},
				copyCount,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
	} catch (error) {
		console.error('Error posting book:', error);
	}
};

export const fetchBooksByTitleFromApi = async (title: string) => {
	try {
		const response = await axios.get(
			`${API_BASE_URL}/Books/by-title/${title}`
		);
		console.log('Books:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error fetching books:', error);
		return [];
	}
};

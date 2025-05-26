import axios from 'axios';

const API_BASE_URL = 'http://localhost:5237/api';

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
	genre: string
): Promise<void> => {
	try {
		await axios.post(`${API_BASE_URL}/Books`, {
			title,
			author,
			isbn,
			genre,
		});
	} catch (error) {
		console.error('Error posting book:', error);
	}
};

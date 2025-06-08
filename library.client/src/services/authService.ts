import axios from 'axios';
const API_BASE_URL = 'http://localhost:5237';

export interface User {
	username: string;
	email: string;
	password: string;
}

export const registerUser = async (user: User): Promise<void> => {
	try {
		await axios.post(`${API_BASE_URL}/api/Auth/register`, user);
	} catch (error) {
		console.error('Error registering user:', error);
		throw error;
	}
};

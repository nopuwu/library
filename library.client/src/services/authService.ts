import axios from 'axios';

const API_BASE_URL = '/api';
export interface UserRegister {
	username: string;
	email: string;
	password: string;
}

export interface UserLogin {
	username: string;
	password: string;
}

export const registerUser = async (user: UserRegister): Promise<void> => {
	try {
		await axios.post(`${API_BASE_URL}/Auth/register`, user);
	} catch (error) {
		console.error('Error registering user:', error);
		throw error;
	}
};

export const loginUser = async (user: UserLogin) => {
	try {
		const response = await axios.post<{
			id: number;
			username: string;
			email: string;
			token: string;
		}>(`${API_BASE_URL}/Auth/login`, user);
		return response.data;
	} catch (error) {
		console.error('Error logging in user:', error);
		throw error;
	}
};

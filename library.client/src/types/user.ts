// src/types/user.ts
export interface User {
	id: string;
	name: string;
	email: string;
	avatar: string;
	membershipDate: string;
	bio: string;
}

export interface Book {
	id: string;
	title: string;
	author: string;
	dueDate?: string;
	image: string;
	borrowedDate?: string;
	returnedDate?: string;
}

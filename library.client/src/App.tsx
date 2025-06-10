import './App.css';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/Profile/ProfilePage';
import BorrowedBooks from './pages/Profile/components/BorrowedBooks';
import BooksPage from './pages/Books/BooksPage';
import { AuthProvider } from '../hooks/useAuth';
import ReservedBooks from './pages/Profile/components/ReserverdBooks';
import UsersPage from './pages/Users/UsersPage';
import BookSearchPage from './pages/BooksApi/BooksApi';

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<>
				<HomePage />
			</>
		),
	},
	{
		path: '/profile',
		element: (
			<>
				<ProfilePage />
			</>
		),
		children: [
			{
				path: 'borrowed',
				element: <BorrowedBooks />,
			},
			{
				path: 'reservation',
				element: <ReservedBooks />,
			},
			{
				index: true,
				element: <BorrowedBooks />,
			},
		],
	},
	{
		path: 'books',
		element: (
			<>
				<BooksPage />
			</>
		),
	},
	{
		path: 'users',
		element: (
			<>
				<UsersPage />
			</>
		),
	},
	{
		path: 'BookSearchPage',
		element: (
			<>
				<BookSearchPage />
			</>
		),
	},
]);

function App() {
	return (
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	);
}

export default App;

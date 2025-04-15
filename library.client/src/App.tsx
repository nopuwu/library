import './App.css';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/Profile/ProfilePage';
import BorrowedBooks from './pages/Profile/components/BorrowedBooks';
import BorrowingHistory from './pages/Profile/components/BorrowingHistory';
import FavoriteBooks from './pages/Profile/components/FavoriteBooks';
import BooksPage from './pages/Books/BooksPage';

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
				path: 'history',
				element: <BorrowingHistory />,
			},
			{
				path: 'favorites',
				element: <FavoriteBooks />,
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
	// { path: '/books', element: <Books /> },
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;

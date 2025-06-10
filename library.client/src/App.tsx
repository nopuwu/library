import './App.css';
import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/Profile/ProfilePage';
import BorrowedBooks from './pages/Profile/components/BorrowedBooks';
import BooksPage from './pages/Books/BooksPage';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import ReservedBooks from './pages/Profile/components/ReserverdBooks';
import UsersPage from './pages/Users/UsersPage';
import BookSearchPage from './pages/BooksApi/BooksApi';
import ProtectedRoute from './components/ProtectedRoute'; // ✅

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomePage />,
	},
	{
		path: '/profile',
		element: (
			<ProtectedRoute>
				<ProfilePage />
			</ProtectedRoute>
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
		path: '/books',
		element: (
			<ProtectedRoute>
				<BooksPage />
			</ProtectedRoute>
		),
	},
	{
		path: '/users',
		element: (
			<ProtectedRoute>
				<UsersPage />
			</ProtectedRoute>
		),
	},
	{
		path: '/BookSearchPage',
		element: (
			<ProtectedRoute>
				<BookSearchPage />
			</ProtectedRoute>
		),
	},
]);

function App() {
	const { initializeAuth } = useAuth();

	useEffect(() => {
		initializeAuth();
	}, []);

	return <RouterProvider router={router} />;
}

export default App;

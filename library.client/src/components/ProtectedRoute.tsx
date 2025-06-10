import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { user } = useAuth();

	// If not authenticated, redirect to home
	if (!user) {
		return <Navigate to='/' replace />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;

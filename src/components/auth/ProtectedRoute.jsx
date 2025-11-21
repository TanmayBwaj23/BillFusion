import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user role is not allowed for this route, redirect to their dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    const redirectPath = `/${user?.role}/dashboard`;
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

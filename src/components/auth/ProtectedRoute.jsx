import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { LoadingPage } from '../ui/LoadingOverlay';

/**
 * ProtectedRoute component that enforces authentication and role-based access control
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string[]} props.allowedRoles - Array of roles allowed to access this route
 * @param {string} props.fallbackPath - Custom path to redirect unauthorized users (default: /access-denied)
 * @returns {React.ReactNode}
 */
export function ProtectedRoute({ children, allowedRoles = [], fallbackPath = '/access-denied' }) {
  const { isAuthenticated, user, isLoading: authLoading, getValidAccessToken } = useAuthStore();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Perform authentication check
    const checkAuth = async () => {
      try {
        console.log('[ProtectedRoute] Checking auth...', { isAuthenticated, hasUser: !!user });

        // Check if we have a valid access token
        const validToken = getValidAccessToken();
        console.log('[ProtectedRoute] Valid token:', !!validToken);

        // If we have authentication state and a valid token, we're done checking
        if (isAuthenticated && user && validToken) {
          console.log('[ProtectedRoute] Auth check passed');
          setIsChecking(false);
          return;
        }

        // If we don't have authentication state, we need to redirect to login
        if (!isAuthenticated || !user) {
          console.log('[ProtectedRoute] Not authenticated, will redirect to login');
          setIsChecking(false);
          return;
        }

        setIsChecking(false);
      } catch (error) {
        console.error('[ProtectedRoute] Authentication check failed:', error);
        setIsChecking(false);
      }
    };

    // Small delay to ensure store is hydrated from localStorage
    const timer = setTimeout(() => {
      checkAuth();
    }, 50);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, getValidAccessToken]);

  // Show loading state while checking authentication
  if (isChecking || authLoading) {
    return <LoadingPage text="Verifying authentication..." />;
  }

  // If not authenticated, redirect to login with return path
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, check if user has one of them
  if (allowedRoles.length > 0) {
    const userRole = user?.role?.toLowerCase(); // Normalize to lowercase
    const normalizedAllowedRoles = allowedRoles.map(r => r?.toLowerCase()); // Normalize allowed roles too
    const hasRequiredRole = normalizedAllowedRoles.includes(userRole);

    console.log('[ProtectedRoute] Role check:', { userRole, allowedRoles: normalizedAllowedRoles, hasRequiredRole });

    if (!hasRequiredRole) {
      // User is authenticated but doesn't have the required role
      // Redirect to access denied page
      return <Navigate to={fallbackPath} state={{ from: location, requiredRoles: allowedRoles }} replace />;
    }
  }

  // User is authenticated and authorized, render children
  return children;
}

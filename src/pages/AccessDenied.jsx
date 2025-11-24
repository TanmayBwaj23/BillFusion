import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

/**
 * AccessDenied page shown when user tries to access a route they don't have permission for
 */
export function AccessDenied() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearAuth } = useAuthStore();
  
  // Get the required roles from navigation state if available
  const requiredRoles = location.state?.requiredRoles || [];
  const fromPath = location.state?.from?.pathname || '/';

  const handleGoToDashboard = () => {
    // Redirect to user's role-specific dashboard
    if (user?.role) {
      navigate(`/${user.role}/dashboard`);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100">
            <svg
              className="h-12 w-12 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>
        
        <p className="text-lg text-gray-600 mb-2">
          You don't have permission to access this resource.
        </p>
        
        {requiredRoles.length > 0 && (
          <p className="text-sm text-gray-500 mb-6">
            This page requires one of the following roles: {requiredRoles.join(', ')}
          </p>
        )}
        
        {user && (
          <p className="text-sm text-gray-500 mb-8">
            You are currently logged in as: <span className="font-semibold">{user.email}</span> ({user.role})
          </p>
        )}

        <div className="space-y-3">
          <button
            onClick={handleGoToDashboard}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Go to My Dashboard
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Go Back
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>
            If you believe you should have access to this page, please contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
}

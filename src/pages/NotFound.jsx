import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

/**
 * NotFound (404) page shown when user navigates to a non-existent route
 */
export function NotFound() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const handleGoHome = () => {
    if (isAuthenticated && user?.role) {
      // Redirect to user's role-specific dashboard
      navigate(`/${user.role}/dashboard`);
    } else {
      // Redirect to login for unauthenticated users
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleGoHome}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Go to Login'}
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Go Back
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}

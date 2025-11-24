import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../../services/authService';
import { showError, showSuccess } from '../../lib/toast';
import { Building } from 'lucide-react';

export function GoogleCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const handleGoogleCallback = async () => {
            const code = searchParams.get('code');
            const state = searchParams.get('state');
            const error = searchParams.get('error');

            // Handle OAuth errors
            if (error) {
                setStatus('error');
                const errorDescription = searchParams.get('error_description') || 'Authentication failed';
                setErrorMessage(errorDescription);
                showError(`Google authentication failed: ${errorDescription}`);

                // Redirect to login after a delay
                setTimeout(() => {
                    navigate('/login', { replace: true });
                }, 3000);
                return;
            }

            // Validate we have the required code
            if (!code) {
                setStatus('error');
                setErrorMessage('No authorization code received');
                showError('Invalid authentication response');

                setTimeout(() => {
                    navigate('/login', { replace: true });
                }, 3000);
                return;
            }

            try {
                setStatus('processing');

                // Exchange authorization code for tokens
                const { user } = await authService.googleCallback(code);

                setStatus('success');
                showSuccess(`Welcome ${user.first_name}!`);

                // Determine redirect based on user role
                const getRoleBasedRedirect = (role) => {
                    switch (role) {
                        case 'client':
                            return '/client/dashboard';
                        case 'vendor':
                            return '/vendor/dashboard';
                        case 'employee':
                            return '/employee/dashboard';
                        case 'admin':
                            return '/admin/dashboard';
                        default:
                            return '/employee/dashboard';
                    }
                };

                const redirectPath = getRoleBasedRedirect(user.role);

                // Small delay to show success message
                setTimeout(() => {
                    navigate(redirectPath, { replace: true });
                }, 500);

            } catch (error) {
                console.error('[GoogleCallback] Error:', error);
                setStatus('error');

                let errorMsg = 'Authentication failed. Please try again.';
                if (error.response?.data?.detail) {
                    errorMsg = error.response.data.detail;
                } else if (error.message) {
                    errorMsg = error.message;
                }

                setErrorMessage(errorMsg);
                showError(errorMsg);

                // Redirect to login after a delay
                setTimeout(() => {
                    navigate('/login', { replace: true });
                }, 3000);
            }
        };

        handleGoogleCallback();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">BillFusion</h1>
                </div>

                {/* Status Card */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    {status === 'processing' && (
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Completing Authentication
                            </h2>
                            <p className="text-gray-600">
                                Please wait while we sign you in with Google...
                            </p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Authentication Successful!
                            </h2>
                            <p className="text-gray-600">
                                Redirecting you to your dashboard...
                            </p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Authentication Failed
                            </h2>
                            <p className="text-gray-600 mb-4">
                                {errorMessage}
                            </p>
                            <p className="text-sm text-gray-500">
                                Redirecting to login page...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

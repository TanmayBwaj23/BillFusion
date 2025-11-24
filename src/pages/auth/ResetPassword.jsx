import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ButtonLoading } from '../../components/ui/LoadingOverlay';
import { Lock, Eye, EyeOff, Building, AlertCircle } from 'lucide-react';
import authService from '../../services/authService';
import { showSuccess, showError } from '../../lib/toast';
import { resetPasswordSchema } from '../../schemas/authSchemas';

/**
 * ResetPassword Component
 * Handles password reset with token from URL
 * Requirements: 7.3, 7.4, 7.5
 */
export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      password_confirm: '',
    }
  });

  /**
   * Extract reset token from URL on component mount
   * Requirements: 7.3 - Extract reset token from URL
   */
  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setTokenError('Invalid or missing reset token. Please request a new password reset link.');
    } else {
      setResetToken(token);
    }
  }, [searchParams]);

  /**
   * Handle password reset form submission
   * Requirements: 7.4 - POST request to Auth Service reset-password endpoint
   */
  const onSubmit = async (data) => {
    if (!resetToken) {
      const errorMsg = 'Invalid reset token. Please request a new password reset link.';
      setApiError(errorMsg);
      showError(errorMsg);
      return;
    }
    
    setIsLoading(true);
    setApiError('');
    
    try {
      await authService.resetPassword(resetToken, data.password, data.password_confirm);
      
      // Show success toast (Requirement 7.5)
      showSuccess('Password reset successfully! Redirecting to login...');
      
      // Requirements: 7.5 - Redirect to login page with success message
      navigate('/login', {
        state: {
          message: 'Password reset successfully! You can now log in with your new password.'
        }
      });
    } catch (error) {
      let errorMessage;
      
      if (error.response?.status === 400 || error.response?.status === 422) {
        // Validation errors
        const errorDetails = error.response?.data?.error_details || error.response?.data?.details;
        if (errorDetails) {
          errorMessage = Object.values(errorDetails).flat().join(', ');
        } else {
          errorMessage = error.response?.data?.message || 'Invalid password format';
        }
      } else if (error.response?.status === 401 || error.response?.status === 404) {
        errorMessage = 'Invalid or expired reset token. Please request a new password reset link.';
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else {
        errorMessage = 'Password reset failed. Please try again later.';
      }
      
      setApiError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const password = watch('password', '');
  
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">BillFusion</h1>
          <p className="text-gray-600 mt-2">Unified Billing & Reporting Platform</p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Reset your password</CardTitle>
            <CardDescription className="text-center">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Token Error */}
              {!resetToken && tokenError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-700">{tokenError}</p>
                    <Link to="/forgot-password" className="text-sm text-red-600 hover:text-red-500 underline mt-1 inline-block">
                      Request a new reset link
                    </Link>
                  </div>
                </div>
              )}

              {/* New Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="Enter your new password"
                    disabled={!resetToken}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={!resetToken}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${strengthColors[Math.min(passwordStrength - 1, 4)]}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">
                        {strengthLabels[Math.min(passwordStrength - 1, 4)]}
                      </span>
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPasswordConfirm ? 'text' : 'password'}
                    {...register('password_confirm')}
                    placeholder="Confirm your new password"
                    disabled={!resetToken}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.password_confirm ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    disabled={!resetToken}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                  >
                    {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password_confirm && (
                  <p className="text-red-500 text-sm mt-1">{errors.password_confirm.message}</p>
                )}
              </div>

              {/* API Error */}
              {resetToken && apiError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{apiError}</p>
                </div>
              )}

              {/* Password Requirements */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2 text-sm">Password Requirements:</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Contains at least one number</li>
                  <li>• Special characters recommended</li>
                </ul>
              </div>

              {/* Reset Button */}
              <Button
                type="submit"
                disabled={isLoading || !resetToken}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? <ButtonLoading text="Resetting password..." /> : 'Reset Password'}
              </Button>

              {/* Back to Login */}
              <Link to="/login">
                <Button variant="ghost" className="w-full" type="button">
                  Back to Login
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

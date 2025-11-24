import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ButtonLoading } from '../../components/ui/LoadingOverlay';
import { Mail, ArrowLeft, CheckCircle, Building } from 'lucide-react';
import authService from '../../services/authService';
import { showSuccess, showInfo, showError } from '../../lib/toast';
import { forgotPasswordSchema } from '../../schemas/authSchemas';

/**
 * ForgotPassword Component
 * Handles password reset email submission
 * Requirements: 7.1, 7.2
 */
export function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [apiError, setApiError] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  /**
   * Handle forgot password form submission
   * Requirements: 7.1 - POST request to Auth Service forgot-password endpoint
   */
  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError('');
    
    try {
      await authService.requestPasswordReset(data.email);
      // Requirements: 7.2 - Display message instructing user to check email
      setSubmittedEmail(data.email);
      setIsEmailSent(true);
      
      // Show success toast (Requirement 7.2)
      showInfo('Password reset email sent! Please check your inbox.');
    } catch (error) {
      let errorMessage;
      
      if (error.response?.status === 404) {
        errorMessage = 'No account found with this email address';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else {
        errorMessage = 'Failed to send reset email. Please try again.';
      }
      
      setApiError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    setApiError('');
    try {
      await authService.requestPasswordReset(submittedEmail);
      // Email resent successfully
    } catch (error) {
      if (error.response?.status === 429) {
        setApiError('Too many requests. Please wait a moment and try again.');
      } else {
        setApiError('Failed to resend email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
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
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
              <CardDescription>
                We've sent a password reset link to your email address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  We sent a password reset link to:
                </p>
                <p className="font-medium text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                  {submittedEmail}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Didn't receive the email?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Check your spam/junk folder</li>
                  <li>• Make sure the email address is correct</li>
                  <li>• Wait a few minutes for the email to arrive</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleResendEmail}
                  disabled={isLoading}
                  className="w-full"
                  variant="outline"
                >
                  {isLoading ? <ButtonLoading text="Resending..." variant="gray" /> : 'Resend Email'}
                </Button>

                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="Enter your email address"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email || apiError ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
                {apiError && (
                  <p className="text-red-500 text-sm mt-1">{apiError}</p>
                )}
              </div>

              {/* Reset Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                {isLoading ? <ButtonLoading text="Sending..." /> : 'Send Reset Link'}
              </Button>

              {/* Back to Login */}
              <Link to="/login">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
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

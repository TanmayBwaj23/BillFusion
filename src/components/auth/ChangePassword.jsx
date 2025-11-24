import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { ButtonLoading } from '../ui/LoadingOverlay';
import authService from '../../services/authService';
import { showSuccess, showError } from '../../lib/toast';
import { passwordChangeSchema } from '../../schemas/authSchemas';

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      new_password_confirm: '',
    }
  });

  // Watch new password for strength indicator
  const newPassword = watch('new_password', '');

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    // Determine strength label and color
    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score, label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 5) return { score, label: 'Good', color: 'bg-blue-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = calculatePasswordStrength(newPassword);

  // Handle password change submission
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      // Call password change API
      const response = await authService.changePassword({
        current_password: data.current_password,
        new_password: data.new_password,
        new_password_confirm: data.new_password_confirm,
      });

      // Show success message
      setSuccess(true);
      
      // Show success toast (Requirement 6.2)
      showSuccess('Password changed successfully!');
      
      // Reset form
      reset();
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to change password';
      const validationErrors = err.response?.data?.error_details || err.response?.data?.details;
      
      let displayError;
      if (validationErrors) {
        // Handle validation errors (Requirement 6.3)
        const errorMessages = Object.entries(validationErrors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('; ');
        displayError = errorMessages;
      } else {
        displayError = errorMessage;
      }
      
      setError(displayError);
      // Show error toast (Requirement 6.4)
      showError(displayError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
          <CheckCircle className="h-5 w-5" />
          <span>Password changed successfully! Your session remains active.</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Current Password
              </label>
              <div className="relative">
                <input
                  {...register('current_password')}
                  type={showCurrentPassword ? 'text' : 'password'}
                  className="w-full p-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.current_password && (
                <p className="text-sm text-red-600">{errors.current_password.message}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Lock className="h-4 w-4" />
                New Password
              </label>
              <div className="relative">
                <input
                  {...register('new_password')}
                  type={showNewPassword ? 'text' : 'password'}
                  className="w-full p-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.new_password && (
                <p className="text-sm text-red-600">{errors.new_password.message}</p>
              )}

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Password Strength:</span>
                    <span className={`font-medium ${
                      passwordStrength.label === 'Weak' ? 'text-red-600' :
                      passwordStrength.label === 'Fair' ? 'text-yellow-600' :
                      passwordStrength.label === 'Good' ? 'text-blue-600' :
                      'text-green-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>Password must contain:</p>
                    <ul className="list-disc list-inside space-y-0.5 ml-2">
                      <li className={newPassword.length >= 8 ? 'text-green-600' : ''}>
                        At least 8 characters
                      </li>
                      <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>
                        One uppercase letter
                      </li>
                      <li className={/[a-z]/.test(newPassword) ? 'text-green-600' : ''}>
                        One lowercase letter
                      </li>
                      <li className={/[0-9]/.test(newPassword) ? 'text-green-600' : ''}>
                        One number
                      </li>
                      <li className={/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-600' : ''}>
                        One special character
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  {...register('new_password_confirm')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="w-full p-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.new_password_confirm && (
                <p className="text-sm text-red-600">{errors.new_password_confirm.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <ButtonLoading text="Changing Password..." />
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Change Password
                  </>
                )}
              </Button>
            </div>

            {/* Security Note */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Security Note:</strong> After changing your password, you will remain logged in on this device. 
                However, you may need to log in again on other devices.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;

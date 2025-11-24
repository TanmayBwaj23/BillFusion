import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { showSuccess, showError, showInfo, showWarning, showLoading, dismissToast, showPromise } from '../lib/toast';

/**
 * Toast Notification Examples
 * This component demonstrates all available toast notification types
 * For development and testing purposes only
 */
const ToastExamples = () => {
  const handleSuccessToast = () => {
    showSuccess('Operation completed successfully!');
  };

  const handleErrorToast = () => {
    showError('An error occurred. Please try again.');
  };

  const handleInfoToast = () => {
    showInfo('Please check your email for further instructions.');
  };

  const handleWarningToast = () => {
    showWarning('This action cannot be undone.');
  };

  const handleLoadingToast = () => {
    const toastId = showLoading('Processing your request...');
    
    // Simulate async operation
    setTimeout(() => {
      dismissToast(toastId);
      showSuccess('Processing complete!');
    }, 3000);
  };

  const handlePromiseToast = () => {
    const mockApiCall = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve() : reject();
      }, 2000);
    });

    showPromise(
      mockApiCall,
      {
        loading: 'Saving data...',
        success: 'Data saved successfully!',
        error: 'Failed to save data'
      }
    );
  };

  const handleCustomToast = () => {
    showSuccess('Custom styled toast!', {
      duration: 6000,
      style: {
        background: '#6366f1',
        color: '#ffffff',
      }
    });
  };

  const handleMultipleToasts = () => {
    showInfo('First notification');
    setTimeout(() => showSuccess('Second notification'), 500);
    setTimeout(() => showWarning('Third notification'), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Toast Notification Examples</CardTitle>
            <CardDescription>
              Click the buttons below to see different types of toast notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Toast Types */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Basic Toast Types</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button onClick={handleSuccessToast} variant="default">
                  Success Toast
                </Button>
                <Button onClick={handleErrorToast} variant="destructive">
                  Error Toast
                </Button>
                <Button onClick={handleInfoToast} variant="outline">
                  Info Toast
                </Button>
                <Button onClick={handleWarningToast} variant="secondary">
                  Warning Toast
                </Button>
              </div>
            </div>

            {/* Advanced Toast Types */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Advanced Toast Types</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Button onClick={handleLoadingToast} variant="outline">
                  Loading Toast
                </Button>
                <Button onClick={handlePromiseToast} variant="outline">
                  Promise Toast
                </Button>
                <Button onClick={handleCustomToast} variant="outline">
                  Custom Styled
                </Button>
              </div>
            </div>

            {/* Multiple Toasts */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Multiple Toasts</h3>
              <Button onClick={handleMultipleToasts} variant="outline">
                Show Multiple Toasts
              </Button>
            </div>

            {/* Real-world Examples */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Real-world Examples</h3>
              <div className="space-y-2">
                <Button 
                  onClick={() => showSuccess('Registration successful! Redirecting to login...')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  Registration Success (Req 1.2)
                </Button>
                <Button 
                  onClick={() => showError('Email already exists. Please use a different email.')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  Registration Error (Req 1.3)
                </Button>
                <Button 
                  onClick={() => showError('Invalid email or password')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  Login Error (Req 2.4)
                </Button>
                <Button 
                  onClick={() => showSuccess('Profile updated successfully!')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  Profile Update Success (Req 5.4)
                </Button>
                <Button 
                  onClick={() => showSuccess('Password changed successfully!')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  Password Change Success (Req 6.2)
                </Button>
                <Button 
                  onClick={() => showInfo('Password reset email sent! Please check your inbox.')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  Forgot Password (Req 7.2)
                </Button>
                <Button 
                  onClick={() => showSuccess('Password reset successfully! Redirecting to login...')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  Reset Password Success (Req 7.5)
                </Button>
              </div>
            </div>

            {/* Dismiss All */}
            <div>
              <Button 
                onClick={() => dismissToast()}
                variant="destructive"
                className="w-full"
              >
                Dismiss All Toasts
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Usage Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Usage Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-1">Import:</h4>
                <code className="bg-gray-100 px-2 py-1 rounded">
                  import {'{ showSuccess, showError, showInfo }'} from '../lib/toast';
                </code>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Basic Usage:</h4>
                <code className="bg-gray-100 px-2 py-1 rounded block">
                  showSuccess('Your message here');
                </code>
              </div>
              <div>
                <h4 className="font-semibold mb-1">With Options:</h4>
                <code className="bg-gray-100 px-2 py-1 rounded block">
                  showSuccess('Message', {'{ duration: 6000 }'});
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ToastExamples;

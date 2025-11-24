import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * ErrorBoundary component for catching React errors
 * Implements fallback UI and error logging for unhandled errors
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    this.logError(error, errorInfo);
    
    // Update state with error details
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));
  }

  logError(error, errorInfo) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
    }

    // In production, you would send this to an error tracking service
    // Example: Sentry, LogRocket, etc.
    try {
      const errorLog = {
        message: error.toString(),
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      // TODO: Send to error tracking service
      // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
      
      // For now, store in sessionStorage for debugging
      const existingErrors = JSON.parse(sessionStorage.getItem('errorLogs') || '[]');
      existingErrors.push(errorLog);
      // Keep only last 10 errors
      if (existingErrors.length > 10) {
        existingErrors.shift();
      }
      sessionStorage.setItem('errorLogs', JSON.stringify(existingErrors));
    } catch (loggingError) {
      // Fail silently if logging fails
      console.error('Failed to log error:', loggingError);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI can be passed as a prop
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          resetError: this.handleReset
        });
      }

      // Default fallback UI
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          errorCount={this.state.errorCount}
          onReset={this.handleReset}
          onReload={this.handleReload}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default fallback UI component shown when an error occurs
 */
function ErrorFallback({ error, errorInfo, errorCount, onReset, onReload }) {
  const navigate = useNavigate();
  const isDevelopment = process.env.NODE_ENV === 'development';

  const handleGoHome = () => {
    onReset();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white shadow-lg rounded-lg p-8">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-red-100 p-4">
              <svg
                className="h-12 w-12 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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

          {/* Error Title */}
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Something Went Wrong
          </h1>

          {/* Error Message */}
          <p className="text-lg text-gray-600 text-center mb-6">
            We're sorry, but something unexpected happened. The error has been logged and we'll look into it.
          </p>

          {/* Error Details (Development Only) */}
          {isDevelopment && error && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Error Details (Development Mode):
              </h3>
              <div className="text-sm text-red-600 font-mono mb-2 overflow-x-auto">
                {error.toString()}
              </div>
              {errorInfo && errorInfo.componentStack && (
                <details className="mt-2">
                  <summary className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">
                    Component Stack
                  </summary>
                  <pre className="mt-2 text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap">
                    {errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          )}

          {/* Error Count Warning */}
          {errorCount > 1 && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This error has occurred {errorCount} times. 
                You may need to reload the page or clear your browser cache.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onReset}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Try Again
            </button>

            <button
              onClick={onReload}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Reload Page
            </button>

            <button
              onClick={handleGoHome}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Go to Home
            </button>
          </div>

          {/* Support Information */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              If this problem persists, please contact support with the error details.
            </p>
            {isDevelopment && (
              <p className="text-xs text-gray-400 mt-2">
                Error logs are stored in sessionStorage for debugging.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;
export { ErrorFallback };

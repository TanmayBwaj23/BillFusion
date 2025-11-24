import toast from 'react-hot-toast';

/**
 * Toast notification utility
 * Provides consistent toast notifications across the application
 */

// Default toast options
const defaultOptions = {
  duration: 4000,
  position: 'top-right',
  style: {
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '14px',
  },
};

/**
 * Show success toast notification
 * @param {string} message - Success message to display
 * @param {object} options - Additional toast options
 */
export const showSuccess = (message, options = {}) => {
  return toast.success(message, {
    ...defaultOptions,
    ...options,
    style: {
      ...defaultOptions.style,
      background: '#10b981',
      color: '#ffffff',
      ...options.style,
    },
    iconTheme: {
      primary: '#ffffff',
      secondary: '#10b981',
    },
  });
};

/**
 * Show error toast notification
 * @param {string} message - Error message to display
 * @param {object} options - Additional toast options
 */
export const showError = (message, options = {}) => {
  return toast.error(message, {
    ...defaultOptions,
    duration: 5000, // Errors stay longer
    ...options,
    style: {
      ...defaultOptions.style,
      background: '#ef4444',
      color: '#ffffff',
      ...options.style,
    },
    iconTheme: {
      primary: '#ffffff',
      secondary: '#ef4444',
    },
  });
};

/**
 * Show info toast notification
 * @param {string} message - Info message to display
 * @param {object} options - Additional toast options
 */
export const showInfo = (message, options = {}) => {
  return toast(message, {
    ...defaultOptions,
    ...options,
    style: {
      ...defaultOptions.style,
      background: '#3b82f6',
      color: '#ffffff',
      ...options.style,
    },
    icon: 'ℹ️',
  });
};

/**
 * Show warning toast notification
 * @param {string} message - Warning message to display
 * @param {object} options - Additional toast options
 */
export const showWarning = (message, options = {}) => {
  return toast(message, {
    ...defaultOptions,
    ...options,
    style: {
      ...defaultOptions.style,
      background: '#f59e0b',
      color: '#ffffff',
      ...options.style,
    },
    icon: '⚠️',
  });
};

/**
 * Show loading toast notification
 * @param {string} message - Loading message to display
 * @param {object} options - Additional toast options
 * @returns {string} Toast ID for dismissal
 */
export const showLoading = (message, options = {}) => {
  return toast.loading(message, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Dismiss a specific toast or all toasts
 * @param {string} toastId - Optional toast ID to dismiss specific toast
 */
export const dismissToast = (toastId) => {
  if (toastId) {
    toast.dismiss(toastId);
  } else {
    toast.dismiss();
  }
};

/**
 * Show promise-based toast (loading -> success/error)
 * @param {Promise} promise - Promise to track
 * @param {object} messages - Messages for loading, success, and error states
 * @param {object} options - Additional toast options
 */
export const showPromise = (promise, messages, options = {}) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Error occurred',
    },
    {
      ...defaultOptions,
      ...options,
    }
  );
};

// Export the base toast for custom usage
export { toast };

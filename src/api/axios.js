import axios from 'axios';
import useAuthStore from '../store/authStore';
import config from '../config/env';

const API_BASE_URL = config.api.baseUrl;
const API_TIMEOUT = config.api.timeout;
const DEBUG_MODE = config.features.debugMode;

// Error handler function for consistent error formatting
const handleApiError = (error) => {
  if (!error.response) {
    // Network error
    return {
      type: 'network',
      message: 'Network error. Please check your connection and try again.',
      retryable: true,
      originalError: error
    };
  }

  const { status, data } = error.response;

  switch (status) {
    case 400:
    case 422:
      return {
        type: 'validation',
        message: data.message || 'Validation failed',
        errors: data.error_details || data.details || {},
        retryable: false,
        originalError: error
      };

    case 401:
      return {
        type: 'authentication',
        message: data.message || 'Authentication failed',
        retryable: false,
        originalError: error
      };

    case 403:
      return {
        type: 'authorization',
        message: data.message || 'Access denied',
        retryable: false,
        originalError: error
      };

    case 409:
      return {
        type: 'conflict',
        message: data.message || 'Resource conflict',
        retryable: false,
        originalError: error
      };

    case 429:
      return {
        type: 'rate_limit',
        message: data.message || 'Too many requests. Please wait and try again.',
        retryable: true,
        retryAfter: error.response.headers['retry-after'],
        originalError: error
      };

    case 500:
    case 502:
    case 503:
      return {
        type: 'server',
        message: data.message || 'Server error. Please try again later.',
        retryable: true,
        originalError: error
      };

    default:
      return {
        type: 'unknown',
        message: data.message || 'An unexpected error occurred',
        retryable: false,
        originalError: error
      };
  }
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and logging
api.interceptors.request.use(
  (config) => {
    // Add request ID for tracing
    config.headers['X-Request-ID'] = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    // Add auth token (use accessToken if available, fallback to token for backward compatibility)
    const authStore = useAuthStore.getState();
    const token = authStore.accessToken || authStore.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request details in debug mode
    if (DEBUG_MODE) {
      console.log('[API Request]', {
        method: config.method?.toUpperCase(),
        url: config.url,
        requestId: config.headers['X-Request-ID'],
        hasAuth: !!token
      });
    }

    return config;
  },
  (error) => {
    if (DEBUG_MODE) {
      console.error('[API Request Error]', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Log response details in debug mode
    if (DEBUG_MODE) {
      console.log('[API Response]', {
        status: response.status,
        url: response.config.url,
        requestId: response.config.headers['X-Request-ID']
      });
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log error details in debug mode
    if (DEBUG_MODE) {
      console.error('[API Response Error]', {
        status: error.response?.status,
        url: originalRequest?.url,
        requestId: originalRequest?.headers?.['X-Request-ID'],
        message: error.message
      });
    }

    // Handle 401 errors - redirect to login
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const authStore = useAuthStore.getState();

      // Clear auth and redirect to login
      authStore.clearAuth();
      window.location.href = '/login';
      return Promise.reject(handleApiError(error));
    }

    // Format and return the error
    const formattedError = handleApiError(error);
    return Promise.reject(formattedError);
  }
);

export default api;
export { handleApiError };

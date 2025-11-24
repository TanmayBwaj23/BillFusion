/**
 * Authentication Service Layer
 * 
 * Provides business logic for all authentication-related operations.
 * Handles API calls, data transformation, and token management.
 * 
 * Requirements: 1.1, 2.1, 3.3, 4.1, 5.1, 5.3, 6.1, 7.1, 7.4
 */

import api from '../api/axios';
import useAuthStore from '../store/authStore';

const AUTH_ENDPOINTS = {
  SIGNUP: '/api/v1/auth/signup',
  LOGIN: '/api/v1/auth/login',
  LOGOUT: '/api/v1/auth/logout',
  ME: '/api/v1/auth/me',
  CHANGE_PASSWORD: '/api/v1/auth/change-password',
  FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
  RESET_PASSWORD: '/api/v1/auth/reset-password',
  UPDATE_PROFILE: '/api/v1/users/me/profile',
};

/**
 * Auth Service
 * Encapsulates all authentication-related API operations
 */
const authService = {
  /**
   * Register a new user account (signup)
   * @param {Object} userData - User registration data
   * @param {string} userData.name - Full name
   * @param {string} userData.email - User email
   * @param {string} userData.phone - Phone number
   * @param {string} userData.password - User password
   * @returns {Promise<{user: Object, access_token: string}>} Registration response
   * @throws {Error} Registration error with formatted message
   */
  async signup(userData) {
    try {
      console.log('[AuthService] Sending signup request...', { name: userData.name, email: userData.email });

      const response = await api.post(AUTH_ENDPOINTS.SIGNUP, {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
      });

      console.log('[AuthService] Signup response received:', response.data);

      const { user, access_token } = response.data;

      // Store auth data in store (billing service returns access_token directly)
      console.log('[AuthService] Storing auth data in store...');
      useAuthStore.getState().setAuth(user, { access_token });

      console.log('[AuthService] Auth data stored successfully');

      return { user, access_token };
    } catch (error) {
      console.error('[AuthService] Signup error:', error);
      throw error;
    }
  },

  /**
   * Login user with email/name and password
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.identifier - Email or name
   * @param {string} credentials.password - User password
   * @returns {Promise<{user: Object, access_token: string}>} Login response
   * @throws {Error} Authentication error
   */
  async login(credentials) {
    try {
      console.log('[AuthService] Sending login request...', { identifier: credentials.identifier });

      const response = await api.post(AUTH_ENDPOINTS.LOGIN, {
        identifier: credentials.identifier,
        password: credentials.password,
      });

      console.log('[AuthService] Login response received:', response.data);

      const { user, access_token } = response.data;

      // Store auth data in store
      console.log('[AuthService] Storing auth data in store...');
      useAuthStore.getState().setAuth(user, { access_token });

      console.log('[AuthService] Auth data stored successfully');

      return { user, access_token };
    } catch (error) {
      console.error('[AuthService] Login error:', error);
      throw error;
    }
  },

  /**
   * Logout current user
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      // Call logout endpoint (best effort - don't fail if it errors)
      await api.post(AUTH_ENDPOINTS.LOGOUT).catch(() => {
        // Ignore logout API errors
      });
    } finally {
      // Always clear local auth state
      useAuthStore.getState().clearAuth();
    }
  },

  /**
   * Refresh access token using refresh token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<{access_token: string, refresh_token: string, expires_in: number}>} New tokens
   * @throws {Error} Token refresh error
   */
  async refreshToken(refreshToken) {
    try {
      const response = await api.post(AUTH_ENDPOINTS.REFRESH, {
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token, expires_in } = response.data;

      // Update tokens in store
      useAuthStore.getState().updateAccessToken(access_token, expires_in);

      return { access_token, refresh_token, expires_in };
    } catch (error) {
      // Clear auth on refresh failure
      useAuthStore.getState().clearAuth();
      throw error;
    }
  },

  /**
   * Get current authenticated user profile
   * @returns {Promise<Object>} User profile data
   * @throws {Error} API error
   */
  async getCurrentUser() {
    try {
      const response = await api.get(AUTH_ENDPOINTS.ME);
      const user = response.data;

      // Update user in store
      useAuthStore.getState().updateUser(user);

      return user;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updates - Profile updates
   * @param {string} [updates.first_name] - First name
   * @param {string} [updates.last_name] - Last name
   * @param {string} [updates.phone] - Phone number
   * @param {string} [updates.timezone] - Timezone
   * @param {string} [updates.language] - Language
   * @returns {Promise<Object>} Updated user data
   * @throws {Error} Update error
   */
  async updateProfile(userId, updates) {
    try {
      const response = await api.put(AUTH_ENDPOINTS.UPDATE_PROFILE, updates);
      const user = response.data;

      // Update user in store
      useAuthStore.getState().updateUser(user);

      return user;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Change user password
   * @param {Object} passwords - Password change data
   * @param {string} passwords.current_password - Current password
   * @param {string} passwords.new_password - New password
   * @param {string} passwords.new_password_confirm - New password confirmation
   * @returns {Promise<{message: string}>} Success message
   * @throws {Error} Password change error
   */
  async changePassword(passwords) {
    try {
      const response = await api.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, {
        current_password: passwords.current_password,
        new_password: passwords.new_password,
        new_password_confirm: passwords.new_password_confirm,
      });

      return {
        message: response.data.message || 'Password changed successfully',
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Request password reset email
   * @param {string} email - User email address
   * @returns {Promise<{message: string}>} Success message
   * @throws {Error} Request error
   */
  async requestPasswordReset(email) {
    try {
      const response = await api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
        email,
      });

      return {
        message: response.data.message || 'Password reset email sent',
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Reset password using reset token
   * @param {string} token - Password reset token
   * @param {string} newPassword - New password
   * @param {string} newPasswordConfirm - New password confirmation
   * @returns {Promise<{message: string}>} Success message
   * @throws {Error} Reset error
   */
  async resetPassword(token, newPassword, newPasswordConfirm) {
    try {
      const response = await api.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
        token,
        password: newPassword,
        password_confirm: newPasswordConfirm,
      });

      return {
        message: response.data.message || 'Password reset successfully',
      };
    } catch (error) {
      throw error;
    }
  },

  // Token management helper functions

  /**
   * Get access token from store
   * @returns {string|null} Access token or null
   */
  getAccessToken() {
    const { accessToken, token } = useAuthStore.getState();
    return accessToken || token;
  },

  /**
   * Get refresh token from store
   * @returns {string|null} Refresh token or null
   */
  getRefreshToken() {
    return useAuthStore.getState().refreshToken;
  },

  /**
   * Set tokens in store
   * @param {string} accessToken - Access token
   * @param {string} refreshToken - Refresh token
   * @param {number} expiresIn - Token expiration in seconds
   */
  setTokens(accessToken, refreshToken, expiresIn) {
    const user = useAuthStore.getState().user;
    useAuthStore.getState().setAuth(user, {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
    });
  },

  /**
   * Clear all tokens from store
   */
  clearTokens() {
    useAuthStore.getState().clearAuth();
  },

  /**
   * Check if access token is expired
   * @returns {boolean} True if token is expired
   */
  isTokenExpired() {
    return useAuthStore.getState().isAccessTokenExpired();
  },

  /**
   * Get valid access token (null if expired)
   * @returns {string|null} Valid access token or null
   */
  getValidAccessToken() {
    return useAuthStore.getState().getValidAccessToken();
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated() {
    return useAuthStore.getState().isAuthenticated;
  },

  /**
   * Get current user from store
   * @returns {Object|null} User object or null
   */
  getCurrentUserFromStore() {
    return useAuthStore.getState().user;
  },

  /**
   * Get user role from store
   * @returns {string|null} User role or null
   */
  getUserRole() {
    return useAuthStore.getState().role;
  },

  /**
   * Initiate Google OAuth login
   * Redirects user to Google consent screen
   * @returns {Promise<void>}
   * @throws {Error} OAuth initialization error
   */
  async googleLogin() {
    try {
      console.log('[AuthService] Initiating Google OAuth login...');

      // Get Google OAuth authorization URL from backend
      const response = await api.get('/api/v1/auth/google/login');

      const { authorization_url, state } = response.data;

      // Store state in sessionStorage for validation (optional)
      sessionStorage.setItem('google_oauth_state', state);

      console.log('[AuthService] Redirecting to Google consent screen...');

      // Redirect to Google OAuth consent screen
      window.location.href = authorization_url;
    } catch (error) {
      console.error('[AuthService] Google OAuth init error:', error);
      throw new Error('Failed to initiate Google authentication');
    }
  },

  /**
   * Handle Google OAuth callback
   * Exchanges authorization code for tokens
   * @param {string} code - Authorization code from Google
   * @returns {Promise<{user: Object, tokens: Object}>} Login response with user and tokens
   * @throws {Error} OAuth callback error
   */
  async googleCallback(code) {
    try {
      console.log('[AuthService] Processing Google OAuth callback...');

      // Exchange authorization code for tokens
      const response = await api.post('/api/v1/auth/google', {
        code,
        redirect_uri: `${window.location.origin}/auth/google/callback`,
      });

      console.log('[AuthService] Google OAuth login successful:', response.data);

      const { user, tokens } = response.data;

      // Store auth data in store
      console.log('[AuthService] Storing Google auth data in store...');
      useAuthStore.getState().setAuth(user, tokens.access_token, tokens.refresh_token);

      // Clean up state from sessionStorage
      sessionStorage.removeItem('google_oauth_state');

      return { user, tokens };
    } catch (error) {
      console.error('[AuthService] Google OAuth callback error:', error);

      // Clean up on error
      sessionStorage.removeItem('google_oauth_state');

      throw error;
    }
  },
};

export default authService;

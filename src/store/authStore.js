import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Calculate token expiry timestamp from expires_in seconds
 * @param {number} expiresIn - Seconds until token expires
 * @returns {number} - Timestamp when token expires
 */
const calculateTokenExpiry = (expiresIn) => {
  if (!expiresIn) return null;
  return Date.now() + (expiresIn * 1000);
};

/**
 * Check if a token is expired based on expiry timestamp
 * @param {number} tokenExpiry - Timestamp when token expires
 * @returns {boolean} - True if token is expired
 */
const isTokenExpired = (tokenExpiry) => {
  if (!tokenExpiry) return true;
  // Add 30 second buffer to refresh before actual expiry
  return Date.now() >= (tokenExpiry - 30000);
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      // User data
      user: null,
      
      // Authentication tokens
      token: null, // Access token (keeping for backward compatibility)
      accessToken: null,
      refreshToken: null,
      tokenExpiry: null,
      
      // Authentication state
      isAuthenticated: false,
      role: null,
      isLoading: false,
      error: null,
      
      /**
       * Set authentication state with user and tokens
       * @param {Object} user - User object
       * @param {Object} tokens - Tokens object with access_token, refresh_token, expires_in
       */
      setAuth: (user, tokens) => {
        const accessToken = tokens?.access_token || tokens?.token;
        const refreshToken = tokens?.refresh_token;
        const expiresIn = tokens?.expires_in;
        
        set({
          user,
          token: accessToken, // Backward compatibility
          accessToken,
          refreshToken,
          tokenExpiry: calculateTokenExpiry(expiresIn),
          isAuthenticated: true,
          role: user?.role,
          error: null
        });
      },
      
      /**
       * Clear all authentication state
       */
      clearAuth: () => set({
        user: null,
        token: null,
        accessToken: null,
        refreshToken: null,
        tokenExpiry: null,
        isAuthenticated: false,
        role: null,
        error: null
      }),
      
      /**
       * Update user data
       * @param {Object} userData - Partial user data to update
       */
      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),
      
      /**
       * Update access token after refresh
       * @param {string} accessToken - New access token
       * @param {number} expiresIn - Seconds until token expires
       */
      updateAccessToken: (accessToken, expiresIn) => set({
        token: accessToken, // Backward compatibility
        accessToken,
        tokenExpiry: calculateTokenExpiry(expiresIn)
      }),
      
      /**
       * Set loading state
       * @param {boolean} loading - Loading state
       */
      setLoading: (loading) => set({ isLoading: loading }),
      
      /**
       * Set error state
       * @param {string|null} error - Error message or null to clear
       */
      setError: (error) => set({ error }),
      
      /**
       * Check if access token is expired
       * @returns {boolean} - True if token is expired
       */
      isAccessTokenExpired: () => {
        const { tokenExpiry } = get();
        return isTokenExpired(tokenExpiry);
      },
      
      /**
       * Get access token if valid
       * @returns {string|null} - Access token or null if expired
       */
      getValidAccessToken: () => {
        const { accessToken, tokenExpiry } = get();
        if (!accessToken || isTokenExpired(tokenExpiry)) {
          return null;
        }
        return accessToken;
      },
      
      // Role helper methods
      isClient: () => get().role === 'client',
      isVendor: () => get().role === 'vendor',
      isEmployee: () => get().role === 'employee',
      isAdmin: () => get().role === 'admin',
      hasRole: (role) => get().role === role
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        tokenExpiry: state.tokenExpiry,
        isAuthenticated: state.isAuthenticated,
        role: state.role
      })
    }
  )
);

export default useAuthStore;

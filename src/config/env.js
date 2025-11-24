/**
 * Environment Configuration and Validation
 * 
 * This module validates and exports environment variables for the application.
 * It ensures all required variables are present and provides sensible defaults.
 */

// Required environment variables
const REQUIRED_ENV_VARS = [
  'VITE_API_BASE_URL'
];

// Optional environment variables with defaults
const ENV_DEFAULTS = {
  VITE_API_TIMEOUT: '10000',
  VITE_AUTH_STORAGE_KEY: 'billfusion_auth',
  VITE_TOKEN_REFRESH_BUFFER: '300',
  VITE_APP_NAME: 'BillFusion',
  VITE_APP_VERSION: '1.0.0',
  VITE_APP_ENV: 'development',
  VITE_DEBUG_MODE: 'false',
  VITE_ENABLE_GOOGLE_AUTH: 'false',
  VITE_ENABLE_2FA: 'false',
  VITE_ENABLE_PASSWORD_STRENGTH: 'true',
  VITE_DEFAULT_LANGUAGE: 'en',
  VITE_DEFAULT_TIMEZONE: 'UTC',
  VITE_ITEMS_PER_PAGE: '10'
};

/**
 * Validates that all required environment variables are present
 * @throws {Error} If any required environment variable is missing
 */
const validateEnv = () => {
  const missingVars = [];
  
  for (const varName of REQUIRED_ENV_VARS) {
    if (!import.meta.env[varName]) {
      missingVars.push(varName);
    }
  }
  
  if (missingVars.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.\n' +
      'See .env.example for reference.';
    
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Gets an environment variable value with fallback to default
 * @param {string} key - Environment variable key
 * @returns {string} Environment variable value or default
 */
const getEnvVar = (key) => {
  return import.meta.env[key] || ENV_DEFAULTS[key] || '';
};

/**
 * Gets a boolean environment variable
 * @param {string} key - Environment variable key
 * @returns {boolean} Boolean value
 */
const getBooleanEnvVar = (key) => {
  const value = getEnvVar(key);
  return value === 'true' || value === '1';
};

/**
 * Gets a number environment variable
 * @param {string} key - Environment variable key
 * @returns {number} Number value
 */
const getNumberEnvVar = (key) => {
  const value = getEnvVar(key);
  return parseInt(value, 10) || 0;
};

// Validate environment on module load
validateEnv();

// Export configuration object
const config = {
  // API Configuration
  api: {
    baseUrl: getEnvVar('VITE_API_BASE_URL'),
    timeout: getNumberEnvVar('VITE_API_TIMEOUT'),
  },
  
  // Authentication Configuration
  auth: {
    storageKey: getEnvVar('VITE_AUTH_STORAGE_KEY'),
    tokenRefreshBuffer: getNumberEnvVar('VITE_TOKEN_REFRESH_BUFFER'),
  },
  
  // Application Configuration
  app: {
    name: getEnvVar('VITE_APP_NAME'),
    version: getEnvVar('VITE_APP_VERSION'),
    env: getEnvVar('VITE_APP_ENV'),
  },
  
  // Feature Flags
  features: {
    debugMode: getBooleanEnvVar('VITE_DEBUG_MODE'),
    googleAuth: getBooleanEnvVar('VITE_ENABLE_GOOGLE_AUTH'),
    twoFactorAuth: getBooleanEnvVar('VITE_ENABLE_2FA'),
    passwordStrength: getBooleanEnvVar('VITE_ENABLE_PASSWORD_STRENGTH'),
  },
  
  // UI Configuration
  ui: {
    defaultLanguage: getEnvVar('VITE_DEFAULT_LANGUAGE'),
    defaultTimezone: getEnvVar('VITE_DEFAULT_TIMEZONE'),
    itemsPerPage: getNumberEnvVar('VITE_ITEMS_PER_PAGE'),
  },
  
  // Google OAuth Configuration (if enabled)
  google: {
    clientId: getEnvVar('VITE_GOOGLE_CLIENT_ID'),
    redirectUri: getEnvVar('VITE_GOOGLE_REDIRECT_URI'),
  },
  
  // Monitoring Configuration (if enabled)
  monitoring: {
    errorTracking: getBooleanEnvVar('VITE_ENABLE_ERROR_TRACKING'),
    sentryDsn: getEnvVar('VITE_SENTRY_DSN'),
    analytics: getBooleanEnvVar('VITE_ENABLE_ANALYTICS'),
    gaTrackingId: getEnvVar('VITE_GA_TRACKING_ID'),
  },
  
  // Helper methods
  isDevelopment: () => config.app.env === 'development',
  isProduction: () => config.app.env === 'production',
  isStaging: () => config.app.env === 'staging',
};

// Log configuration in debug mode
if (config.features.debugMode) {
  console.log('[Config] Environment configuration loaded:', {
    apiBaseUrl: config.api.baseUrl,
    appEnv: config.app.env,
    appVersion: config.app.version,
    features: config.features,
  });
}

export default config;

import { describe, it, expect } from 'vitest';
import config from './env';

describe('Environment Configuration', () => {
  it('should export a configuration object', () => {
    expect(config).toBeDefined();
    expect(config.api).toBeDefined();
    expect(config.auth).toBeDefined();
    expect(config.app).toBeDefined();
    expect(config.features).toBeDefined();
    expect(config.ui).toBeDefined();
  });

  it('should have API configuration with required fields', () => {
    expect(config.api.baseUrl).toBeDefined();
    expect(typeof config.api.baseUrl).toBe('string');
    expect(config.api.timeout).toBeDefined();
    expect(typeof config.api.timeout).toBe('number');
    expect(config.api.timeout).toBeGreaterThan(0);
  });

  it('should have auth configuration with required fields', () => {
    expect(config.auth.storageKey).toBeDefined();
    expect(typeof config.auth.storageKey).toBe('string');
    expect(config.auth.tokenRefreshBuffer).toBeDefined();
    expect(typeof config.auth.tokenRefreshBuffer).toBe('number');
  });

  it('should have app configuration with required fields', () => {
    expect(config.app.name).toBeDefined();
    expect(typeof config.app.name).toBe('string');
    expect(config.app.version).toBeDefined();
    expect(typeof config.app.version).toBe('string');
    expect(config.app.env).toBeDefined();
    expect(typeof config.app.env).toBe('string');
  });

  it('should have feature flags as booleans', () => {
    expect(typeof config.features.debugMode).toBe('boolean');
    expect(typeof config.features.googleAuth).toBe('boolean');
    expect(typeof config.features.twoFactorAuth).toBe('boolean');
    expect(typeof config.features.passwordStrength).toBe('boolean');
  });

  it('should have UI configuration with required fields', () => {
    expect(config.ui.defaultLanguage).toBeDefined();
    expect(typeof config.ui.defaultLanguage).toBe('string');
    expect(config.ui.defaultTimezone).toBeDefined();
    expect(typeof config.ui.defaultTimezone).toBe('string');
    expect(config.ui.itemsPerPage).toBeDefined();
    expect(typeof config.ui.itemsPerPage).toBe('number');
    expect(config.ui.itemsPerPage).toBeGreaterThan(0);
  });

  it('should provide environment helper methods', () => {
    expect(typeof config.isDevelopment).toBe('function');
    expect(typeof config.isProduction).toBe('function');
    expect(typeof config.isStaging).toBe('function');
    
    // Helper methods should return booleans
    expect(typeof config.isDevelopment()).toBe('boolean');
    expect(typeof config.isProduction()).toBe('boolean');
    expect(typeof config.isStaging()).toBe('boolean');
  });

  it('should have google configuration object', () => {
    expect(config.google).toBeDefined();
    expect(typeof config.google.clientId).toBe('string');
    expect(typeof config.google.redirectUri).toBe('string');
  });

  it('should have monitoring configuration object', () => {
    expect(config.monitoring).toBeDefined();
    expect(typeof config.monitoring.errorTracking).toBe('boolean');
    expect(typeof config.monitoring.analytics).toBe('boolean');
  });

  it('should validate API base URL is set', () => {
    // This test ensures the required VITE_API_BASE_URL is present
    expect(config.api.baseUrl).toBeTruthy();
    expect(config.api.baseUrl.length).toBeGreaterThan(0);
  });
});

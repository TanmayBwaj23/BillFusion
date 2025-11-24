import { z } from 'zod';

/**
 * Centralized Zod validation schemas for authentication forms
 * Requirements: 1.1, 2.1, 5.3, 6.1, 7.4
 */

// ============================================================================
// Custom Error Messages
// ============================================================================

const customErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.expected === 'string') {
      return { message: 'This field is required' };
    }
  }
  if (issue.code === z.ZodIssueCode.too_small) {
    if (issue.type === 'string') {
      return { message: `Must be at least ${issue.minimum} characters` };
    }
  }
  return { message: ctx.defaultError };
};

// ============================================================================
// Reusable Field Validators
// ============================================================================

/**
 * Email validation
 * Custom error messages for better UX
 */
export const emailValidator = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

/**
 * Password validation with comprehensive rules
 * Requirements: 1.1 - Password must meet security requirements
 */
export const passwordValidator = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number');

/**
 * Strong password validation with special character requirement
 * Used for password changes and resets
 */
export const strongPasswordValidator = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Name validation
 * Allows letters, spaces, hyphens, and apostrophes
 */
export const nameValidator = z
  .string()
  .min(1, 'This field is required')
  .max(50, 'Must be less than 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Only letters, spaces, hyphens, and apostrophes are allowed');

/**
 * Phone validation (optional)
 * Flexible format to support international numbers
 */
export const phoneValidator = z
  .string()
  .regex(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number')
  .optional()
  .or(z.literal(''));

/**
 * Role validation
 */
export const roleValidator = z.enum(['client', 'vendor', 'employee', 'admin'], {
  errorMap: () => ({ message: 'Please select a valid role' })
});

/**
 * Timezone validation
 */
export const timezoneValidator = z.string().min(1, 'Timezone is required');

/**
 * Language validation
 */
export const languageValidator = z.string().min(1, 'Language is required');

// ============================================================================
// Registration Schema
// ============================================================================

/**
 * Registration form validation schema - Simplified
 * Requirements: 1.1 - Validate registration data
 * Only requires: name, email, phone, password
 * All users default to EMPLOYEE role
 */
export const registrationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  email: emailValidator,
  phone: z.string().min(1, 'Phone number is required').regex(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number'),
  password: passwordValidator,
  role: roleValidator,
  terms_accepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  }),
  marketing_consent: z.boolean().optional(),
});

// ============================================================================
// Login Schema
// ============================================================================

/**
 * Login form validation schema
 * Requirements: 2.1 - Validate login credentials
 */
export const loginSchema = z.object({
  email: emailValidator,
  password: z.string().min(1, 'Password is required'),
  remember_me: z.boolean().optional(),
});

// ============================================================================
// Profile Update Schema
// ============================================================================

/**
 * Profile update validation schema
 * Requirements: 5.3 - Validate profile update data
 */
export const profileUpdateSchema = z.object({
  first_name: nameValidator,
  last_name: nameValidator,
  phone: phoneValidator,
  timezone: timezoneValidator,
  language: languageValidator,
});

// ============================================================================
// Password Change Schema
// ============================================================================

/**
 * Password change validation schema
 * Requirements: 6.1 - Validate password change data
 */
export const passwordChangeSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: strongPasswordValidator,
    new_password_confirm: z.string().min(1, 'Please confirm your new password'),
  })
  .refine(data => data.new_password === data.new_password_confirm, {
    message: "Passwords don't match",
    path: ['new_password_confirm']
  })
  .refine(data => data.current_password !== data.new_password, {
    message: "New password must be different from current password",
    path: ['new_password']
  });

// ============================================================================
// Forgot Password Schema
// ============================================================================

/**
 * Forgot password validation schema
 * Requirements: 7.1 - Validate email for password reset
 */
export const forgotPasswordSchema = z.object({
  email: emailValidator,
});

// ============================================================================
// Reset Password Schema
// ============================================================================

/**
 * Reset password validation schema
 * Requirements: 7.4 - Validate password reset data
 */
export const resetPasswordSchema = z
  .object({
    password: strongPasswordValidator,
    password_confirm: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.password_confirm, {
    message: "Passwords don't match",
    path: ['password_confirm']
  });

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calculate password strength score
 * Returns a score from 0-100
 */
export const calculatePasswordStrength = (password) => {
  if (!password) return 0;

  let strength = 0;

  // Length checks
  if (password.length >= 8) strength += 25;
  if (password.length >= 12) strength += 25;

  // Character variety checks
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
  if (/\d/.test(password)) strength += 15;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 10;

  return Math.min(strength, 100);
};

/**
 * Get password strength label
 */
export const getPasswordStrengthLabel = (strength) => {
  if (strength === 0) return '';
  if (strength < 40) return 'Weak';
  if (strength < 70) return 'Fair';
  if (strength < 90) return 'Good';
  return 'Strong';
};

/**
 * Get password strength color class
 */
export const getPasswordStrengthColor = (strength) => {
  if (strength === 0) return 'bg-gray-200';
  if (strength < 40) return 'bg-red-500';
  if (strength < 70) return 'bg-yellow-500';
  if (strength < 90) return 'bg-blue-500';
  return 'bg-green-500';
};

/**
 * Validate a single field
 * Useful for real-time validation
 */
export const validateField = (schema, fieldName, value) => {
  try {
    schema.shape[fieldName].parse(value);
    return { valid: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message };
    }
    return { valid: false, error: 'Validation failed' };
  }
};

// ============================================================================
// Export all schemas
// ============================================================================

export default {
  registrationSchema,
  loginSchema,
  profileUpdateSchema,
  passwordChangeSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  // Field validators
  emailValidator,
  passwordValidator,
  strongPasswordValidator,
  nameValidator,
  phoneValidator,
  roleValidator,
  timezoneValidator,
  languageValidator,
  // Helper functions
  calculatePasswordStrength,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
  validateField,
};

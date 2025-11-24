import { describe, it, expect } from 'vitest';
import {
  registrationSchema,
  loginSchema,
  profileUpdateSchema,
  passwordChangeSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  emailValidator,
  passwordValidator,
  strongPasswordValidator,
  nameValidator,
  phoneValidator,
  calculatePasswordStrength,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
} from './authSchemas';

describe('authSchemas', () => {
  describe('emailValidator', () => {
    it('should accept valid email addresses', () => {
      expect(() => emailValidator.parse('test@example.com')).not.toThrow();
      expect(() => emailValidator.parse('user.name+tag@example.co.uk')).not.toThrow();
    });

    it('should reject invalid email addresses', () => {
      expect(() => emailValidator.parse('')).toThrow();
      expect(() => emailValidator.parse('invalid')).toThrow();
      expect(() => emailValidator.parse('invalid@')).toThrow();
      expect(() => emailValidator.parse('@example.com')).toThrow();
    });
  });

  describe('passwordValidator', () => {
    it('should accept valid passwords', () => {
      expect(() => passwordValidator.parse('Password123')).not.toThrow();
      expect(() => passwordValidator.parse('MyP@ssw0rd')).not.toThrow();
    });

    it('should reject passwords that are too short', () => {
      expect(() => passwordValidator.parse('Pass1')).toThrow();
    });

    it('should reject passwords without lowercase letters', () => {
      expect(() => passwordValidator.parse('PASSWORD123')).toThrow();
    });

    it('should reject passwords without uppercase letters', () => {
      expect(() => passwordValidator.parse('password123')).toThrow();
    });

    it('should reject passwords without numbers', () => {
      expect(() => passwordValidator.parse('Password')).toThrow();
    });
  });

  describe('strongPasswordValidator', () => {
    it('should accept strong passwords with special characters', () => {
      expect(() => strongPasswordValidator.parse('MyP@ssw0rd!')).not.toThrow();
    });

    it('should reject passwords without special characters', () => {
      expect(() => strongPasswordValidator.parse('Password123')).toThrow();
    });
  });

  describe('nameValidator', () => {
    it('should accept valid names', () => {
      expect(() => nameValidator.parse('John')).not.toThrow();
      expect(() => nameValidator.parse("O'Brien")).not.toThrow();
      expect(() => nameValidator.parse('Mary-Jane')).not.toThrow();
      expect(() => nameValidator.parse('Jean Paul')).not.toThrow();
    });

    it('should reject empty names', () => {
      expect(() => nameValidator.parse('')).toThrow();
    });

    it('should reject names with numbers', () => {
      expect(() => nameValidator.parse('John123')).toThrow();
    });

    it('should reject names with special characters', () => {
      expect(() => nameValidator.parse('John@Doe')).toThrow();
    });
  });

  describe('phoneValidator', () => {
    it('should accept valid phone numbers', () => {
      expect(() => phoneValidator.parse('+1 (555) 123-4567')).not.toThrow();
      expect(() => phoneValidator.parse('555-123-4567')).not.toThrow();
      expect(() => phoneValidator.parse('+44 20 1234 5678')).not.toThrow();
    });

    it('should accept empty string', () => {
      expect(() => phoneValidator.parse('')).not.toThrow();
    });

    it('should reject phone numbers with letters', () => {
      expect(() => phoneValidator.parse('555-CALL-NOW')).toThrow();
    });
  });

  describe('registrationSchema', () => {
    it('should accept valid registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123',
        password_confirm: 'Password123',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+1 555-123-4567',
        role: 'employee',
        terms_accepted: true,
        marketing_consent: false,
      };
      expect(() => registrationSchema.parse(validData)).not.toThrow();
    });

    it('should reject when passwords do not match', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password123',
        password_confirm: 'DifferentPassword123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'employee',
        terms_accepted: true,
      };
      expect(() => registrationSchema.parse(invalidData)).toThrow();
    });

    it('should reject when terms are not accepted', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password123',
        password_confirm: 'Password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'employee',
        terms_accepted: false,
      };
      expect(() => registrationSchema.parse(invalidData)).toThrow();
    });
  });

  describe('loginSchema', () => {
    it('should accept valid login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'anypassword',
        remember_me: true,
      };
      expect(() => loginSchema.parse(validData)).not.toThrow();
    });

    it('should accept login data without remember_me', () => {
      const validData = {
        email: 'test@example.com',
        password: 'anypassword',
      };
      expect(() => loginSchema.parse(validData)).not.toThrow();
    });
  });

  describe('profileUpdateSchema', () => {
    it('should accept valid profile data', () => {
      const validData = {
        first_name: 'John',
        last_name: 'Doe',
        phone: '+1 555-123-4567',
        timezone: 'America/New_York',
        language: 'en',
      };
      expect(() => profileUpdateSchema.parse(validData)).not.toThrow();
    });

    it('should reject profile data without required fields', () => {
      const invalidData = {
        first_name: 'John',
        // missing last_name
        timezone: 'America/New_York',
        language: 'en',
      };
      expect(() => profileUpdateSchema.parse(invalidData)).toThrow();
    });
  });

  describe('passwordChangeSchema', () => {
    it('should accept valid password change data', () => {
      const validData = {
        current_password: 'OldPassword123!',
        new_password: 'NewPassword123!',
        new_password_confirm: 'NewPassword123!',
      };
      expect(() => passwordChangeSchema.parse(validData)).not.toThrow();
    });

    it('should reject when new passwords do not match', () => {
      const invalidData = {
        current_password: 'OldPassword123!',
        new_password: 'NewPassword123!',
        new_password_confirm: 'DifferentPassword123!',
      };
      expect(() => passwordChangeSchema.parse(invalidData)).toThrow();
    });

    it('should reject when new password is same as current password', () => {
      const invalidData = {
        current_password: 'SamePassword123!',
        new_password: 'SamePassword123!',
        new_password_confirm: 'SamePassword123!',
      };
      expect(() => passwordChangeSchema.parse(invalidData)).toThrow();
    });
  });

  describe('forgotPasswordSchema', () => {
    it('should accept valid email', () => {
      const validData = {
        email: 'test@example.com',
      };
      expect(() => forgotPasswordSchema.parse(validData)).not.toThrow();
    });
  });

  describe('resetPasswordSchema', () => {
    it('should accept valid reset password data', () => {
      const validData = {
        password: 'NewPassword123!',
        password_confirm: 'NewPassword123!',
      };
      expect(() => resetPasswordSchema.parse(validData)).not.toThrow();
    });

    it('should reject when passwords do not match', () => {
      const invalidData = {
        password: 'NewPassword123!',
        password_confirm: 'DifferentPassword123!',
      };
      expect(() => resetPasswordSchema.parse(invalidData)).toThrow();
    });
  });

  describe('calculatePasswordStrength', () => {
    it('should return 0 for empty password', () => {
      expect(calculatePasswordStrength('')).toBe(0);
    });

    it('should return low score for weak password', () => {
      const strength = calculatePasswordStrength('pass');
      expect(strength).toBeLessThan(40);
    });

    it('should return medium score for fair password', () => {
      const strength = calculatePasswordStrength('Password1');
      expect(strength).toBeGreaterThanOrEqual(40);
      expect(strength).toBeLessThan(90);
    });

    it('should return high score for strong password', () => {
      const strength = calculatePasswordStrength('MyP@ssw0rd123!');
      expect(strength).toBeGreaterThanOrEqual(90);
    });

    it('should cap at 100', () => {
      const strength = calculatePasswordStrength('VeryLongP@ssw0rd123!WithManyCharacters');
      expect(strength).toBeLessThanOrEqual(100);
    });
  });

  describe('getPasswordStrengthLabel', () => {
    it('should return empty string for 0 strength', () => {
      expect(getPasswordStrengthLabel(0)).toBe('');
    });

    it('should return "Weak" for low strength', () => {
      expect(getPasswordStrengthLabel(30)).toBe('Weak');
    });

    it('should return "Fair" for medium strength', () => {
      expect(getPasswordStrengthLabel(50)).toBe('Fair');
    });

    it('should return "Good" for high strength', () => {
      expect(getPasswordStrengthLabel(80)).toBe('Good');
    });

    it('should return "Strong" for very high strength', () => {
      expect(getPasswordStrengthLabel(95)).toBe('Strong');
    });
  });

  describe('getPasswordStrengthColor', () => {
    it('should return gray for 0 strength', () => {
      expect(getPasswordStrengthColor(0)).toBe('bg-gray-200');
    });

    it('should return red for weak password', () => {
      expect(getPasswordStrengthColor(30)).toBe('bg-red-500');
    });

    it('should return yellow for fair password', () => {
      expect(getPasswordStrengthColor(50)).toBe('bg-yellow-500');
    });

    it('should return blue for good password', () => {
      expect(getPasswordStrengthColor(80)).toBe('bg-blue-500');
    });

    it('should return green for strong password', () => {
      expect(getPasswordStrengthColor(95)).toBe('bg-green-500');
    });
  });
});

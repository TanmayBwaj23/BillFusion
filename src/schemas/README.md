# Authentication Validation Schemas

This directory contains centralized Zod validation schemas for all authentication-related forms in the application.

## Overview

The `authSchemas.js` file provides:
- **Reusable field validators** for common input types (email, password, name, phone, etc.)
- **Complete form schemas** for all authentication flows
- **Helper functions** for password strength calculation and validation
- **Custom error messages** for better user experience

## Requirements Coverage

This implementation satisfies the following requirements:
- **1.1**: Registration form validation
- **2.1**: Login form validation
- **5.3**: Profile update validation
- **6.1**: Password change validation
- **7.4**: Password reset validation

## Available Schemas

### Form Schemas

#### `registrationSchema`
Validates user registration data including:
- Email (required, valid format)
- Password (min 8 chars, uppercase, lowercase, number)
- Password confirmation (must match)
- First and last name (required, letters only)
- Phone (optional, valid format)
- Role (client, vendor, employee, admin)
- Terms acceptance (required)
- Marketing consent (optional)

**Usage:**
```javascript
import { registrationSchema } from '@/schemas/authSchemas';
import { zodResolver } from '@hookform/resolvers/zod';

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(registrationSchema)
});
```

#### `loginSchema`
Validates login credentials:
- Email (required, valid format)
- Password (required)
- Remember me (optional boolean)

#### `profileUpdateSchema`
Validates profile update data:
- First and last name (required)
- Phone (optional)
- Timezone (required)
- Language (required)

#### `passwordChangeSchema`
Validates password change requests:
- Current password (required)
- New password (min 8 chars, uppercase, lowercase, number, special char)
- New password confirmation (must match)
- Ensures new password differs from current password

#### `forgotPasswordSchema`
Validates forgot password email submission:
- Email (required, valid format)

#### `resetPasswordSchema`
Validates password reset with token:
- New password (strong requirements)
- Password confirmation (must match)

### Field Validators

Individual field validators can be used for custom forms:

- `emailValidator` - Email address validation
- `passwordValidator` - Basic password requirements (8+ chars, upper, lower, number)
- `strongPasswordValidator` - Enhanced password requirements (includes special char)
- `nameValidator` - Name validation (letters, spaces, hyphens, apostrophes)
- `phoneValidator` - Phone number validation (optional)
- `roleValidator` - Role enum validation
- `timezoneValidator` - Timezone validation
- `languageValidator` - Language validation

## Helper Functions

### Password Strength

#### `calculatePasswordStrength(password)`
Calculates password strength score (0-100) based on:
- Length (8+ chars, 12+ chars)
- Character variety (uppercase, lowercase, numbers, special chars)

**Returns:** Number (0-100)

#### `getPasswordStrengthLabel(strength)`
Returns human-readable label for strength score.

**Returns:** String ('Weak', 'Fair', 'Good', 'Strong')

#### `getPasswordStrengthColor(strength)`
Returns Tailwind CSS color class for strength indicator.

**Returns:** String (e.g., 'bg-red-500', 'bg-green-500')

### Field Validation

#### `validateField(schema, fieldName, value)`
Validates a single field for real-time validation.

**Parameters:**
- `schema` - Zod schema object
- `fieldName` - Name of field to validate
- `value` - Value to validate

**Returns:** Object `{ valid: boolean, error: string | null }`

**Example:**
```javascript
import { validateField, registrationSchema } from '@/schemas/authSchemas';

const result = validateField(registrationSchema, 'email', 'test@example.com');
if (!result.valid) {
  console.error(result.error);
}
```

## Custom Error Messages

All schemas include custom error messages that are:
- User-friendly and actionable
- Specific to the validation failure
- Consistent across the application

Example error messages:
- "Email is required"
- "Password must be at least 8 characters"
- "Password must contain at least one uppercase letter"
- "Passwords don't match"
- "You must accept the terms and conditions"

## Integration with React Hook Form

All schemas are designed to work seamlessly with React Hook Form using the `zodResolver`:

```javascript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/schemas/authSchemas';

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember_me: false
    }
  });

  const onSubmit = (data) => {
    // Data is validated and type-safe
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">Login</button>
    </form>
  );
}
```

## Testing

All schemas are thoroughly tested in `authSchemas.test.js` with:
- Valid input acceptance tests
- Invalid input rejection tests
- Edge case handling
- Helper function verification

Run tests with:
```bash
npm test
```

## Best Practices

1. **Always use centralized schemas** - Don't create inline validation schemas in components
2. **Leverage helper functions** - Use provided password strength and validation helpers
3. **Provide clear error messages** - All schemas include user-friendly error messages
4. **Test validation logic** - Add tests when modifying schemas
5. **Keep schemas DRY** - Reuse field validators across different form schemas

## Extending Schemas

To add a new validation schema:

1. Create field validators if needed
2. Compose the schema using existing validators
3. Add custom refinements for cross-field validation
4. Add comprehensive tests
5. Document the schema in this README

Example:
```javascript
export const myNewSchema = z.object({
  email: emailValidator,
  custom_field: z.string().min(1, 'Custom field is required'),
}).refine(data => {
  // Custom validation logic
  return data.custom_field !== data.email;
}, {
  message: "Custom field cannot be same as email",
  path: ['custom_field']
});
```

## Migration Notes

Components have been updated to use these centralized schemas:
- ✅ `Register.jsx` - Uses `registrationSchema`
- ✅ `Login.jsx` - Uses `loginSchema`
- ✅ `Profile.jsx` - Uses `profileUpdateSchema`
- ✅ `ChangePassword.jsx` - Uses `passwordChangeSchema`
- ✅ `ForgotPassword.jsx` - Uses `forgotPasswordSchema`
- ✅ `ResetPassword.jsx` - Uses `resetPasswordSchema`

All components now benefit from:
- Consistent validation rules
- Better error messages
- Easier maintenance
- Type safety

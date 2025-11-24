# Toast Notification System

This document describes the toast notification system implemented using `react-hot-toast`.

## Overview

The toast notification system provides consistent, user-friendly feedback across the application for various operations including authentication, profile management, and error handling.

## Installation

The system uses `react-hot-toast` library:

```bash
npm install react-hot-toast
```

## Configuration

### Global Setup

The `Toaster` component is configured in `App.jsx`:

```jsx
import { Toaster } from 'react-hot-toast';

<Toaster 
  position="top-right"
  reverseOrder={false}
  gutter={8}
  toastOptions={{
    duration: 4000,
    style: {
      borderRadius: '8px',
      padding: '12px 16px',
      fontSize: '14px',
    },
  }}
/>
```

## Usage

Import the toast utilities from `lib/toast.js`:

```javascript
import { showSuccess, showError, showInfo, showWarning } from '../../lib/toast';
```

### Available Functions

#### Success Notifications
```javascript
showSuccess('Operation completed successfully!');
```
- **Use for**: Successful operations (registration, login, profile updates, password changes)
- **Duration**: 4 seconds
- **Color**: Green (#10b981)

#### Error Notifications
```javascript
showError('An error occurred. Please try again.');
```
- **Use for**: Failed operations, validation errors, network errors
- **Duration**: 5 seconds (longer for errors)
- **Color**: Red (#ef4444)

#### Info Notifications
```javascript
showInfo('Please check your email for further instructions.');
```
- **Use for**: Informational messages (password reset emails sent)
- **Duration**: 4 seconds
- **Color**: Blue (#3b82f6)

#### Warning Notifications
```javascript
showWarning('This action cannot be undone.');
```
- **Use for**: Warning messages
- **Duration**: 4 seconds
- **Color**: Orange (#f59e0b)

#### Loading Notifications
```javascript
const toastId = showLoading('Processing...');
// Later dismiss it
dismissToast(toastId);
```

#### Promise-based Notifications
```javascript
showPromise(
  apiCall(),
  {
    loading: 'Saving...',
    success: 'Saved successfully!',
    error: 'Failed to save'
  }
);
```

## Implementation Examples

### Registration Success (Requirement 1.2)
```javascript
try {
  await authService.register(data);
  showSuccess('Registration successful! Redirecting to login...');
  navigate('/login');
} catch (error) {
  showError(errorMessage);
}
```

### Validation Errors (Requirement 1.3)
```javascript
catch (error) {
  if (error.response?.status === 422) {
    const errorDetails = error.response?.data?.error_details;
    const errorMessage = Object.values(errorDetails).flat().join(', ');
    showError(errorMessage);
  }
}
```

### Login Errors (Requirement 2.4)
```javascript
catch (error) {
  if (error.response?.status === 401) {
    showError('Invalid email or password');
  }
}
```

### Profile Update Success (Requirement 5.4)
```javascript
try {
  await authService.updateProfile(userId, data);
  showSuccess('Profile updated successfully!');
} catch (error) {
  showError('Failed to update profile');
}
```

### Password Change Success (Requirement 6.2)
```javascript
try {
  await authService.changePassword(data);
  showSuccess('Password changed successfully!');
} catch (error) {
  showError(errorMessage);
}
```

### Password Reset Email (Requirement 7.2)
```javascript
try {
  await authService.requestPasswordReset(email);
  showInfo('Password reset email sent! Please check your inbox.');
} catch (error) {
  showError('Failed to send reset email');
}
```

### Password Reset Success (Requirement 7.5)
```javascript
try {
  await authService.resetPassword(token, password);
  showSuccess('Password reset successfully! Redirecting to login...');
  navigate('/login');
} catch (error) {
  showError(errorMessage);
}
```

## Requirements Coverage

This implementation satisfies the following requirements:

- **1.2**: Registration success notifications
- **1.3**: Registration validation error display
- **2.4**: Login error notifications
- **5.4**: Profile update success notifications
- **5.5**: Profile update error notifications
- **6.2**: Password change success feedback
- **6.3**: Password change error display
- **6.4**: Password change validation errors
- **7.2**: Forgot password confirmation message
- **7.5**: Password reset success redirect with notification

## Customization

You can customize individual toast notifications by passing additional options:

```javascript
showSuccess('Custom message', {
  duration: 6000,
  position: 'bottom-center',
  style: {
    background: '#custom-color',
  }
});
```

## Best Practices

1. **Keep messages concise**: Toast messages should be brief and actionable
2. **Use appropriate types**: Match the toast type to the message severity
3. **Avoid duplicates**: Don't show multiple toasts for the same action
4. **Provide context**: Include enough information for users to understand what happened
5. **Complement, don't replace**: Use toasts alongside inline error messages for forms

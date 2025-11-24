# ErrorBoundary Component

## Overview

The `ErrorBoundary` component is a React error boundary that catches JavaScript errors anywhere in the child component tree, logs those errors, and displays a fallback UI instead of crashing the entire application.

## Features

- **Error Catching**: Catches unhandled errors in React component tree
- **Fallback UI**: Displays user-friendly error message with recovery options
- **Error Logging**: Logs errors to console (development) and sessionStorage
- **Custom Fallback**: Supports custom fallback UI via props
- **Error Recovery**: Provides "Try Again", "Reload Page", and "Go to Home" options
- **Development Mode**: Shows detailed error information in development
- **Error Tracking Ready**: Prepared for integration with error tracking services (Sentry, LogRocket)

## Usage

### Basic Usage

The ErrorBoundary is already integrated at the root level in `App.jsx`:

```jsx
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        {/* Your app routes */}
      </Router>
    </ErrorBoundary>
  );
}
```

### Custom Fallback UI

You can provide a custom fallback UI:

```jsx
<ErrorBoundary
  fallback={({ error, errorInfo, resetError }) => (
    <div>
      <h1>Oops! Something went wrong</h1>
      <p>{error?.message}</p>
      <button onClick={resetError}>Try Again</button>
    </div>
  )}
>
  <YourComponent />
</ErrorBoundary>
```

### Multiple Error Boundaries

You can use multiple error boundaries to isolate errors to specific parts of your app:

```jsx
<ErrorBoundary>
  <Header />
  <ErrorBoundary>
    <MainContent />
  </ErrorBoundary>
  <ErrorBoundary>
    <Sidebar />
  </ErrorBoundary>
  <Footer />
</ErrorBoundary>
```

## Error Logging

### Development Mode

In development, errors are logged to the console with full stack traces and component stacks.

### Production Mode

In production, errors are:
1. Stored in sessionStorage (last 10 errors)
2. Ready to be sent to error tracking services

### Integrating Error Tracking Services

To integrate with Sentry or other error tracking services, modify the `logError` method in `ErrorBoundary.jsx`:

```javascript
logError(error, errorInfo) {
  // Existing logging code...
  
  // Add Sentry integration
  if (window.Sentry) {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack
        }
      }
    });
  }
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | ReactNode | Yes | The component tree to protect |
| `fallback` | Function | No | Custom fallback UI renderer. Receives `{ error, errorInfo, resetError }` |

## Fallback UI Features

The default fallback UI includes:

- **Error Icon**: Visual indicator of the error
- **Error Title**: "Something Went Wrong"
- **Error Message**: User-friendly explanation
- **Error Details** (dev only): Full error message and component stack
- **Error Count Warning**: Alerts if error occurs multiple times
- **Action Buttons**:
  - Try Again: Resets error state and re-renders
  - Reload Page: Full page reload
  - Go to Home: Navigate to home/dashboard
- **Support Information**: Guidance for persistent issues

## Requirements Validation

This component validates the following requirements:

- **9.1**: Network error handling with user-friendly messages
- **9.2**: Validation error extraction and display
- **9.3**: Authorization error handling
- **9.4**: Server error handling
- **9.5**: Rate limit error handling

## Testing

Tests are located in `ErrorBoundary.test.jsx` and cover:

- Rendering children when no error occurs
- Displaying fallback UI when error is caught
- Showing action buttons in fallback UI
- Supporting custom fallback UI
- Logging errors to sessionStorage

Run tests with:

```bash
npm test -- ErrorBoundary.test.jsx --run
```

## Best Practices

1. **Place at Root Level**: Always have an ErrorBoundary at the root of your app
2. **Strategic Placement**: Add boundaries around complex features that might fail independently
3. **Don't Overuse**: Too many boundaries can make debugging harder
4. **Log Errors**: Always integrate with an error tracking service in production
5. **User Experience**: Provide clear recovery options in fallback UI
6. **Testing**: Test error scenarios to ensure boundaries work correctly

## Limitations

Error boundaries do **not** catch errors in:

- Event handlers (use try-catch instead)
- Asynchronous code (setTimeout, promises)
- Server-side rendering
- Errors thrown in the error boundary itself

For these cases, use traditional error handling with try-catch blocks.

## Future Enhancements

- Integration with error tracking services (Sentry, LogRocket)
- Automatic error reporting to backend
- User feedback collection on errors
- Error recovery suggestions based on error type
- A/B testing different fallback UIs

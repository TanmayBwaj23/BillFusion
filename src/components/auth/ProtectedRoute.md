# ProtectedRoute Component

## Overview
The `ProtectedRoute` component is a route wrapper that enforces authentication and role-based access control (RBAC) for protected routes in the application.

## Features

### 1. Authentication Check
- Verifies user is authenticated before allowing access
- Checks for valid access token in the auth store
- Redirects unauthenticated users to login page

### 2. Role-Based Access Control
- Supports restricting routes to specific user roles
- Validates user role against allowed roles list
- Redirects unauthorized users to access denied page

### 3. Loading State
- Shows loading spinner while checking authentication
- Prevents flash of unauthorized content
- Provides user feedback during verification

### 4. Redirect Handling
- Preserves original route in location state for post-login redirect
- Supports custom fallback paths for unauthorized access
- Passes required roles to access denied page for better UX

## Usage

### Basic Protection (Any Authenticated User)
```jsx
<Route 
  path="/profile" 
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  } 
/>
```

### Role-Based Protection
```jsx
<Route 
  path="/admin" 
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

### Multiple Allowed Roles
```jsx
<Route 
  path="/reports" 
  element={
    <ProtectedRoute allowedRoles={['admin', 'employee']}>
      <ReportsPage />
    </ProtectedRoute>
  } 
/>
```

### Custom Fallback Path
```jsx
<Route 
  path="/sensitive" 
  element={
    <ProtectedRoute 
      allowedRoles={['admin']} 
      fallbackPath="/custom-denied"
    >
      <SensitivePage />
    </ProtectedRoute>
  } 
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | required | Components to render if user is authorized |
| `allowedRoles` | string[] | `[]` | Array of roles allowed to access the route. Empty array allows any authenticated user |
| `fallbackPath` | string | `'/access-denied'` | Path to redirect unauthorized users |

## Behavior Flow

1. **Initial Load**: Shows loading spinner
2. **Authentication Check**: 
   - Verifies `isAuthenticated` flag
   - Checks for valid user object
   - Validates access token
3. **Not Authenticated**: Redirects to `/login` with return path
4. **Authenticated but Unauthorized**: Redirects to access denied page
5. **Authenticated and Authorized**: Renders child components

## Integration with Auth Store

The component relies on the following auth store properties:
- `isAuthenticated`: Boolean flag indicating authentication status
- `user`: User object containing role and other details
- `isLoading`: Loading state from auth store
- `getValidAccessToken()`: Function to check token validity

## Access Denied Page

When a user is authenticated but lacks required permissions, they are redirected to the AccessDenied page which:
- Displays clear error message
- Shows required roles
- Provides navigation options (dashboard, back, logout)
- Maintains good UX for authorization failures

## Requirements Validation

This implementation satisfies **Requirement 10.5**:
> WHEN a user attempts to access a route without proper permissions THEN the Frontend Application SHALL redirect to an access denied page

## Testing

The component includes unit tests covering:
- Loading state display
- Redirect to login for unauthenticated users
- Rendering children for authenticated users
- Role-based access control
- Custom fallback paths

## Security Considerations

- Always checks authentication before rendering protected content
- Validates token freshness using `getValidAccessToken()`
- Prevents unauthorized access through client-side routing
- Note: Client-side protection should be complemented with server-side authorization

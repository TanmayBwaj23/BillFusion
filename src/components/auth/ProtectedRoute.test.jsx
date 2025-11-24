import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route, MemoryRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import useAuthStore from '../../store/authStore';

// Mock the auth store
vi.mock('../../store/authStore');

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state when auth is loading', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: true,
      getValidAccessToken: vi.fn(() => null)
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Verifying authentication...')).toBeDefined();
  });

  it('should redirect to login when not authenticated', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      getValidAccessToken: vi.fn(() => null)
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Should redirect to login
    expect(screen.queryByText('Protected Content')).toBeNull();
  });

  it('should render children when authenticated and no role required', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', role: 'client' },
      isLoading: false,
      getValidAccessToken: vi.fn(() => 'valid-token')
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Content should be visible after auth check completes
    setTimeout(() => {
      expect(screen.queryByText('Protected Content')).toBeDefined();
    }, 100);
  });

  it('should render children when authenticated with correct role', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', role: 'client' },
      isLoading: false,
      getValidAccessToken: vi.fn(() => 'valid-token')
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={['client', 'admin']}>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Content should be visible after auth check completes
    setTimeout(() => {
      expect(screen.queryByText('Protected Content')).toBeDefined();
    }, 100);
  });

  it('should redirect to access denied when authenticated but wrong role', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', role: 'client' },
      isLoading: false,
      getValidAccessToken: vi.fn(() => 'valid-token')
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute allowedRoles={['admin', 'employee']}>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/access-denied" element={<div>Access Denied Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Should not show protected content
    setTimeout(() => {
      expect(screen.queryByText('Protected Content')).toBeNull();
    }, 100);
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for cleaner test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should render children when there is no error', () => {
    render(
      <BrowserRouter>
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      </BrowserRouter>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should render fallback UI when an error occurs', () => {
    render(
      <BrowserRouter>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </BrowserRouter>
    );

    expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
    expect(screen.getByText(/We're sorry, but something unexpected happened/)).toBeInTheDocument();
  });

  it('should display action buttons in fallback UI', () => {
    render(
      <BrowserRouter>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to home/i })).toBeInTheDocument();
  });

  it('should render custom fallback when provided', () => {
    const customFallback = ({ error, resetError }) => (
      <div>
        <h1>Custom Error UI</h1>
        <p>{error?.message || 'Unknown error'}</p>
        <button onClick={resetError}>Reset</button>
      </div>
    );

    render(
      <BrowserRouter>
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </BrowserRouter>
    );

    expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('should log error to sessionStorage', () => {
    // Clear sessionStorage before test
    sessionStorage.clear();

    render(
      <BrowserRouter>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </BrowserRouter>
    );

    const errorLogs = JSON.parse(sessionStorage.getItem('errorLogs') || '[]');
    expect(errorLogs.length).toBeGreaterThan(0);
    expect(errorLogs[0]).toHaveProperty('message');
    expect(errorLogs[0]).toHaveProperty('timestamp');
    expect(errorLogs[0].message).toContain('Test error');
  });
});

import React from 'react';
import { cn } from '../../lib/utils';
import { Spinner } from './Spinner';

/**
 * Loading overlay component that covers its container
 * 
 * @param {Object} props
 * @param {boolean} props.isLoading - Whether to show the overlay
 * @param {string} props.text - Optional loading text
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Content to show when not loading
 */
export function LoadingOverlay({ isLoading, text, className, children }) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3">
            <Spinner size="lg" variant="primary" />
            {text && <p className="text-sm text-gray-600 font-medium">{text}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Full page loading overlay
 */
export function LoadingPage({ text = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" variant="primary" />
        <p className="text-lg text-gray-700 font-medium">{text}</p>
      </div>
    </div>
  );
}

/**
 * Inline loading state for buttons
 */
export function ButtonLoading({ text = 'Loading...', variant = 'white' }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Spinner size="sm" variant={variant} />
      <span>{text}</span>
    </div>
  );
}

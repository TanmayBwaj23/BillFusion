import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Spinner component for loading states
 * 
 * @param {Object} props
 * @param {string} props.size - Size variant: 'sm', 'md', 'lg', 'xl'
 * @param {string} props.variant - Color variant: 'primary', 'white', 'gray'
 * @param {string} props.className - Additional CSS classes
 */
export function Spinner({ size = 'md', variant = 'primary', className }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-3',
    xl: 'h-12 w-12 border-4'
  };

  const variantClasses = {
    primary: 'border-blue-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-600 border-t-transparent'
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * Spinner with text label
 */
export function SpinnerWithText({ text = 'Loading...', size = 'md', variant = 'primary', className }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Spinner size={size} variant={variant} />
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  );
}

/**
 * Centered spinner for full-page or container loading
 */
export function SpinnerCentered({ size = 'lg', variant = 'primary', className }) {
  return (
    <div className={cn('flex items-center justify-center w-full h-full min-h-[200px]', className)}>
      <Spinner size={size} variant={variant} />
    </div>
  );
}

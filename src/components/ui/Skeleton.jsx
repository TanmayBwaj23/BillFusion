import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Skeleton loader component for content placeholders
 * 
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Shape variant: 'text', 'circular', 'rectangular'
 */
export function Skeleton({ className, variant = 'rectangular' }) {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md'
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label="Loading content"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * Skeleton for text lines
 */
export function SkeletonText({ lines = 3, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          className={cn(
            'w-full',
            index === lines - 1 && 'w-3/4' // Last line is shorter
          )}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton for a card layout
 */
export function SkeletonCard({ className }) {
  return (
    <div className={cn('rounded-lg border bg-card p-6 space-y-4', className)}>
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton variant="text" className="w-2/3" />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-4/5" />
      </div>
    </div>
  );
}

/**
 * Skeleton for a table row
 */
export function SkeletonTableRow({ columns = 4, className }) {
  return (
    <div className={cn('flex gap-4 py-3', className)}>
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} variant="text" className="flex-1" />
      ))}
    </div>
  );
}

/**
 * Skeleton for a user avatar with text
 */
export function SkeletonAvatar({ withText = true, className }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Skeleton variant="circular" className="h-10 w-10" />
      {withText && (
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" className="w-32" />
          <Skeleton variant="text" className="w-24" />
        </div>
      )}
    </div>
  );
}

/**
 * Skeleton for a form input
 */
export function SkeletonInput({ label = true, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && <Skeleton variant="text" className="w-24 h-4" />}
      <Skeleton className="w-full h-10" />
    </div>
  );
}

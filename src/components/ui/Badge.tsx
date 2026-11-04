'use client';

import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  success:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  warning:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  danger:
    'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  info:
    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
};

export default function Badge({
  variant = 'default',
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full px-2.5 py-0.5
        text-xs font-medium leading-5
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

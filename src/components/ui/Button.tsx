'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-lime-400 text-gray-950 font-bold hover:bg-lime-300 focus:ring-lime-400 shadow-sm shadow-lime-400/20 active:scale-[0.98]',
  secondary:
    'border border-gray-300 bg-white text-gray-800 font-semibold hover:bg-gray-50 focus:ring-lime-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750',
  ghost:
    'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-lime-400 dark:text-gray-300 dark:hover:bg-gray-800',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
  lg: 'px-6 py-3 text-base rounded-lg gap-2.5',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
      )}
      {children}
    </button>
  );
}

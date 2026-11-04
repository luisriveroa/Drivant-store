'use client';

import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X, ExternalLink } from 'lucide-react';
import Button from '@/components/ui/Button';

interface PurchaseResult {
  status: 'success' | 'timeout' | 'error';
  orderId?: string;
  message: string;
}

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: PurchaseResult | null;
}

export default function PurchaseModal({
  isOpen,
  onClose,
  result,
}: PurchaseModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !result) return null;

  const statusConfig = {
    success: {
      icon: CheckCircle,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
      ringColor: 'ring-emerald-200 dark:ring-emerald-800',
      title: 'Order Placed Successfully!',
    },
    timeout: {
      icon: AlertCircle,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/30',
      ringColor: 'ring-amber-200 dark:ring-amber-800',
      title: 'Order Processing',
    },
    error: {
      icon: X,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950/30',
      ringColor: 'ring-red-200 dark:ring-red-800',
      title: 'Order Failed',
    },
  };

  const config = statusConfig[result.status];
  const Icon = config.icon;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4"
        onClick={onClose}
      >
        {/* Modal panel */}
        <div
          className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 animate-in zoom-in-95 fade-in duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Icon */}
          <div className="flex justify-center">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full ring-8 ${config.bgColor} ${config.ringColor}`}
            >
              <Icon className={`h-8 w-8 ${config.iconColor}`} />
            </div>
          </div>

          {/* Title */}
          <h3 className="mt-5 text-center text-xl font-bold text-gray-900 dark:text-white">
            {config.title}
          </h3>

          {/* Message */}
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {result.message}
          </p>

          {/* Order ID (success only) */}
          {result.orderId && (
            <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-800">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Order ID:
              </span>
              <code className="text-sm font-mono font-semibold text-brand-600 dark:text-brand-400">
                {result.orderId}
              </code>
              <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
            </div>
          )}

          {/* Action button */}
          <div className="mt-6">
            <Button
              variant={result.status === 'error' ? 'danger' : 'primary'}
              size="lg"
              className="w-full"
              onClick={onClose}
            >
              {result.status === 'success'
                ? 'Continue Shopping'
                : result.status === 'timeout'
                ? 'Check Orders'
                : 'Try Again'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

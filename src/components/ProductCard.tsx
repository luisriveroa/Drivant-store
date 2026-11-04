'use client';

import React from 'react';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import type { ResaleProduct } from '@/lib/types';

interface ProductCardProps {
  product: ResaleProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasStock = product.inStock;

  const priceDisplay = () => {
    if (product.resaleMinPrice === product.resaleMaxPrice) {
      return `$${product.resaleMinPrice.toFixed(2)}`;
    }
    return `From $${product.resaleMinPrice.toFixed(2)}`;
  };

  return (
    <Link
      href={`/product/${product.productKey}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] dark:border-gray-800 dark:bg-gray-900"
    >
      {/* Image placeholder / gradient header */}
      <div className="relative h-48 w-full bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-950 dark:to-gray-800 flex items-center justify-center overflow-hidden">
        <div className="text-brand-300 dark:text-brand-700 transition-transform duration-300 group-hover:scale-110">
          <svg
            className="h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>

        {/* Category badge */}
        {product.category && (
          <div className="absolute top-3 left-3">
            <Badge variant="info">{product.category}</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Product name */}
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-200">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Spacer */}
        <div className="mt-auto" />

        {/* Price and stock */}
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {priceDisplay()}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                hasStock
                  ? 'bg-emerald-500 shadow-sm shadow-emerald-500/40'
                  : 'bg-red-500 shadow-sm shadow-red-500/40'
              }`}
            />
            <span
              className={`text-xs font-medium ${
                hasStock
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {hasStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>

        {/* View Details button */}
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors duration-200">
            <Eye className="h-4 w-4" />
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}

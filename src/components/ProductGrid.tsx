'use client';

import React from 'react';
import { Package } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import type { ResaleProduct } from '@/lib/types';

interface ProductGridProps {
  products: ResaleProduct[];
  isLoading: boolean;
  /** The catalog failed to load: the page already explains it. */
  hideEmptyState?: boolean;
}

function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 animate-pulse">
      {/* Image placeholder */}
      <div className="h-48 w-full bg-gray-200 dark:bg-gray-800" />

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title */}
        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />

        {/* Description line 1 */}
        <div className="mt-3 h-3 w-full rounded bg-gray-100 dark:bg-gray-800" />
        {/* Description line 2 */}
        <div className="mt-1.5 h-3 w-2/3 rounded bg-gray-100 dark:bg-gray-800" />

        <div className="mt-auto" />

        {/* Price and stock */}
        <div className="mt-4 flex items-end justify-between">
          <div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-16 rounded bg-gray-100 dark:bg-gray-800" />
        </div>

        {/* Button */}
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="h-4 w-24 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid({ products, isLoading, hideEmptyState = false }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (hideEmptyState) return null;

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-6 py-20 text-center dark:border-gray-800 dark:bg-gray-900/50">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <Package className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
          No encontramos productos
        </h3>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          Prueba con otra búsqueda o limpia los filtros.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.productKey} product={product} />
      ))}
    </div>
  );
}

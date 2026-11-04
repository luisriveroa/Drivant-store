'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import ProductBrandIcon, { detectBrand } from '@/components/ProductBrandIcon';
import type { ResaleProduct } from '@/lib/types';

interface ProductCardProps {
  product: ResaleProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasStock = product.inStock;
  const brand = detectBrand(`${product.productKey} ${product.name} ${product.category}`);

  const priceDisplay = () => {
    const min = product.resaleMinPrice ?? product.minPrice ?? 0;
    const max = product.resaleMaxPrice ?? product.maxPrice ?? 0;
    if (min === max) {
      return `$${min.toFixed(2)}`;
    }
    return `From $${min.toFixed(2)}`;
  };

  return (
    <Link
      href={`/product/${product.productKey}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-lime-400 hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-900"
    >
      {/* Header with Brand Icon & Category Badge */}
      <div className="flex items-start justify-between gap-3 mb-4">
        {/* Brand Logo Container */}
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${brand.bgGradient} border ${brand.borderColor} p-2.5 transition-transform duration-300 group-hover:scale-110 shadow-sm`}
        >
          <ProductBrandIcon
            productKey={product.productKey}
            name={product.name}
            category={product.category}
            size="lg"
            className="drop-shadow-sm"
          />
        </div>

        {/* Stock Status Indicator */}
        <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/80">
          <span
            className={`h-2 w-2 rounded-full ${
              hasStock
                ? 'bg-lime-500 shadow-sm shadow-lime-500/50'
                : 'bg-red-500'
            }`}
          />
          <span className={hasStock ? 'text-gray-900 dark:text-gray-100' : 'text-red-600 dark:text-red-400'}>
            {hasStock ? 'In Stock' : 'Sold Out'}
          </span>
        </div>
      </div>

      {/* Brand category label */}
      <span className="text-[11px] font-bold uppercase tracking-wider text-lime-600 dark:text-lime-400 mb-1">
        {brand.label}
      </span>

      {/* Product Name */}
      <h3 className="text-sm font-bold text-gray-950 dark:text-white line-clamp-2 leading-snug group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
        {product.name}
      </h3>

      {/* Description */}
      {product.description && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      )}

      {/* Spacer */}
      <div className="mt-auto pt-5" />

      {/* Footer: Price & CTA */}
      <div className="flex items-end justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-400">Price</span>
          <p className="text-xl font-extrabold text-gray-950 dark:text-white tracking-tight">
            {priceDisplay()}
            <span className="text-xs font-normal text-gray-400 ml-1">USD</span>
          </p>
        </div>

        {/* Action Pill */}
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition-all duration-200 group-hover:bg-lime-400 group-hover:text-black group-hover:rotate-12 dark:bg-gray-800 dark:text-gray-200">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}

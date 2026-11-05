'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Clock, ShieldCheck } from 'lucide-react';
import ProductBrandIcon from '@/components/ProductBrandIcon';
import type { ResaleProduct } from '@/lib/types';

interface ProductCardProps {
  product: ResaleProduct;
}

const NOT_CONFIRMED = 'Se confirma por chat';

export default function ProductCard({ product }: ProductCardProps) {
  const hasStock = product.inStock;
  const min = product.resaleMinPrice ?? product.minPrice ?? 0;
  const max = product.resaleMaxPrice ?? product.maxPrice ?? 0;
  const priceDisplay = min === max ? `$${min.toFixed(2)}` : `Desde $${min.toFixed(2)}`;
  const { duration, warranty } = product.info;

  return (
    <Link
      href={`/product/${encodeURIComponent(product.productKey)}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-200 hover:border-lime-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 dark:border-gray-800 dark:bg-gray-900"
    >
      {/* Brand logo and availability */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <ProductBrandIcon logo={product.logo} brandName={product.brandName} size="lg" />
        <div className="flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 text-[11px] font-bold dark:border-gray-800 dark:bg-gray-800/80">
          <span className={`h-2 w-2 rounded-full ${hasStock ? 'bg-lime-500' : 'bg-red-500'}`} />
          <span className={hasStock ? 'text-gray-900 dark:text-gray-100' : 'text-red-600 dark:text-red-400'}>
            {hasStock ? 'Disponible' : 'Agotado'}
          </span>
        </div>
      </div>

      <span className="mb-1 text-[11px] font-bold uppercase tracking-wider text-lime-700 dark:text-lime-400">
        {product.brandName}
      </span>

      <h3 className="line-clamp-2 text-sm font-bold leading-snug text-gray-950 dark:text-white">{product.name}</h3>

      {/* Same two facts on every card */}
      <dl className="mt-3 space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden="true" />
          <dt className="sr-only">Duración</dt>
          <dd>{duration === NOT_CONFIRMED ? 'Duración por confirmar' : duration}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden="true" />
          <dt className="sr-only">Garantía</dt>
          <dd className="line-clamp-1">
            {warranty === NOT_CONFIRMED ? 'Garantía por confirmar' : `Garantía: ${warranty}`}
          </dd>
        </div>
      </dl>

      <div className="mt-auto pt-5" />

      <div className="flex items-end justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
        <div>
          <span className="text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400">Precio</span>
          <p className="text-xl font-extrabold tracking-tight text-gray-950 dark:text-white">
            {priceDisplay}
            <span className="ml-1 text-xs font-normal text-gray-500 dark:text-gray-400">USD</span>
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition-colors group-hover:bg-lime-400 group-hover:text-black dark:bg-gray-800 dark:text-gray-200">
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}

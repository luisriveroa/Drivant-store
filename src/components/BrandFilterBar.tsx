'use client';

import React, { useMemo, useState } from 'react';
import ProductBrandIcon from './ProductBrandIcon';
import { CATEGORIES } from '@/lib/brands';
import type { ResaleProduct } from '@/lib/types';

const COLLAPSED_BRANDS = 11;

interface BrandFilterBarProps {
  /** Products matching the search, before the category and brand filters. */
  products: ResaleProduct[];
  selectedCategory: string;
  selectedBrand: string;
  onSelectCategory: (categoryId: string) => void;
  onSelectBrand: (brandId: string) => void;
}

const chipClass = (isSelected: boolean) =>
  `flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 ${
    isSelected
      ? 'border-lime-400 bg-lime-400 text-gray-950'
      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-gray-700 dark:hover:bg-gray-800'
  }`;

const countClass = (isSelected: boolean) =>
  `font-semibold ${isSelected ? 'text-gray-800' : 'text-gray-500 dark:text-gray-400'}`;

export default function BrandFilterBar({
  products,
  selectedCategory,
  selectedBrand,
  onSelectCategory,
  onSelectBrand,
}: BrandFilterBarProps) {
  const [showAllBrands, setShowAllBrands] = useState(false);

  const categories = useMemo(
    () =>
      CATEGORIES.map((category) => ({
        ...category,
        count: products.filter((p) => p.categoryId === category.id).length,
      })).filter((category) => category.count > 0 || category.id === selectedCategory),
    [products, selectedCategory]
  );

  const brands = useMemo(() => {
    const byBrand = new Map<string, { id: string; name: string; logo: string | null; count: number }>();
    for (const p of products) {
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) continue;
      const entry = byBrand.get(p.brandId);
      if (entry) entry.count += 1;
      else byBrand.set(p.brandId, { id: p.brandId, name: p.brandName, logo: p.logo, count: 1 });
    }
    return Array.from(byBrand.values()).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [products, selectedCategory]);

  const visibleBrands =
    showAllBrands || brands.length <= COLLAPSED_BRANDS + 1
      ? brands
      : brands
          .slice(0, COLLAPSED_BRANDS)
          .concat(brands.filter((b, i) => i >= COLLAPSED_BRANDS && b.id === selectedBrand));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="mb-2 text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Categoría
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={selectedCategory === 'all'}
            onClick={() => onSelectCategory('all')}
            className={chipClass(selectedCategory === 'all')}
          >
            Todos <span className={countClass(selectedCategory === 'all')}>{products.length}</span>
          </button>
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelectCategory(category.id)}
                className={chipClass(isSelected)}
              >
                {category.name} <span className={countClass(isSelected)}>{category.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {brands.length > 0 && (
        <div>
          <h2 className="mb-2 text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Marca
          </h2>
          <div className="flex flex-wrap gap-2">
            {visibleBrands.map((brand) => {
              const isSelected = selectedBrand === brand.id;
              return (
                <button
                  key={brand.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelectBrand(isSelected ? 'all' : brand.id)}
                  className={chipClass(isSelected)}
                >
                  <ProductBrandIcon logo={brand.logo} brandName={brand.name} size="sm" />
                  {brand.name} <span className={countClass(isSelected)}>{brand.count}</span>
                </button>
              );
            })}
            {brands.length > COLLAPSED_BRANDS + 1 && (
              <button
                type="button"
                aria-expanded={showAllBrands}
                onClick={() => setShowAllBrands((value) => !value)}
                className="rounded-xl px-3 py-2 text-xs font-bold text-lime-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 dark:text-lime-400"
              >
                {showAllBrands ? 'Ver menos' : `Ver todas (${brands.length})`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

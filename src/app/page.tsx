'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Search, RefreshCw } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';
import type { ResaleProduct } from '@/lib/types';

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'Drivant Store';

export default function HomePage() {
  const [products, setProducts] = useState<ResaleProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (selectedCategory) params.set('category', selectedCategory);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || `Failed to fetch products (${res.status})`);
      }

      const fetchedProducts: ResaleProduct[] = data.products || [];
      setProducts(fetchedProducts);

      // Extract unique categories
      if (!selectedCategory && !debouncedSearch && fetchedProducts.length > 0) {
        const uniqueCategories = Array.from(
          new Set(fetchedProducts.map((p) => p.category).filter(Boolean))
        ) as string[];
        setCategories(uniqueCategories);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white border-b border-gray-800">
        {/* Subtle orange accent glow matching Drivant palette */}
        <div className="absolute top-0 right-1/4 h-80 w-80 rounded-full bg-orange-600/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative container-main py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            {/* Logo in Hero */}
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 p-2.5 backdrop-blur-md border border-white/10 shadow-xl">
              <div className="relative h-full w-full">
                <Image
                  src="/logo-icon.png"
                  alt="Drivant"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {storeName}
            </h1>
            <p className="mt-3 text-base text-gray-300 sm:text-lg">
              Cuentas Premium, Herramientas de IA y Productos Digitales con Entrega Instantánea
            </p>

            {/* Search Bar */}
            <div className="mt-8 mx-auto max-w-lg">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar Outlook, Gemini, ChatGPT, Licencias..."
                  className="w-full rounded-2xl border border-gray-700 bg-gray-900/90 py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-400 shadow-xl backdrop-blur-md transition-all focus:border-orange-500 focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-main py-8 sm:py-10">
        {/* Category Filter Bar */}
        {categories.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory('')}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  selectedCategory === ''
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Todos los Productos
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-medium text-red-800">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </button>
          </div>
        )}

        {/* Product Grid */}
        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </div>
  );
}

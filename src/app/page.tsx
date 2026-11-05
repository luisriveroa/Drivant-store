'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Search, RefreshCw, Sparkles } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';
import BrandFilterBar from '@/components/BrandFilterBar';
import { normalizeForSearch } from '@/lib/search';
import type { ResaleProduct } from '@/lib/types';

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'Drivant Store';

export default function HomePage() {
  const [products, setProducts] = useState<ResaleProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch all products
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/products');
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error('No pudimos cargar el catálogo. Intenta de nuevo en unos minutos.');
      }

      const fetchedProducts: ResaleProduct[] = data.products || [];
      setProducts(fetchedProducts);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No pudimos cargar el catálogo.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Every word typed must appear, in any order, ignoring accents and capitals
  const searchedProducts = useMemo(() => {
    const words = normalizeForSearch(debouncedSearch)
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => (word.length > 3 ? word.replace(/s$/, '') : word));
    return products.filter((p) => words.every((word) => p.searchText.includes(word)));
  }, [products, debouncedSearch]);

  const filteredProducts = useMemo(() => {
    const result = searchedProducts.filter(
      (p) =>
        (selectedCategory === 'all' || p.categoryId === selectedCategory) &&
        (selectedBrand === 'all' || p.brandId === selectedBrand)
    );
    // Available products first, in a stable order
    return [...result].sort(
      (a, b) => Number(b.inStock) - Number(a.inStock) || a.brandName.localeCompare(b.brandName) || a.minPrice - b.minPrice
    );
  }, [searchedProducts, selectedCategory, selectedBrand]);

  const hasActiveFilters = Boolean(searchQuery) || selectedCategory !== 'all' || selectedBrand !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedBrand('all');
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0d10]">
      {/* Hero Section — Clean White & Lime Green Theme */}
      <div className="relative overflow-hidden border-b border-gray-200/80 bg-white dark:border-gray-800 dark:bg-[#0f1115]">
        {/* Ambient Lime Neon Glow */}
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-lime-300/20 blur-[100px] pointer-events-none dark:bg-lime-400/10" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-lime-400/15 blur-[80px] pointer-events-none" />

        <div className="relative container-main py-14 sm:py-18 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            {/* Logo Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-lime-300/60 bg-lime-50/80 px-4 py-1.5 mb-6 backdrop-blur-sm dark:border-lime-900/50 dark:bg-lime-950/30">
              <div className="relative h-5 w-5 overflow-hidden rounded">
                <Image
                  src="/logo-perfil.png"
                  alt="Drivant"
                  fill
                  sizes="20px"
                  className="object-contain"
                />
              </div>
              <span className="text-xs font-bold text-gray-900 dark:text-lime-300">
                Drivant Store — Catálogo Oficial
              </span>
              <Sparkles className="h-3.5 w-3.5 text-lime-600 dark:text-lime-400" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-950 dark:text-white">
              Cuentas y Herramientas <br />
              <span className="bg-gradient-to-r from-lime-500 via-lime-600 to-emerald-600 bg-clip-text text-transparent">
                Digitales Premium
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
              Streaming, inteligencia artificial, diseño y productividad. Arma tu carrito y coordina tu pago por WhatsApp o Telegram.
            </p>

            {/* Search Bar */}
            <div className="mt-8 mx-auto max-w-xl">
              <div className="relative flex items-center shadow-lg shadow-gray-200/50 dark:shadow-none rounded-2xl">
                <Search className="absolute left-4.5 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Buscar productos"
                  placeholder="Busca por marca, plan o duración (ej.: Canva, Gemini, 12 meses)"
                  className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-sm font-medium text-gray-900 placeholder-gray-400 transition-all focus:border-lime-500 focus:outline-none focus:ring-4 focus:ring-lime-400/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 text-xs font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container-main py-10">
        {/* Category and brand filters */}
        <div className="mb-6">
          <BrandFilterBar
            products={searchedProducts}
            selectedCategory={selectedCategory}
            selectedBrand={selectedBrand}
            onSelectCategory={handleSelectCategory}
            onSelectBrand={setSelectedBrand}
          />
          <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300" aria-live="polite">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-lime-700 hover:underline dark:text-lime-400"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-semibold text-red-800">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reintentar
            </button>
          </div>
        )}

        {/* Product Grid */}
        <ProductGrid products={filteredProducts} isLoading={isLoading} hideEmptyState={Boolean(error)} />
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Search, RefreshCw, Sparkles } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';
import BrandFilterBar, { BrandFilterOption, POPULAR_BRANDS } from '@/components/BrandFilterBar';
import type { ResaleProduct } from '@/lib/types';

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'Drivant Store';

export default function HomePage() {
  const [products, setProducts] = useState<ResaleProduct[]>([]);
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
        throw new Error(data.error || `Failed to fetch products (${res.status})`);
      }

      const fetchedProducts: ResaleProduct[] = data.products || [];
      setProducts(fetchedProducts);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter products by selected brand and search query
  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by Brand
    if (selectedBrand !== 'all') {
      const brandOption = POPULAR_BRANDS.find((b) => b.id === selectedBrand);
      if (brandOption && brandOption.query) {
        const q = brandOption.query.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.productKey.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
      }
    }

    // Filter by text search
    if (debouncedSearch.trim()) {
      const sq = debouncedSearch.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(sq) ||
          p.productKey.toLowerCase().includes(sq) ||
          p.description.toLowerCase().includes(sq)
      );
    }

    return result;
  }, [products, selectedBrand, debouncedSearch]);

  const handleSelectBrand = (brand: BrandFilterOption) => {
    setSelectedBrand(brand.id);
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
              <div className="relative h-4 w-4">
                <Image
                  src="/logo-icon.png"
                  alt="Drivant"
                  fill
                  sizes="16px"
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
              Outlook, Google AI, Gemini, ChatGPT, Licencias y Cuentas con entrega automatizada al instante.
            </p>

            {/* Search Bar */}
            <div className="mt-8 mx-auto max-w-xl">
              <div className="relative flex items-center shadow-lg shadow-gray-200/50 dark:shadow-none rounded-2xl">
                <Search className="absolute left-4.5 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre (ej: Outlook, Gemini, 12 Months, Canva)..."
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
        {/* Brand Filter Bar with Logos */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Filtrar por Marca o Servicio:
            </h2>
            <span className="text-xs font-semibold text-gray-400">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
            </span>
          </div>
          <BrandFilterBar
            selectedBrand={selectedBrand}
            onSelectBrand={handleSelectBrand}
          />
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
        <ProductGrid products={filteredProducts} isLoading={isLoading} />
      </div>
    </div>
  );
}

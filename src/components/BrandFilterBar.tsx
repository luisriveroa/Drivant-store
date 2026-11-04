'use client';

import React from 'react';
import ProductBrandIcon from './ProductBrandIcon';

export interface BrandFilterOption {
  id: string;
  name: string;
  query: string;
  brandKey: string;
}

export const POPULAR_BRANDS: BrandFilterOption[] = [
  { id: 'all', name: 'Todos los Productos', query: '', brandKey: 'all' },
  { id: 'google', name: 'Google & Gemini', query: 'google', brandKey: 'google' },
  { id: 'microsoft', name: 'Outlook & Microsoft', query: 'outlook', brandKey: 'microsoft' },
  { id: 'openai', name: 'ChatGPT & OpenAI', query: 'chatgpt', brandKey: 'openai' },
  { id: 'netflix', name: 'Netflix & Streaming', query: 'netflix', brandKey: 'netflix' },
  { id: 'canva', name: 'Canva & Diseño', query: 'canva', brandKey: 'canva' },
  { id: 'spotify', name: 'Spotify & Música', query: 'spotify', brandKey: 'spotify' },
  { id: 'telegram', name: 'Telegram & Discord', query: 'telegram', brandKey: 'telegram' },
];

interface BrandFilterBarProps {
  selectedBrand: string;
  onSelectBrand: (brand: BrandFilterOption) => void;
}

export default function BrandFilterBar({ selectedBrand, onSelectBrand }: BrandFilterBarProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {POPULAR_BRANDS.map((brand) => {
          const isSelected = selectedBrand === brand.id;
          return (
            <button
              key={brand.id}
              onClick={() => onSelectBrand(brand)}
              className={`group flex shrink-0 items-center gap-2.5 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all duration-200 border ${
                isSelected
                  ? 'bg-lime-400 text-gray-950 border-lime-400 shadow-md shadow-lime-400/20 scale-[1.02]'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800'
              }`}
            >
              {brand.id === 'all' ? (
                <div className={`h-5 w-5 rounded-md flex items-center justify-center ${isSelected ? 'bg-black text-lime-400' : 'bg-lime-400/20 text-lime-600'}`}>
                  ★
                </div>
              ) : (
                <ProductBrandIcon
                  name={brand.query}
                  productKey={brand.query}
                  size="sm"
                  className="h-4 w-4 shrink-0"
                />
              )}
              <span>{brand.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

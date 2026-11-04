'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Zap } from 'lucide-react';
import { useCartStore } from '@/hooks/useCart';
import CartDrawer from '@/components/CartDrawer';

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'QuantumStore';

export default function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const items = useCartStore((s) => s.items);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-gray-800/60 dark:bg-gray-950/80">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo / Store Name */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              {storeName}
            </span>
          </Link>

          {/* Right side: Admin & Cart buttons */}
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-gray-500 hover:text-brand-600 hover:bg-gray-100 transition"
            >
              Admin Panel
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline text-sm font-medium">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white shadow-sm">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding behind fixed nav */}
      <div className="h-16" />

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/hooks/useCart';
import CartDrawer from '@/components/CartDrawer';

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'Drivant Store';

export default function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const items = useCartStore((s) => s.items);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-gray-200/80 bg-white/90 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/90">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo / Store Name */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
          >
            <div className="relative h-9 w-9 overflow-hidden rounded-xl transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/logo-icon.png"
                alt="Drivant Logo"
                fill
                sizes="36px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold text-gray-950 dark:text-white tracking-tight leading-tight">
                {storeName}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-lime-600 dark:text-lime-400 -mt-0.5">
                Digital Vault
              </span>
            </div>
          </Link>

          {/* Right side: Admin & Cart buttons */}
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600 hover:text-lime-600 hover:bg-gray-100 transition dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Admin Panel
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline text-sm font-semibold">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-lime-400 text-[11px] font-black text-gray-950 shadow-sm shadow-lime-400/50">
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

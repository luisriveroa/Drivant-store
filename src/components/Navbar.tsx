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
      <nav className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-white/10 bg-[#16141F]">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo / Store Name */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
          >
            <div className="relative h-9 w-9 overflow-hidden rounded-xl transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/logo-isotipo-blanco.svg"
                alt=""
                fill
                sizes="36px"
                className="object-contain"
                unoptimized
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold text-[#F4F1EA] tracking-tight leading-tight">
                {storeName}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-lime-400 -mt-0.5">
                Digital Vault
              </span>
            </div>
          </Link>

          {/* Right side: Cart button */}
          <div className="flex items-center gap-2">

            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-[#F4F1EA] transition-colors duration-200 hover:bg-white/10"
              aria-label="Abrir carrito"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline text-sm font-semibold">Carrito</span>
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

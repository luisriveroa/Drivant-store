'use client';

import React, { useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingCart, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/hooks/useCart';
import Button from '@/components/ui/Button';
import ProductBrandIcon from '@/components/ProductBrandIcon';
import { detectBrand } from '@/lib/brands';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function CartItemLogo({ name }: { name: string }) {
  const brand = detectBrand(name);
  return (
    <ProductBrandIcon logo={brand.logo ? `/brands/${brand.logo}` : null} brandName={brand.name} size="lg" />
  );
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getTotal = useCartStore((s) => s.getTotal);

  const total = getTotal();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md transform bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-gray-950 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tu carrito
              </h2>
              {itemCount > 0 && (
                <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-600 px-1.5 text-[11px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              aria-label="Cerrar carrito"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <ShoppingCart className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
                  Tu carrito está vacío
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Explora el catálogo y agrega productos.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-4"
                  onClick={onClose}
                >
                  Seguir comprando
                </Button>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={`${item.productKey}-${item.variantKey}`}
                    className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/50"
                  >
                    <CartItemLogo name={item.productName} />

                    {/* Item details */}
                    <div className="flex flex-1 flex-col min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {item.productName}
                          </p>
                          {item.variantName && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                              {item.variantName}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.productKey, item.variantKey)}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
                          aria-label={`Quitar ${item.productName}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productKey,
                                item.variantKey,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                            aria-label="Quitar una unidad"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="flex h-7 w-8 items-center justify-center text-sm font-medium text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productKey,
                                item.variantKey,
                                item.quantity + 1
                              )
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                            aria-label="Agregar una unidad"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          ${(item.resalePrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer with subtotal and checkout */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ${total.toFixed(2)}
                </span>
              </div>
              <Link href="/cart" onClick={onClose}>
                <Button variant="primary" size="lg" className="w-full">
                  Finalizar pedido
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

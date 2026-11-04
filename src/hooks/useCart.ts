'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/lib/types';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productKey: string, variantKey?: string | null) => void;
  updateQuantity: (productKey: string, variantKey: string | null | undefined, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: CartItem) => {
        set((state) => {
          const vKey = item.variantKey || null;
          const existingIndex = state.items.findIndex(
            (i) => i.productKey === item.productKey && (i.variantKey || null) === vKey
          );

          if (existingIndex >= 0) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + item.quantity,
            };
            return { items: updatedItems };
          }

          return { items: [...state.items, { ...item, variantKey: vKey }] };
        });
      },

      removeItem: (productKey: string, variantKey?: string | null) => {
        const vKey = variantKey || null;
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productKey === productKey && (i.variantKey || null) === vKey)
          ),
        }));
      },

      updateQuantity: (productKey: string, variantKey: string | null | undefined, quantity: number) => {
        const vKey = variantKey || null;
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (i) => !(i.productKey === productKey && (i.variantKey || null) === vKey)
              ),
            };
          }

          return {
            items: state.items.map((i) =>
              i.productKey === productKey && (i.variantKey || null) === vKey
                ? { ...i, quantity }
                : i
            ),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + (item.resalePrice || 0) * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'quantum-cart-storage',
    }
  )
);

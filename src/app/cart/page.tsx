'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CheckCircle,
  Copy,
  Check,
  AlertTriangle,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { useCartStore } from '@/hooks/useCart';
import Button from '@/components/ui/Button';
import { toast } from 'sonner';
import type { DeliveredItem } from '@/lib/types';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState<
    'idle' | 'success' | 'timeout' | 'error'
  >('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [deliveredItems, setDeliveredItems] = useState<DeliveredItem[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const total = getTotal();

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);
    setPurchaseStatus('idle');
    setStatusMessage('');

    try {
      const payload =
        items.length === 1
          ? {
              productKey: items[0].productKey,
              variantKey: items[0].variantKey || undefined,
              quantity: items[0].quantity,
            }
          : {
              items: items.map((i) => ({
                productKey: i.productKey,
                variantKey: i.variantKey || undefined,
                quantity: i.quantity,
              })),
            };

      const res = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 202 || data.status === 'timeout') {
        // TIMEOUT SAFETY: Do not retry POST!
        setPurchaseStatus('timeout');
        setStatusMessage(
          data.message ||
            'Request timed out. The provider may have completed the purchase. Please verify in the Orders panel before attempting again.'
        );
        clearCart();
        return;
      }

      if (!res.ok || data.success === false) {
        setPurchaseStatus('error');
        setStatusMessage(data.error || data.message || 'Failed to process purchase');
        return;
      }

      // Success! Extract delivered goods
      setPurchaseStatus('success');
      clearCart();

      const itemsDelivered: DeliveredItem[] = [];
      if (data.order?.items && Array.isArray(data.order.items)) {
        itemsDelivered.push(...data.order.items);
      } else if (data.order?.results && Array.isArray(data.order.results)) {
        data.order.results.forEach((r: any) => {
          if (r.items && Array.isArray(r.items)) {
            itemsDelivered.push(...r.items);
          }
        });
      }
      setDeliveredItems(itemsDelivered);
      toast.success('Purchase completed successfully!');
    } catch (err: unknown) {
      setPurchaseStatus('error');
      setStatusMessage(err instanceof Error ? err.message : 'Network error occurred');
    } finally {
      setIsCheckingOut(false);
    }
  };

  // 1. Success Delivery View
  if (purchaseStatus === 'success') {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-200 bg-white p-6 sm:p-10 shadow-sm text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-4">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            Order Complete! Here Are Your Goods
          </h1>
          <p className="text-sm text-gray-500 mb-8 max-w-lg mx-auto">
            Your purchase was delivered instantly. Copy your details below. These are only shown once here.
          </p>

          <div className="space-y-6 text-left">
            {deliveredItems.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200/80 pb-3 mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{item.product}</h3>
                    <p className="text-xs text-gray-400">Order ID: {item.orderId}</p>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full">
                    Delivered
                  </span>
                </div>

                {/* Delivered fields list */}
                <div className="space-y-3">
                  {item.fields && item.fields.length > 0 ? (
                    item.fields.map((f, fIdx) => (
                      <div
                        key={fIdx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-white p-3.5 border border-gray-200"
                      >
                        <div>
                          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                            {f.label || f.name}
                          </p>
                          <p className="text-sm font-mono font-medium text-gray-900 break-all">
                            {f.value}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopy(f.value, `${idx}-${fIdx}`)}
                          className="inline-flex items-center gap-1.5 self-start sm:self-center text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg transition"
                        >
                          {copiedKey === `${idx}-${fIdx}` ? (
                            <>
                              <Check className="h-3.5 w-3.5" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" /> Copy
                            </>
                          )}
                        </button>
                      </div>
                    ))
                  ) : (
                    <pre className="text-xs font-mono bg-white p-4 rounded-xl overflow-x-auto">
                      {JSON.stringify(item.data || item, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand-600 mb-6 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Catalog
      </Link>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
        Your Shopping Cart
      </h1>

      {/* Timeout Alert */}
      {purchaseStatus === 'timeout' && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Purchase Request Timed Out</h4>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">{statusMessage}</p>
              <div className="mt-3">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-600 text-white px-3 py-1.5 rounded-lg hover:bg-amber-700 transition"
                >
                  Go to Orders History <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {purchaseStatus === 'error' && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900">
          <div className="flex items-start gap-3">
            <XCircle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Checkout Failed</h4>
              <p className="text-xs text-red-800 mt-1">{statusMessage}</p>
            </div>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 stroke-1 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-1">Your cart is empty</h2>
          <p className="text-sm text-gray-500 mb-6">
            Explore our catalogue of digital tools, services, and accounts.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productKey}-${item.variantKey || 'std'}`}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-base">{item.productName}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Option: {item.variantName || 'Standard'}
                  </p>
                  <p className="text-sm font-bold text-brand-600 mt-1">
                    ${item.resalePrice.toFixed(2)} USD each
                  </p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  {/* Quantity */}
                  <div className="flex items-center rounded-xl border border-gray-200">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productKey,
                          item.variantKey || '',
                          item.quantity - 1
                        )
                      }
                      className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-l-xl transition"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-9 text-center text-xs font-bold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productKey,
                          item.variantKey || '',
                          item.quantity + 1
                        )
                      }
                      className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-r-xl transition"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <span className="text-base font-extrabold text-gray-900 min-w-[70px] text-right">
                    ${(item.resalePrice * item.quantity).toFixed(2)}
                  </span>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.productKey, item.variantKey || '')}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={clearCart}
                className="text-xs text-gray-400 hover:text-red-600 transition"
              >
                Clear entire cart
              </button>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm h-fit">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Order Summary</h3>

            <div className="space-y-2 border-b border-gray-100 pb-4 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Items Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery</span>
                <span className="text-emerald-600 font-semibold">Instant (Free)</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline py-4">
              <span className="text-base font-bold text-gray-900">Total</span>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-gray-900">
                  ${total.toFixed(2)}
                </span>
                <span className="text-xs text-gray-400 ml-1">USD</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center mt-2"
              isLoading={isCheckingOut}
              onClick={handleCheckout}
            >
              Confirm & Pay
            </Button>

            <p className="text-[11px] text-center text-gray-400 mt-4 leading-normal">
              Purchases are immediately fulfilled by QuantumVault API. Credentials will be presented right here upon completion.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

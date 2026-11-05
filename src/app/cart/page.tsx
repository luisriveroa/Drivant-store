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
  MessageCircle,
  Send,
  XCircle,
} from 'lucide-react';
import { useCartStore } from '@/hooks/useCart';
import Button from '@/components/ui/Button';
import ProductBrandIcon from '@/components/ProductBrandIcon';
import { detectBrand } from '@/lib/brands';

type Channel = 'whatsapp' | 'telegram';

const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '59163976897').replace(/\D/g, '');
const telegramUsername = (process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || 'Lfabricio').replace(/^@/, '');

function buildChatUrl(channel: Channel, message: string): string {
  const text = encodeURIComponent(message);
  return channel === 'whatsapp'
    ? `https://wa.me/${whatsappNumber}?text=${text}`
    : `https://t.me/${telegramUsername}?text=${text}`;
}

interface PlacedOrder {
  ref: string;
  total: number;
  chatUrl: string;
  channel: Channel;
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();

  const [customerName, setCustomerName] = useState('');
  const [pendingChannel, setPendingChannel] = useState<Channel | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);

  const total = getTotal();

  const handleOrder = async (channel: Channel) => {
    if (items.length === 0 || pendingChannel) return;

    setPendingChannel(channel);
    setErrorMessage('');

    // Opened before the request: browsers block pop-ups opened after an await.
    const chatWindow = window.open('about:blank', '_blank');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          customerName,
          items: items.map((i) => ({
            productKey: i.productKey,
            variantKey: i.variantKey || undefined,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No pudimos crear tu pedido');

      const chatUrl = buildChatUrl(channel, data.message);
      if (chatWindow) chatWindow.location.href = chatUrl;

      setPlacedOrder({ ref: data.ref, total: data.total, chatUrl, channel });
      clearCart();
    } catch (err: unknown) {
      chatWindow?.close();
      setErrorMessage(err instanceof Error ? err.message : 'Error de conexión');
    } finally {
      setPendingChannel(null);
    }
  };

  // 1. Order sent view
  if (placedOrder) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-100 text-lime-700 mb-4">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            Falta enviar tu pedido
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Envía el mensaje en el chat. Ahí te pasamos el método de pago y, cuando lo confirmemos,
            te entregamos tus productos.
          </p>

          <div className="rounded-2xl bg-gray-50 p-4 mb-6">
            <p className="text-xs text-gray-500">Pedido</p>
            <p className="font-mono font-bold text-gray-900">{placedOrder.ref}</p>
            <p className="mt-2 text-xl font-extrabold text-gray-900">
              ${placedOrder.total.toFixed(2)} <span className="text-xs text-gray-400">USD</span>
            </p>
          </div>

          <a
            href={placedOrder.chatUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-lime-400 px-6 py-3 font-bold text-gray-950 transition hover:bg-lime-300"
          >
            {placedOrder.channel === 'whatsapp' ? (
              <MessageCircle className="h-5 w-5" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            Abrir {placedOrder.channel === 'whatsapp' ? 'WhatsApp' : 'Telegram'}
          </a>

          <Link href="/" className="mt-4 inline-block text-sm font-medium text-gray-500 hover:text-gray-900">
            Seguir comprando
          </Link>
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
        <ArrowLeft className="h-4 w-4" /> Volver al catálogo
      </Link>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
        Tu carrito
      </h1>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900" role="alert">
          <div className="flex items-start gap-3">
            <XCircle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">No se pudo crear el pedido</h4>
              <p className="text-xs text-red-800 mt-1">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 stroke-1 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-1">Tu carrito está vacío</h2>
          <p className="text-sm text-gray-500 mb-6">
            Explora nuestro catálogo de cuentas, herramientas y licencias.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-lime-400 px-6 py-2.5 text-sm font-bold text-gray-950 hover:bg-lime-300 transition"
          >
            Ver productos
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
                <div className="flex flex-1 items-start gap-3">
                  <ProductBrandIcon
                    logo={detectBrand(item.productName).logo ? `/brands/${detectBrand(item.productName).logo}` : null}
                    brandName={detectBrand(item.productName).name}
                  />
                  <div>
                  <h3 className="font-semibold text-gray-900 text-base">{item.productName}</h3>
                  {item.variantName && (
                    <p className="text-xs text-gray-500 mt-0.5">Opción: {item.variantName}</p>
                  )}
                  <p className="text-sm font-bold text-gray-700 mt-1">
                    ${item.resalePrice.toFixed(2)} USD c/u
                  </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  {/* Quantity */}
                  <div className="flex items-center rounded-xl border border-gray-200">
                    <button
                      onClick={() =>
                        updateQuantity(item.productKey, item.variantKey || '', item.quantity - 1)
                      }
                      className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-l-xl transition"
                      aria-label="Quitar una unidad"
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
                          Math.min(50, item.quantity + 1)
                        )
                      }
                      className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-r-xl transition"
                      aria-label="Agregar una unidad"
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
                    aria-label={`Quitar ${item.productName}`}
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
                Vaciar carrito
              </button>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm h-fit">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Resumen</h3>

            <div className="flex justify-between items-baseline border-b border-gray-100 pb-4">
              <span className="text-base font-bold text-gray-900">Total</span>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-gray-900">${total.toFixed(2)}</span>
                <span className="text-xs text-gray-400 ml-1">USD</span>
              </div>
            </div>

            <label htmlFor="customer-name" className="block mt-4 text-xs font-semibold text-gray-600">
              Tu nombre (opcional)
            </label>
            <input
              id="customer-name"
              type="text"
              maxLength={60}
              autoComplete="name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-lime-400"
            />

            <div className="mt-4 space-y-2">
              {whatsappNumber && (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={pendingChannel === 'whatsapp'}
                  disabled={pendingChannel !== null}
                  onClick={() => handleOrder('whatsapp')}
                >
                  {pendingChannel !== 'whatsapp' && <MessageCircle className="h-5 w-5" />}
                  Pedir por WhatsApp
                </Button>
              )}
              {telegramUsername && (
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  isLoading={pendingChannel === 'telegram'}
                  disabled={pendingChannel !== null}
                  onClick={() => handleOrder('telegram')}
                >
                  {pendingChannel !== 'telegram' && <Send className="h-5 w-5" />}
                  Pedir por Telegram
                </Button>
              )}
              {!whatsappNumber && !telegramUsername && (
                <p className="text-sm text-red-700" role="alert">
                  Los pedidos no están disponibles por ahora.
                </p>
              )}
            </div>

            <p className="text-[11px] text-center text-gray-500 mt-4 leading-normal">
              No pagas nada aquí. Te pasamos el método de pago por el chat y entregamos al confirmarlo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

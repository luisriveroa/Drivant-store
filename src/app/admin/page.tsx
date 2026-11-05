'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Wallet,
  ShoppingBag,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldAlert,
  ArrowLeft,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Key,
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { toast } from 'sonner';
import type { OrderSummaryItem, DeliveredItem } from '@/lib/types';

interface SupplierBalance {
  name: string;
  available: boolean;
  balance: number | null;
  currency: string;
}

export default function AdminPage() {
  const [balance, setBalance] = useState<SupplierBalance[]>([]);
  const [orders, setOrders] = useState<OrderSummaryItem[]>([]);
  const [summary, setSummary] = useState<{ totalOrders: number; totalSpent: number } | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DeliveredItem | null>(null);
  const [isLoadingOrderDetail, setIsLoadingOrderDetail] = useState(false);
  const [manualOrderId, setManualOrderId] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [fulfillForm, setFulfillForm] = useState({ productKey: '', variantKey: '', quantity: 1 });
  const [isFulfilling, setIsFulfilling] = useState(false);
  const [fulfilledItems, setFulfilledItems] = useState<DeliveredItem[]>([]);
  const [fulfillWarning, setFulfillWarning] = useState('');
  // Same key for re-sends of one attempt, so a lost response can't charge twice.
  const purchaseAttempt = useRef<{ summary: string; key: string } | null>(null);

  const fetchBalance = useCallback(async () => {
    setIsLoadingBalance(true);
    try {
      const res = await fetch('/api/balance');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setBalance(data.suppliers || []);
    } catch {
      toast.error('Failed to load wallet balance');
    } finally {
      setIsLoadingBalance(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setIsLoadingOrders(true);
    try {
      const res = await fetch('/api/orders?limit=50');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setOrders(data.orders || []);
      if (data.summary) {
        setSummary(data.summary);
      }
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
    fetchOrders();
  }, [fetchBalance, fetchOrders]);

  const loadOrderDetail = async (orderId: string) => {
    setIsLoadingOrderDetail(true);
    setSelectedOrder(null);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId.trim())}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setSelectedOrder(data);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to retrieve order details');
    } finally {
      setIsLoadingOrderDetail(false);
    }
  };

  const handleFulfill = async (e: React.FormEvent) => {
    e.preventDefault();
    const { productKey, variantKey, quantity } = fulfillForm;
    const summary = `${quantity} x ${productKey.trim()}${variantKey.trim() ? ` / ${variantKey.trim()}` : ''}`;
    if (!window.confirm(`¿Comprar ${summary}? Se descuenta de tu saldo de QuantumVault.`)) return;

    if (purchaseAttempt.current?.summary !== summary) {
      purchaseAttempt.current = { summary, key: crypto.randomUUID() };
    }

    setIsFulfilling(true);
    setFulfilledItems([]);
    setFulfillWarning('');
    try {
      const res = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productKey: productKey.trim(),
          variantKey: variantKey.trim() || undefined,
          quantity,
          idempotencyKey: purchaseAttempt.current.key,
        }),
      });
      const data = await res.json();

      // TIMEOUT SAFETY: the purchase may have gone through. Never re-submit.
      if (res.status === 202) {
        setFulfillWarning(data.message);
        fetchOrders();
        return;
      }
      if (!res.ok) {
        purchaseAttempt.current = null;
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      purchaseAttempt.current = null;
      setFulfilledItems(data.order?.items || []);
      if (data.order?.partial) {
        setFulfillWarning(`Entrega parcial: ${data.order.fulfilled} de ${data.order.requested} unidades.`);
      }
      setFulfillForm({ productKey: '', variantKey: '', quantity: 1 });
      fetchBalance();
      fetchOrders();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'No se pudo completar la compra');
    } finally {
      setIsFulfilling(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-600 mb-2 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Storefront
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Drivant Store — Panel de Administración
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Back-office privado conectado a QuantumVault Store API
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              fetchBalance();
              fetchOrders();
            }}
          >
            <RefreshCw className="h-4 w-4" /> Refresh All
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        {/* Wallet Balance */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Wallet Balance
            </span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 space-y-1">
            {isLoadingBalance && balance.length === 0 ? (
              <span className="text-3xl font-extrabold text-gray-900">...</span>
            ) : (
              balance.map((b) => (
                <div key={b.name} className="flex items-baseline justify-between gap-2">
                  <span className="text-xs text-gray-500">{b.name}</span>
                  <span className="text-lg font-extrabold text-gray-900">
                    {b.available ? `$${(b.balance ?? 0).toFixed(2)}` : 'No disponible'}
                  </span>
                </div>
              ))
            )}
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Available to auto-fulfill customer orders
          </p>
        </div>

        {/* Total Orders Fulfilled */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Total Purchases
            </span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900">
              {isLoadingOrders ? '...' : summary?.totalOrders ?? orders.length}
            </span>
            <span className="text-xs text-gray-400">orders</span>
          </div>
          <p className="mt-2 text-xs text-gray-400">Total API transactions processed</p>
        </div>

        {/* Total Spent at Wholesale */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Wholesale Spent
            </span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900">
              {isLoadingOrders ? '...' : `$${(summary?.totalSpent ?? 0).toFixed(2)}`}
            </span>
            <span className="text-xs text-gray-400">USD</span>
          </div>
          <p className="mt-2 text-xs text-gray-400">Cost deducted from wallet</p>
        </div>
      </div>

      {/* Fulfill a paid order */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-brand-600" /> Entregar pedido pagado
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Usa los códigos entre paréntesis del mensaje del pedido. Compra solo cuando el cliente ya haya pagado.
        </p>

        <form onSubmit={handleFulfill} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_90px_auto] gap-3">
          <input
            type="text"
            required
            aria-label="Código de producto"
            placeholder="Código de producto"
            value={fulfillForm.productKey}
            onChange={(e) => setFulfillForm({ ...fulfillForm, productKey: e.target.value })}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <input
            type="text"
            aria-label="Código de opción (si tiene)"
            placeholder="Código de opción (si tiene)"
            value={fulfillForm.variantKey}
            onChange={(e) => setFulfillForm({ ...fulfillForm, variantKey: e.target.value })}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <input
            type="number"
            required
            min={1}
            max={50}
            aria-label="Cantidad"
            value={fulfillForm.quantity}
            onChange={(e) => setFulfillForm({ ...fulfillForm, quantity: Number(e.target.value) })}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <Button variant="primary" size="md" type="submit" isLoading={isFulfilling}>
            Comprar
          </Button>
        </form>

        {fulfillWarning && (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900" role="alert">
            {fulfillWarning}
          </p>
        )}

        {fulfilledItems.length > 0 && (
          <div className="mt-6 space-y-4">
            {fulfilledItems.map((item) => (
              <div key={item.orderId} className="rounded-2xl border border-brand-200 bg-brand-50/40 p-5">
                <h3 className="font-bold text-gray-900">{item.product}</h3>
                <p className="text-xs text-gray-500 mb-3">Order ID: {item.orderId}</p>
                <div className="space-y-2">
                  {item.fields?.map((f) => (
                    <div
                      key={f.name}
                      className="flex items-center justify-between gap-2 rounded-xl bg-white p-3 border border-gray-200"
                    >
                      <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase">{f.label || f.name}</p>
                        <p className="text-sm font-mono font-medium text-gray-900 break-all">{f.value}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(f.value, `${item.orderId}-${f.name}`)}
                        className="inline-flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg transition"
                      >
                        {copiedKey === `${item.orderId}-${f.name}` ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        Copiar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lookup Order / Recover Delivery */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
          <Key className="h-4 w-4 text-brand-600" /> Recover Delivered Credentials (Timeout Fallback)
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          If a purchase ever times out or connection drops, look up the order ID here to fetch the credentials without re-purchasing.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (manualOrderId) loadOrderDetail(manualOrderId);
          }}
          className="flex flex-col sm:flex-row gap-3 max-w-xl"
        >
          <input
            type="text"
            value={manualOrderId}
            onChange={(e) => setManualOrderId(e.target.value)}
            placeholder="e.g. QV-8F3A21C9 or purchaseId"
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <Button
            variant="primary"
            size="md"
            type="submit"
            isLoading={isLoadingOrderDetail}
          >
            <Search className="h-4 w-4" /> Retrieve Details
          </Button>
        </form>

        {/* Selected Order Detail Box */}
        {selectedOrder && (
          <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50/40 p-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-brand-100 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-gray-900">{selectedOrder.product}</h3>
                <p className="text-xs text-gray-500">Order ID: {selectedOrder.orderId}</p>
              </div>
              <Badge variant="success">Retrieved</Badge>
            </div>

            <div className="space-y-3">
              {selectedOrder.fields && selectedOrder.fields.length > 0 ? (
                selectedOrder.fields.map((f, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-white p-3 border border-gray-200"
                  >
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400 uppercase">
                        {f.label || f.name}
                      </p>
                      <p className="text-sm font-mono font-medium text-gray-900 break-all">
                        {f.value}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(f.value, `modal-${i}`)}
                      className="inline-flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg transition self-start sm:self-center"
                    >
                      {copiedKey === `modal-${i}` ? (
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
                <pre className="text-xs bg-white p-3 rounded-lg overflow-x-auto">
                  {JSON.stringify(selectedOrder.data || selectedOrder, null, 2)}
                </pre>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Recent QuantumVault Orders</h2>
          <span className="text-xs text-gray-400">{orders.length} loaded</span>
        </div>

        {isLoadingOrders ? (
          <div className="py-12 flex justify-center">
            <Spinner size="md" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">
            No orders found in this account yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Option</th>
                  <th className="px-6 py-3">Wholesale Cost</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o.orderId} className="hover:bg-gray-50/60 transition">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-900">
                      {o.orderId}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {o.productKey}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {o.variantKey || '—'}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      ${o.price.toFixed(2)} {o.currency}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          o.status === 'completed'
                            ? 'success'
                            : o.status === 'failed'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {o.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(o.date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setManualOrderId(o.orderId);
                          loadOrderDetail(o.orderId);
                        }}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-800"
                      >
                        View Goods
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

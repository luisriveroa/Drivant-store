// ============================================================
// TOD Gifts Store API Client — Server-side ONLY
// ============================================================
import { randomUUID } from 'crypto';
import { isAllowedBrand } from '@/config/catalog-filter';
import { QuantumVaultApiError, QuantumVaultTimeoutError, QuantumVaultNetworkError } from '@/lib/quantum-client';
import type { ApiProduct, BalanceResponse, DeliveredItem, OrderSummaryItem } from '@/lib/types';

/** Prefix on product and order ids, so routes know which supplier owns them. */
const TOD_PREFIX = 'tod--';
const DEFAULT_TIMEOUT_MS = 15_000;
const PURCHASE_TIMEOUT_MS = 30_000;

export function isTodKey(key: string): boolean {
  return key.startsWith(TOD_PREFIX);
}

export function isTodConfigured(): boolean {
  return Boolean(process.env.TOD_API_KEY);
}

function stripPrefix(key: string): string {
  return key.slice(TOD_PREFIX.length);
}

async function request(
  method: string,
  path: string,
  options: { body?: unknown; headers?: Record<string, string>; timeout?: number } = {}
): Promise<{ status: number; data: any }> {
  const baseUrl = (process.env.TOD_BASE_URL || 'https://api-maker-pal-production.up.railway.app').replace(/\/+$/, '');
  const timeout = options.timeout ?? DEFAULT_TIMEOUT_MS;

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${process.env.TOD_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: AbortSignal.timeout(timeout),
      cache: 'no-store',
    });
  } catch (error) {
    // A dropped POST may still have charged the wallet, so it counts as a timeout.
    if (method === 'POST' || (error instanceof DOMException && error.name === 'TimeoutError')) {
      throw new QuantumVaultTimeoutError(`Request to TOD ${path} did not finish`);
    }
    throw new QuantumVaultNetworkError(`Network error while calling TOD ${path}`);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data?.success === false) {
    const message = typeof data?.error === 'string' ? data.error : data?.message;
    throw new QuantumVaultApiError(
      message || `TOD request failed with status ${response.status}`,
      response.ok ? 400 : response.status,
      { message: message || 'TOD request failed' }
    );
  }

  return { status: response.status, data };
}

function cleanDescription(description: unknown): string {
  const text =
    typeof description === 'string' ? description : (description as { text?: string } | null)?.text || '';
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/<[^>]*>/g, '') // Telegram markup such as <blockquote> and <tg-emoji>
    .replace(/\S*t\.me\/\S+/g, '') // Links back to the supplier's channels
    .trim();
}

/** GET /api/v1/products — mapped to the shape the pricing layer expects. */
export async function getTodProducts(): Promise<ApiProduct[]> {
  const { data } = await request('GET', '/api/v1/products');
  const products: any[] = Array.isArray(data?.products) ? data.products : [];

  return products
    .map((p): ApiProduct => {
      const available = Number(p.availability?.available ?? p.available ?? 0);
      return {
        productKey: `${TOD_PREFIX}${p.productId}`,
        name: String(p.name || '').normalize('NFKC').replace(/\s+/g, ' ').trim(),
        description: cleanDescription(p.description),
        currency: 'USD',
        price: Number(p.price?.amount ?? p.amount ?? 0),
        stock: available,
        inStock: Boolean(p.availability?.inStock ?? p.in_stock) && available > 0,
        variants: [],
      };
    })
    .filter((p) => isAllowedBrand(p.name) && (p.price ?? 0) > 0);
}

/** GET /api/v1/balance — amounts are USDT. */
export async function getTodBalance(): Promise<BalanceResponse> {
  const { data } = await request('GET', '/api/v1/balance');
  return { balance: Number(data?.amount ?? data?.balance?.amount ?? 0), currency: data?.currency || 'USDT' };
}

// The docs don't publish the shape of a delivered order, so the delivery is
// shown as received instead of assuming field names.
export function toDeliveredItem(raw: any, productKey?: string, prefix = TOD_PREFIX): DeliveredItem {
  const delivery = raw?.delivery ?? raw?.credentials ?? raw?.codes ?? raw?.accounts ?? raw?.items ?? raw;
  const id = String(raw?.order_id ?? raw?.orderId ?? raw?.id ?? 'unknown');
  const rawProduct = raw?.product_id ?? raw?.productId;

  return {
    orderId: `${prefix}${id}`,
    product: String(raw?.product_name ?? raw?.name ?? raw?.product ?? productKey ?? 'TOD'),
    productKey: rawProduct ? `${prefix}${rawProduct}` : productKey || '',
    price: Number(raw?.total ?? raw?.amount ?? raw?.price ?? 0),
    deliveredAt: String(raw?.created_at ?? raw?.createdAt ?? new Date().toISOString()),
    fields: [
      {
        name: 'delivery',
        label: 'Entrega',
        value: typeof delivery === 'string' ? delivery : JSON.stringify(delivery, null, 2),
      },
    ],
    data: {},
  };
}

/**
 * POST /api/v1/orders. The Idempotency-Key makes re-sending the same attempt safe:
 * the supplier won't charge it twice.
 */
export async function purchaseTod(
  productKey: string,
  quantity: number,
  idempotencyKey?: string
): Promise<{ pending: boolean; item: DeliveredItem; requested: number }> {
  const { status, data } = await request('POST', '/api/v1/orders', {
    body: { product_id: stripPrefix(productKey), quantity },
    headers: { 'Idempotency-Key': idempotencyKey || randomUUID() },
    timeout: PURCHASE_TIMEOUT_MS,
  });

  return { pending: status === 202, item: toDeliveredItem(data?.order ?? data, productKey), requested: quantity };
}

/** GET /api/v1/orders — latest 50. */
export async function getTodOrders(): Promise<OrderSummaryItem[]> {
  const { data } = await request('GET', '/api/v1/orders');
  const orders: any[] = Array.isArray(data?.orders) ? data.orders : [];

  return orders.map((o) => ({
    orderId: `${TOD_PREFIX}${o.order_id ?? o.orderId ?? o.id}`,
    productKey: `${TOD_PREFIX}${o.product_id ?? o.productId ?? ''}`,
    price: Number(o.total ?? o.amount ?? o.price?.amount ?? o.price ?? 0),
    currency: o.currency || 'USDT',
    status: String(o.status ?? 'unknown'),
    date: String(o.created_at ?? o.createdAt ?? o.date ?? ''),
  }));
}

/** GET /api/v1/orders/{order_id} — single order, with delivery. */
export async function getTodOrder(orderKey: string): Promise<DeliveredItem> {
  const { data } = await request('GET', `/api/v1/orders/${encodeURIComponent(stripPrefix(orderKey))}`);
  return toDeliveredItem(data?.order ?? data);
}

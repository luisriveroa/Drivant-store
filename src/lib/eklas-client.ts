// ============================================================
// Eklas API Client — Server-side ONLY
// ============================================================
import { randomUUID } from 'crypto';
import { QuantumVaultApiError, QuantumVaultTimeoutError, QuantumVaultNetworkError } from '@/lib/quantum-client';
import type { ApiProduct, BalanceResponse, DeliveredItem, OrderSummaryItem } from '@/lib/types';

/** Prefix on product and order ids, so routes know which supplier owns them. */
const EKLAS_PREFIX = 'eklas--';
const DEFAULT_TIMEOUT_MS = 15_000;
const PURCHASE_TIMEOUT_MS = 30_000;

export function isEklasKey(key: string): boolean {
  return key.startsWith(EKLAS_PREFIX);
}

export function isEklasConfigured(): boolean {
  return Boolean(process.env.EKLAS_API_KEY);
}

async function request(method: string, path: string, body?: unknown): Promise<any> {
  const baseUrl = (process.env.EKLAS_BASE_URL || 'https://api.eklas.dev/v1').replace(/\/+$/, '');

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${process.env.EKLAS_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(method === 'POST' ? PURCHASE_TIMEOUT_MS : DEFAULT_TIMEOUT_MS),
      cache: 'no-store',
    });
  } catch (error) {
    // A dropped POST may still have charged the wallet, so it counts as a timeout.
    if (method === 'POST' || (error instanceof DOMException && error.name === 'TimeoutError')) {
      throw new QuantumVaultTimeoutError(`Request to Eklas ${path} did not finish`);
    }
    throw new QuantumVaultNetworkError(`Network error while calling Eklas ${path}`);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data?.success === false) {
    const message = data?.error?.message || `Eklas request failed with status ${response.status}`;
    throw new QuantumVaultApiError(message, response.ok ? 400 : response.status, {
      message,
      error: data?.error?.code,
    });
  }

  return data?.data;
}

/** GET /products — paged, up to 100 per page. */
export async function getEklasProducts(): Promise<ApiProduct[]> {
  const products: any[] = [];
  for (let page = 1; page <= 10; page++) {
    const batch = await request('GET', `/products?limit=100&page=${page}`);
    if (!Array.isArray(batch) || batch.length === 0) break;
    products.push(...batch);
    if (batch.length < 100) break;
  }

  return products
    // Products that need extra customer details at checkout can't be bought from the admin form.
    .filter((p) => !Array.isArray(p.requires) || p.requires.length === 0)
    .map((p): ApiProduct => {
      const stock = p.unlimited_stock ? 999 : Number(p.stock ?? 0);
      return {
        productKey: `${EKLAS_PREFIX}${p.id}`,
        name: String(p.name || '').normalize('NFKC').replace(/\s+/g, ' ').trim(),
        description: String(p.description || ''),
        currency: 'USD',
        price: Number(p.price ?? 0),
        stock,
        unlimited: Boolean(p.unlimited_stock),
        inStock: Boolean(p.in_stock) && stock > 0,
        variants: [],
      };
    })
    .filter((p) => (p.price ?? 0) > 0);
}

/** GET /balance — amounts are USDT. */
export async function getEklasBalance(): Promise<BalanceResponse> {
  const data = await request('GET', '/balance');
  return { balance: Number(data?.balance ?? 0), currency: data?.currency || 'USDT' };
}

function toDeliveredItem(order: any, productKey?: string): DeliveredItem {
  const items: string[] = Array.isArray(order?.items) ? order.items : [];
  return {
    orderId: `${EKLAS_PREFIX}${order?.id ?? 'unknown'}`,
    product: String(order?.product_name ?? productKey ?? 'Eklas'),
    productKey: order?.product_id ? `${EKLAS_PREFIX}${order.product_id}` : productKey || '',
    price: Number(order?.total_price ?? 0),
    deliveredAt: String(order?.created_at ?? new Date().toISOString()),
    fields: items.map((value, i) => ({ name: `item_${i + 1}`, label: `Artículo ${i + 1}`, value: String(value) })),
    data: {},
  };
}

/**
 * POST /orders. Re-sending the same client_order_id returns the same order
 * instead of charging twice, so the admin form reuses it for one attempt.
 */
export async function purchaseEklas(
  productKey: string,
  quantity: number,
  idempotencyKey?: string
): Promise<{ pending: boolean; item: DeliveredItem; requested: number }> {
  const order = await request('POST', '/orders', {
    product_id: Number(productKey.slice(EKLAS_PREFIX.length)),
    quantity,
    client_order_id: idempotencyKey || randomUUID(),
  });

  return { pending: order?.status !== 'completed', item: toDeliveredItem(order, productKey), requested: quantity };
}

/** GET /orders — newest first, without the delivered items. */
export async function getEklasOrders(): Promise<OrderSummaryItem[]> {
  const orders = await request('GET', '/orders?limit=100');
  return (Array.isArray(orders) ? orders : []).map((o: any) => ({
    orderId: `${EKLAS_PREFIX}${o.id}`,
    productKey: o.product_name ? String(o.product_name) : '',
    price: Number(o.total_price ?? 0),
    currency: 'USDT',
    status: String(o.status ?? 'unknown'),
    date: String(o.created_at ?? ''),
  }));
}

/** GET /orders/{id} — with the delivered items. */
export async function getEklasOrder(orderKey: string): Promise<DeliveredItem> {
  const order = await request('GET', `/orders/${encodeURIComponent(orderKey.slice(EKLAS_PREFIX.length))}`);
  return toDeliveredItem(order);
}

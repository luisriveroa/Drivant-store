// ============================================================
// Addyocart API Client — Server-side ONLY
// ============================================================
import { isAllowedBrand } from '@/config/catalog-filter';
import { QuantumVaultApiError, QuantumVaultTimeoutError, QuantumVaultNetworkError } from '@/lib/quantum-client';
import { toDeliveredItem } from '@/lib/tod-client';
import type { ApiProduct, BalanceResponse, DeliveredItem } from '@/lib/types';

/** Prefix on product ids, so routes know which supplier owns them. */
const ADDYO_PREFIX = 'addyo--';
const DEFAULT_TIMEOUT_MS = 15_000;
const PURCHASE_TIMEOUT_MS = 30_000;

export function isAddyoKey(key: string): boolean {
  return key.startsWith(ADDYO_PREFIX);
}

export function isAddyoConfigured(): boolean {
  return Boolean(process.env.ADDYO_API_KEY);
}

async function request(action: string, body?: unknown): Promise<any> {
  const baseUrl = process.env.ADDYO_BASE_URL || 'https://addyocart.com/api/v1/index.php?vendor_id=60';
  const method = body ? 'POST' : 'GET';

  let response: Response;
  try {
    response = await fetch(`${baseUrl}&action=${action}`, {
      method,
      headers: {
        Authorization: `Bearer ${process.env.ADDYO_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(body ? PURCHASE_TIMEOUT_MS : DEFAULT_TIMEOUT_MS),
      cache: 'no-store',
    });
  } catch (error) {
    // A dropped POST may still have charged the wallet, so it counts as a timeout.
    if (method === 'POST' || (error instanceof DOMException && error.name === 'TimeoutError')) {
      throw new QuantumVaultTimeoutError(`Request to Addyocart ${action} did not finish`);
    }
    throw new QuantumVaultNetworkError(`Network error while calling Addyocart ${action}`);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data?.success === false || data?.ok === false) {
    const message = typeof data?.error === 'string' ? data.error : data?.message;
    throw new QuantumVaultApiError(
      message || `Addyocart request failed with status ${response.status}`,
      response.ok ? 400 : response.status,
      { message: message || 'Addyocart request failed' }
    );
  }

  return data;
}

/** action=products — mapped to the shape the pricing layer expects. */
export async function getAddyoProducts(): Promise<ApiProduct[]> {
  const data = await request('products');
  const products: any[] = Array.isArray(data?.products) ? data.products : [];

  return products
    .map((p): ApiProduct => {
      const name = String(p.name || '').normalize('NFKC').replace(/\s+/g, ' ').trim();
      const description = String(p.short_description || '').trim();
      const stock = Number(p.stock ?? 0);
      return {
        productKey: `${ADDYO_PREFIX}${p.id}`,
        name,
        description: description === name ? '' : description,
        currency: 'USD',
        price: Number(p.yourPrice ?? p.price ?? 0),
        stock,
        inStock: Boolean(p.in_stock) && stock > 0,
        variants: [],
      };
    })
    .filter((p) => isAllowedBrand(p.name) && (p.price ?? 0) > 0);
}

/** action=balance */
export async function getAddyoBalance(): Promise<BalanceResponse> {
  const data = await request('balance');
  return { balance: Number(data?.balance ?? data?.wallet_balance ?? 0), currency: data?.currency || 'USD' };
}

/**
 * action=order. This API has no idempotency key and no order history, so the
 * response is the only copy of the delivery and an unanswered call must not be
 * re-sent: it has to be checked in the supplier's bot.
 */
export async function purchaseAddyo(
  productKey: string,
  quantity: number
): Promise<{ item: DeliveredItem; requested: number }> {
  const data = await request('order', {
    product_id: Number(productKey.slice(ADDYO_PREFIX.length)),
    quantity,
  });

  return { item: toDeliveredItem(data?.order ?? data, productKey, ADDYO_PREFIX), requested: quantity };
}

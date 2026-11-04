// ============================================================
// Products In-Memory Cache with Stale-While-Revalidate
// ============================================================
// Prevents spamming QuantumVault with repeated 930+ product queries,
// protects against temporary 503 errors and Cloudflare rate limits.
// ============================================================

import { getQuantumClient } from '@/lib/quantum-client';
import { applyResalePricingBulk } from '@/lib/pricing';
import type { ApiProduct, ResaleProduct } from '@/lib/types';

let cachedResaleProducts: ResaleProduct[] | null = null;
let lastCacheTimestamp = 0;
let ongoingFetchPromise: Promise<ResaleProduct[]> | null = null;

const CACHE_TTL_MS = 60 * 1000; // 60 seconds fresh cache

export async function getCachedProducts(): Promise<ResaleProduct[]> {
  const now = Date.now();

  // 1. Return fresh in-memory cache if still valid
  if (cachedResaleProducts && now - lastCacheTimestamp < CACHE_TTL_MS) {
    return cachedResaleProducts;
  }

  // 2. If a fetch is already in flight, reuse it to avoid concurrent stampede
  if (ongoingFetchPromise) {
    try {
      return await ongoingFetchPromise;
    } catch {
      if (cachedResaleProducts) return cachedResaleProducts;
    }
  }

  // 3. Initiate fetch with retry and fallback
  ongoingFetchPromise = (async () => {
    try {
      const client = getQuantumClient();
      const data = await client.getProducts();

      let raw: ApiProduct[] = [];
      if (Array.isArray(data)) {
        raw = data;
      } else if (data && typeof data === 'object' && Array.isArray((data as any).products)) {
        raw = (data as any).products;
      }

      if (raw.length > 0) {
        const resale = applyResalePricingBulk(raw);
        cachedResaleProducts = resale;
        lastCacheTimestamp = Date.now();
        return resale;
      }

      // If empty but had previous cache, use it
      if (cachedResaleProducts) return cachedResaleProducts;
      return [];
    } catch (err) {
      console.warn('[ProductsCache] Upstream fetch failed, checking fallback:', err);
      // If we have stale cache, return it instead of throwing 503
      if (cachedResaleProducts && cachedResaleProducts.length > 0) {
        console.info('[ProductsCache] Serving stale cache due to upstream error.');
        return cachedResaleProducts;
      }
      throw err;
    } finally {
      ongoingFetchPromise = null;
    }
  })();

  return ongoingFetchPromise;
}

export function findProductInCache(productKey: string): ResaleProduct | undefined {
  if (!cachedResaleProducts) return undefined;
  return cachedResaleProducts.find((p) => p.productKey === productKey);
}

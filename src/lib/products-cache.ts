// ============================================================
// Products In-Memory Cache with Stale-While-Revalidate
// ============================================================
// Prevents spamming suppliers with repeated catalogue queries, and keeps the
// store selling when a supplier goes down: each one is cached on its own and
// a failure only falls back to that supplier's last good catalogue.
// ============================================================

import { getQuantumClient } from '@/lib/quantum-client';
import { getTodProducts, isTodConfigured } from '@/lib/tod-client';
import { getAddyoProducts, isAddyoConfigured } from '@/lib/addyo-client';
import { getEklasProducts, isEklasConfigured } from '@/lib/eklas-client';
import { applyResalePricingBulk } from '@/lib/pricing';
import { isListable } from '@/config/catalog-filter';
import type { ApiProduct, ResaleProduct } from '@/lib/types';

const CACHE_TTL_MS = 60 * 1000; // 60 seconds fresh cache

async function fetchQuantumVaultProducts(): Promise<ApiProduct[]> {
  const data = await getQuantumClient().getProducts();
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && Array.isArray((data as any).products)) {
    return (data as any).products;
  }
  return [];
}

const suppliers: Array<{ id: string; enabled: () => boolean; fetch: () => Promise<ApiProduct[]> }> = [
  { id: 'quantumvault', enabled: () => true, fetch: fetchQuantumVaultProducts },
  { id: 'tod', enabled: isTodConfigured, fetch: getTodProducts },
  { id: 'addyo', enabled: isAddyoConfigured, fetch: getAddyoProducts },
  { id: 'eklas', enabled: isEklasConfigured, fetch: getEklasProducts },
];

const catalogBySupplier = new Map<string, ResaleProduct[]>();
let cachedResaleProducts: ResaleProduct[] | null = null;
let lastCacheTimestamp = 0;
let ongoingFetchPromise: Promise<ResaleProduct[]> | null = null;

export async function getCachedProducts(): Promise<ResaleProduct[]> {
  const now = Date.now();

  // 1. Return fresh in-memory cache if still valid
  if (cachedResaleProducts && now - lastCacheTimestamp < CACHE_TTL_MS) {
    return cachedResaleProducts;
  }

  // 2. If a fetch is already in flight, reuse it to avoid concurrent stampede
  if (ongoingFetchPromise) return ongoingFetchPromise;

  // 3. Refresh every supplier; a failure keeps that supplier's previous catalogue
  ongoingFetchPromise = (async () => {
    try {
      const active = suppliers.filter((s) => s.enabled());
      const results = await Promise.allSettled(active.map((s) => s.fetch()));

      let firstError: unknown = null;
      let anySucceeded = false;
      results.forEach((result, index) => {
        const { id } = active[index];
        if (result.status === 'fulfilled') {
          anySucceeded = true;
          const listable = result.value.filter((p) => isListable(p.name, p.description));
          if (listable.length > 0) catalogBySupplier.set(id, applyResalePricingBulk(listable));
        } else {
          firstError = firstError ?? result.reason;
          console.warn(`[ProductsCache] ${id} fetch failed, checking fallback:`, result.reason);
        }
      });

      const merged = Array.from(catalogBySupplier.values()).flat();
      if (!anySucceeded && merged.length === 0) throw firstError;

      cachedResaleProducts = merged;
      lastCacheTimestamp = Date.now();
      return merged;
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

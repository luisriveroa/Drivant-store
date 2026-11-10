import { NextRequest, NextResponse } from 'next/server';
import { getQuantumClient, QuantumVaultTimeoutError, QuantumVaultApiError } from '@/lib/quantum-client';
import { applyResalePricing } from '@/lib/pricing';
import { findProductInCache, getCachedProducts } from '@/lib/products-cache';
import { isTodKey } from '@/lib/tod-client';
import { isAddyoKey } from '@/lib/addyo-client';
import { isListable } from '@/config/catalog-filter';
import { isEklasKey } from '@/lib/eklas-client';

export async function GET(
  request: NextRequest,
  { params }: { params: { productKey: string } | Promise<{ productKey: string }> }
): Promise<NextResponse> {
  const resolvedParams = await params;
  const { productKey } = resolvedParams;

  // These suppliers have no detail endpoint: the catalogue entry is the full product.
  if (isTodKey(productKey) || isAddyoKey(productKey) || isEklasKey(productKey)) {
    try {
      const product = (await getCachedProducts()).find((p) => p.productKey === productKey);
      return product
        ? NextResponse.json(product)
        : NextResponse.json({ error: 'Product not found' }, { status: 404 });
    } catch {
      return NextResponse.json({ error: 'Failed to fetch product' }, { status: 503 });
    }
  }

  try {
    const client = getQuantumClient();
    const rawProduct = await client.getProduct(productKey);

    if (rawProduct && !isListable(rawProduct.name, rawProduct.description)) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (rawProduct) {
      const resaleProduct = applyResalePricing(rawProduct);
      return NextResponse.json(resaleProduct);
    }
  } catch (error: unknown) {
    console.warn(`[API /products/[productKey]] Detail fetch failed for ${productKey}, checking cache fallback:`, error);
    // Fallback: check if we already have it in cached catalogue
    const cached = findProductInCache(productKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    if (error instanceof QuantumVaultApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    if (error instanceof QuantumVaultTimeoutError) {
      return NextResponse.json({ error: 'Upstream QuantumVault API timed out' }, { status: 504 });
    }
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }

  const cached = findProductInCache(productKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  return NextResponse.json({ error: 'Product not found' }, { status: 404 });
}

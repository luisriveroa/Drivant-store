import { NextRequest, NextResponse } from 'next/server';
import { getQuantumClient, QuantumVaultTimeoutError, QuantumVaultApiError } from '@/lib/quantum-client';
import { applyResalePricingBulk } from '@/lib/pricing';
import type { ApiProduct } from '@/lib/types';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search')?.toLowerCase();

    const client = getQuantumClient();
    const data = await client.getProducts();

    let rawProducts: ApiProduct[] = [];
    if (Array.isArray(data)) {
      rawProducts = data;
    } else if (data && typeof data === 'object' && Array.isArray((data as any).products)) {
      rawProducts = (data as any).products;
    }

    // Filter by category if requested
    if (category) {
      rawProducts = rawProducts.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search query if requested
    if (search) {
      rawProducts = rawProducts.filter(
        (p) =>
          p.name?.toLowerCase().includes(search) ||
          p.description?.toLowerCase().includes(search) ||
          p.productKey?.toLowerCase().includes(search)
      );
    }

    // Apply profit margin to base wholesale prices
    const resaleProducts = applyResalePricingBulk(rawProducts);

    return NextResponse.json({
      products: resaleProducts,
      total: resaleProducts.length,
    });
  } catch (error: unknown) {
    if (error instanceof QuantumVaultApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    if (error instanceof QuantumVaultTimeoutError) {
      return NextResponse.json({ error: 'Upstream QuantumVault API timed out' }, { status: 504 });
    }
    console.error('[API /products] Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch catalog';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

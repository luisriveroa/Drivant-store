import { NextRequest, NextResponse } from 'next/server';
import { QuantumVaultTimeoutError, QuantumVaultApiError } from '@/lib/quantum-client';
import { getCachedProducts } from '@/lib/products-cache';
import type { ResaleProduct } from '@/lib/types';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search')?.toLowerCase();

    let products: ResaleProduct[] = await getCachedProducts();

    // Filter by category if requested
    if (category) {
      products = products.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search query if requested
    if (search) {
      products = products.filter(
        (p) =>
          p.name?.toLowerCase().includes(search) ||
          p.description?.toLowerCase().includes(search) ||
          p.productKey?.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      products,
      total: products.length,
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

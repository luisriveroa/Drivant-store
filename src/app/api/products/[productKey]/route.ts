import { NextRequest, NextResponse } from 'next/server';
import { getQuantumClient, QuantumVaultTimeoutError, QuantumVaultApiError } from '@/lib/quantum-client';
import { applyResalePricing } from '@/lib/pricing';

export async function GET(
  request: NextRequest,
  { params }: { params: { productKey: string } | Promise<{ productKey: string }> }
): Promise<NextResponse> {
  try {
    const resolvedParams = await params;
    const { productKey } = resolvedParams;

    const client = getQuantumClient();
    const rawProduct = await client.getProduct(productKey);

    if (!rawProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const resaleProduct = applyResalePricing(rawProduct);
    return NextResponse.json(resaleProduct);
  } catch (error: unknown) {
    if (error instanceof QuantumVaultApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    if (error instanceof QuantumVaultTimeoutError) {
      return NextResponse.json({ error: 'Upstream QuantumVault API timed out' }, { status: 504 });
    }
    console.error('[API /products/[productKey]] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getQuantumClient, QuantumVaultTimeoutError, QuantumVaultApiError } from '@/lib/quantum-client';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');

    const client = getQuantumClient();
    const orders = await client.getOrders(limit ? { limit: parseInt(limit, 10) } : undefined);

    return NextResponse.json(orders);
  } catch (error: unknown) {
    if (error instanceof QuantumVaultApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    if (error instanceof QuantumVaultTimeoutError) {
      return NextResponse.json({ error: 'Upstream QuantumVault API timed out' }, { status: 504 });
    }
    console.error('[API /orders] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

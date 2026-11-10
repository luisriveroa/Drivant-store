import { NextRequest, NextResponse } from 'next/server';
import { getQuantumClient, QuantumVaultTimeoutError, QuantumVaultApiError } from '@/lib/quantum-client';
import { getTodOrder, isTodKey } from '@/lib/tod-client';
import { getEklasOrder, isEklasKey } from '@/lib/eklas-client';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } | Promise<{ orderId: string }> }
): Promise<NextResponse> {
  try {
    const resolvedParams = await params;
    const { orderId } = resolvedParams;

    if (isEklasKey(orderId)) {
      return NextResponse.json(await getEklasOrder(orderId));
    }

    if (isTodKey(orderId)) {
      return NextResponse.json(await getTodOrder(orderId));
    }

    const client = getQuantumClient();
    const order = await client.getOrder(orderId);

    return NextResponse.json(order);
  } catch (error: unknown) {
    if (error instanceof QuantumVaultApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    if (error instanceof QuantumVaultTimeoutError) {
      return NextResponse.json({ error: 'Upstream QuantumVault API timed out' }, { status: 504 });
    }
    console.error('[API /orders/[orderId]] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch order detail' }, { status: 500 });
  }
}

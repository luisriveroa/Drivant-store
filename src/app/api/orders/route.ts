import { NextRequest, NextResponse } from 'next/server';
import { getQuantumClient } from '@/lib/quantum-client';
import { getTodOrders, isTodConfigured } from '@/lib/tod-client';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const limit = new URL(request.url).searchParams.get('limit');

  const [quantumVault, tod] = await Promise.allSettled([
    getQuantumClient().getOrders(limit ? { limit: parseInt(limit, 10) } : undefined),
    isTodConfigured() ? getTodOrders() : Promise.resolve([]),
  ]);

  if (quantumVault.status === 'rejected' && tod.status === 'rejected') {
    console.error('[API /orders] Error:', quantumVault.reason, tod.reason);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 502 });
  }

  const quantumVaultOrders = quantumVault.status === 'fulfilled' ? quantumVault.value : null;
  const todOrders = tod.status === 'fulfilled' ? tod.value : [];

  const orders = [...(quantumVaultOrders?.orders || []), ...todOrders].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return NextResponse.json({
    orders,
    summary: {
      totalOrders: (quantumVaultOrders?.summary?.totalOrders ?? 0) + todOrders.length,
      totalSpent:
        (quantumVaultOrders?.summary?.totalSpent ?? 0) + todOrders.reduce((sum, o) => sum + o.price, 0),
      currency: 'USD',
    },
  });
}

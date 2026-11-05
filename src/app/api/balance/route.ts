import { NextResponse } from 'next/server';
import { getQuantumClient } from '@/lib/quantum-client';
import { getTodBalance, isTodConfigured } from '@/lib/tod-client';
import { getAddyoBalance, isAddyoConfigured } from '@/lib/addyo-client';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  const suppliers = [
    { name: 'QuantumVault', fetch: () => getQuantumClient().getBalance() },
    ...(isTodConfigured() ? [{ name: 'TOD Gifts', fetch: getTodBalance }] : []),
    ...(isAddyoConfigured() ? [{ name: 'Addyocart', fetch: getAddyoBalance }] : []),
  ];

  const results = await Promise.allSettled(suppliers.map((s) => s.fetch()));

  return NextResponse.json({
    suppliers: results.map((result, index) => ({
      name: suppliers[index].name,
      available: result.status === 'fulfilled',
      balance: result.status === 'fulfilled' ? result.value.balance : null,
      currency: result.status === 'fulfilled' ? result.value.currency || 'USD' : 'USD',
    })),
  });
}

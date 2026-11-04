import { NextRequest, NextResponse } from 'next/server';
import { getQuantumClient, QuantumVaultTimeoutError, QuantumVaultApiError } from '@/lib/quantum-client';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const client = getQuantumClient();
    const balance = await client.getBalance();

    return NextResponse.json(balance);
  } catch (error: unknown) {
    if (error instanceof QuantumVaultApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    if (error instanceof QuantumVaultTimeoutError) {
      return NextResponse.json({ error: 'Request to upstream service timed out' }, { status: 504 });
    }
    console.error('[API /balance] Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch balance';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

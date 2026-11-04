import { NextRequest, NextResponse } from 'next/server';
import { getQuantumClient, QuantumVaultTimeoutError, QuantumVaultApiError } from '@/lib/quantum-client';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Payload can be either single { productKey, variantKey?, quantity? } or bulk { items: [...] }
    let purchasePayload: any;

    if (Array.isArray(body.items)) {
      if (body.items.length === 0) {
        return NextResponse.json({ error: 'Items list cannot be empty' }, { status: 400 });
      }
      for (const item of body.items) {
        if (!item.productKey) {
          return NextResponse.json({ error: 'Each item must have a productKey' }, { status: 400 });
        }
      }
      purchasePayload = {
        items: body.items.map((i: any) => ({
          productKey: i.productKey,
          ...(i.variantKey ? { variantKey: i.variantKey } : {}),
          quantity: Math.max(1, parseInt(i.quantity || 1, 10)),
        })),
      };
    } else if (body.productKey) {
      purchasePayload = {
        productKey: body.productKey,
        ...(body.variantKey ? { variantKey: body.variantKey } : {}),
        quantity: Math.max(1, parseInt(body.quantity || 1, 10)),
      };
    } else {
      return NextResponse.json(
        { error: 'Invalid request: must provide productKey or items array' },
        { status: 400 }
      );
    }

    const client = getQuantumClient();
    const result = await client.purchase(purchasePayload);

    return NextResponse.json(result);
  } catch (error: unknown) {
    // CRITICAL: On timeout or network drop, NEVER RETRY the POST!
    // The purchase might have succeeded on the provider side and funds deducted.
    if (error instanceof QuantumVaultTimeoutError) {
      return NextResponse.json(
        {
          status: 'timeout',
          message:
            'The purchase request timed out. DO NOT re-submit to avoid duplicate charges. Please check your Orders history to verify if the delivery was generated.',
          checkOrdersUrl: '/admin',
        },
        { status: 202 }
      );
    }

    if (error instanceof QuantumVaultApiError) {
      return NextResponse.json(
        { error: error.message, details: error.details },
        { status: error.statusCode }
      );
    }

    console.error('[API /purchase] Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing the purchase' },
      { status: 500 }
    );
  }
}

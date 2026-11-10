import { NextRequest, NextResponse } from 'next/server';
import { getQuantumClient, QuantumVaultTimeoutError, QuantumVaultApiError } from '@/lib/quantum-client';
import { isTodKey, purchaseTod } from '@/lib/tod-client';
import { isAddyoKey, purchaseAddyo } from '@/lib/addyo-client';
import { isEklasKey, purchaseEklas } from '@/lib/eklas-client';
import { getCachedProducts } from '@/lib/products-cache';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    if (
      Array.isArray(body.items) &&
      body.items.some((i: any) => /^(tod|addyo|eklas)--/.test(String(i?.productKey)))
    ) {
      return NextResponse.json({ error: 'These products must be bought one at a time' }, { status: 400 });
    }

    if (typeof body.productKey === 'string' && isAddyoKey(body.productKey)) {
      const products = await getCachedProducts();
      if (!products.some((p) => p.productKey === body.productKey)) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      const quantity = Math.min(50, Math.max(1, parseInt(body.quantity || 1, 10)));
      const { item, requested } = await purchaseAddyo(body.productKey, quantity);

      return NextResponse.json({
        success: true,
        order: { requested, fulfilled: requested, totalCharged: item.price, currency: 'USD', items: [item] },
      });
    }

    if (typeof body.productKey === 'string' && isEklasKey(body.productKey)) {
      const products = await getCachedProducts();
      if (!products.some((p) => p.productKey === body.productKey)) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      const quantity = Math.min(50, Math.max(1, parseInt(body.quantity || 1, 10)));
      const { pending, item, requested } = await purchaseEklas(body.productKey, quantity, body.idempotencyKey);

      if (pending) {
        return NextResponse.json(
          {
            status: 'pending',
            message: `El proveedor entrega este pedido manualmente (${item.orderId}). Búscalo en el historial antes de volver a comprar.`,
          },
          { status: 202 }
        );
      }

      return NextResponse.json({
        success: true,
        order: { requested, fulfilled: requested, totalCharged: item.price, currency: 'USDT', items: [item] },
      });
    }

    if (typeof body.productKey === 'string' && isTodKey(body.productKey)) {
      const products = await getCachedProducts();
      if (!products.some((p) => p.productKey === body.productKey)) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      const quantity = Math.min(50, Math.max(1, parseInt(body.quantity || 1, 10)));
      const { pending, item, requested } = await purchaseTod(body.productKey, quantity, body.idempotencyKey);

      if (pending) {
        return NextResponse.json(
          {
            status: 'pending',
            message: `El proveedor dejó el pedido pendiente (${item.orderId}). Búscalo en el historial antes de volver a comprar.`,
          },
          { status: 202 }
        );
      }

      return NextResponse.json({
        success: true,
        order: { requested, fulfilled: requested, totalCharged: item.price, currency: 'USDT', items: [item] },
      });
    }

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
            'La compra no respondió a tiempo. NO la repitas: puede haberse cobrado. Revisa el historial de pedidos o, si es de Addyocart, su bot de Telegram.',
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

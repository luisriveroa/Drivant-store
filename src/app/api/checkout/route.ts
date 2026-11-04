import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { QuantumVaultTimeoutError, QuantumVaultApiError } from '@/lib/quantum-client';
import { getCachedProducts } from '@/lib/products-cache';
import type { ResaleProduct } from '@/lib/types';

// Creates an order request only: nothing is bought and no balance is spent here.
// The owner buys from /admin once the customer has paid.

const MAX_LINES = 20;
const MAX_QUANTITY = 50;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

// Best effort per server instance: keeps the Telegram notifications from being spammed.
const recentRequests = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (recentRequests.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    recentRequests.set(ip, recent);
    return true;
  }
  recentRequests.set(ip, [...recent, now]);
  return false;
}

interface OrderLine {
  productKey: string;
  variantKey: string | null;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

class CheckoutError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

function buildLine(products: ResaleProduct[], item: any): OrderLine {
  const quantity = Number(item?.quantity);
  if (typeof item?.productKey !== 'string' || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
    throw new CheckoutError(`Cada producto necesita una cantidad entre 1 y ${MAX_QUANTITY}`, 400);
  }

  const product = products.find((p) => p.productKey === item.productKey);
  if (!product) {
    throw new CheckoutError('Un producto de tu carrito ya no está disponible', 409);
  }

  let name = product.name;
  let unitPrice = product.minPrice;
  let inStock = product.inStock;
  let variantKey: string | null = null;

  if (product.variants.length > 0) {
    const variant = product.variants.find((v) => v.variantKey === item.variantKey);
    if (!variant) {
      throw new CheckoutError(`La opción elegida de ${product.name} ya no está disponible`, 409);
    }
    name = `${product.name} — ${variant.name}`;
    unitPrice = variant.price;
    inStock = variant.inStock;
    variantKey = variant.variantKey;
  }

  if (!inStock) {
    throw new CheckoutError(`${name} está agotado`, 409);
  }

  return {
    productKey: product.productKey,
    variantKey,
    name,
    quantity,
    unitPrice,
    lineTotal: parseFloat((unitPrice * quantity).toFixed(2)),
  };
}

function buildCustomerMessage(ref: string, lines: OrderLine[], total: number, customerName: string): string {
  return [
    `Hola, quiero hacer este pedido en Drivant.`,
    `Pedido: ${ref}`,
    ``,
    ...lines.map(
      (l) =>
        `• ${l.quantity} x ${l.name} — $${l.lineTotal.toFixed(2)} (${l.productKey}${l.variantKey ? ` / ${l.variantKey}` : ''})`
    ),
    ``,
    `Total: $${total.toFixed(2)} USD`,
    ...(customerName ? [`Nombre: ${customerName}`] : []),
    ``,
    `¿Cómo puedo pagar?`,
  ].join('\n');
}

async function notifyOwner(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Plain text on purpose: customer input must not be parsed as markup.
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error('[API /checkout] Telegram notification failed:', res.status);
    return res.ok;
  } catch {
    console.error('[API /checkout] Telegram notification failed: network error');
    return false;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Demasiados pedidos seguidos. Espera un minuto.' }, { status: 429 });
  }

  try {
    const body = await request.json().catch(() => null);
    const items = body?.items;

    if (!Array.isArray(items) || items.length === 0 || items.length > MAX_LINES) {
      return NextResponse.json({ error: `El pedido debe tener entre 1 y ${MAX_LINES} productos` }, { status: 400 });
    }

    const customerName =
      typeof body.customerName === 'string'
        ? body.customerName.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, 60)
        : '';

    // Prices always come from the server: the browser cart can be edited by the customer.
    const products = await getCachedProducts();
    const lines = items.map((item: unknown) => buildLine(products, item));
    const total = parseFloat(lines.reduce((sum, l) => sum + l.lineTotal, 0).toFixed(2));
    const ref = `DV-${randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()}`;
    const message = buildCustomerMessage(ref, lines, total, customerName);

    const channel = body.channel === 'telegram' ? 'Telegram' : 'WhatsApp';
    await notifyOwner(`🛒 Nuevo pedido (el cliente eligió ${channel})\n\n${message}`);

    return NextResponse.json({ ref, lines, total, currency: 'USD', message });
  } catch (error: unknown) {
    if (error instanceof CheckoutError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof QuantumVaultApiError || error instanceof QuantumVaultTimeoutError) {
      return NextResponse.json({ error: 'No pudimos verificar el catálogo. Intenta de nuevo.' }, { status: 503 });
    }
    console.error('[API /checkout] Error:', error);
    return NextResponse.json({ error: 'No pudimos crear tu pedido. Intenta de nuevo.' }, { status: 500 });
  }
}

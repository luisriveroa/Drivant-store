// ============================================================
// Admin Guard — HTTP Basic Auth for everything that can spend
// the wallet balance or read delivered credentials.
// ============================================================
import { NextRequest, NextResponse } from 'next/server';

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function isAuthorized(header: string | null, password: string): boolean {
  if (!header?.startsWith('Basic ')) return false;
  try {
    const decoded = atob(header.slice(6));
    const supplied = decoded.slice(decoded.indexOf(':') + 1);
    return safeEqual(supplied, password);
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest): NextResponse {
  const password = process.env.ADMIN_PASSWORD;

  // Fail closed: without a password these routes stay unreachable.
  if (!password) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD is not configured' }, { status: 503 });
  }

  if (isAuthorized(request.headers.get('authorization'), password)) {
    return NextResponse.next();
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Drivant Admin", charset="UTF-8"' },
  });
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/purchase/:path*',
    '/api/balance/:path*',
    '/api/orders/:path*',
  ],
};

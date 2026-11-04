// ============================================================
// QuantumVault API Client — Server-side ONLY
// ============================================================
import type {
  MeResponse,
  BalanceResponse,
  ProductListResponse,
  ProductDetailResponse,
  ApiProduct,
  PurchaseResponse,
  OrderListResponse,
  OrderDetailResponse,
  DeliveredItem,
  ApiError,
} from '@/lib/types';

export class QuantumVaultClient {
  private baseUrl: string;
  private apiKey: string;
  private defaultTimeout: number;
  private purchaseTimeout: number;

  constructor() {
    const baseUrl = process.env.QUANTUMVAULT_BASE_URL || 'https://www.quantumvault.me/api/v1';
    const apiKey = process.env.QUANTUMVAULT_API_KEY;

    if (!apiKey) {
      throw new Error(
        'QUANTUMVAULT_API_KEY is not defined in environment variables. Please check your .env or .env.local file.'
      );
    }

    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.apiKey = apiKey;
    this.defaultTimeout = 15_000;
    this.purchaseTimeout = 30_000;
  }

  private headers(): Record<string, string> {
    return {
      'X-API-Key': this.apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'QuantumStore-Client/1.0',
    };
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    timeout?: number
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout ?? this.defaultTimeout);

    try {
      const response = await fetch(url, {
        method,
        headers: this.headers(),
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        cache: 'no-store',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorBody: any;
        try {
          errorBody = await response.json();
        } catch {
          errorBody = {
            message: `HTTP ${response.status}: ${response.statusText}`,
            statusCode: response.status,
          };
        }
        throw new QuantumVaultApiError(
          errorBody.message || `Request failed with status ${response.status}`,
          response.status,
          errorBody
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof QuantumVaultApiError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new QuantumVaultTimeoutError(
          `Request to ${path} timed out after ${timeout ?? this.defaultTimeout}ms`
        );
      }

      throw new QuantumVaultNetworkError(
        `Network error while calling ${path}: ${(error as Error).message}`
      );
    }
  }

  /** GET /me — Account health check and summary */
  async getMe(): Promise<MeResponse> {
    return this.request<MeResponse>('GET', '/me');
  }

  /** GET /balance — Reseller wallet balance & credit */
  async getBalance(): Promise<BalanceResponse> {
    return this.request<BalanceResponse>('GET', '/balance');
  }

  /** GET /products — Catalog of live products */
  async getProducts(): Promise<ProductListResponse | ApiProduct[]> {
    return this.request<ProductListResponse | ApiProduct[]>('GET', '/products');
  }

  /** GET /products/:productKey — Detail of specific product */
  async getProduct(productKey: string): Promise<ApiProduct> {
    const data = await this.request<ProductDetailResponse | { product: ApiProduct } | ApiProduct>(
      'GET',
      `/products/${encodeURIComponent(productKey)}`
    );
    if (data && typeof data === 'object' && 'product' in data && data.product) {
      return data.product;
    }
    return data as ApiProduct;
  }

  /**
   * POST /purchase — Buy product(s)
   */
  async purchase(
    payload:
      | { productKey: string; variantKey?: string | null; quantity?: number }
      | { items: Array<{ productKey: string; variantKey?: string | null; quantity?: number }> }
  ): Promise<PurchaseResponse> {
    return this.request<PurchaseResponse>('POST', '/purchase', payload, this.purchaseTimeout);
  }

  /** GET /orders — History of recent orders */
  async getOrders(params?: { limit?: number }): Promise<OrderListResponse> {
    const query = params?.limit ? `?limit=${params.limit}` : '';
    return this.request<OrderListResponse>('GET', `/orders${query}`);
  }

  /** GET /orders/:orderId — Fetch delivered details for an already purchased order */
  async getOrder(orderId: string): Promise<DeliveredItem> {
    const data = await this.request<OrderDetailResponse | { order: DeliveredItem } | DeliveredItem>(
      'GET',
      `/orders/${encodeURIComponent(orderId)}`
    );
    if (data && typeof data === 'object' && 'order' in data && data.order) {
      return data.order;
    }
    return data as DeliveredItem;
  }
}

// Custom error classes
export class QuantumVaultApiError extends Error {
  public statusCode: number;
  public details: ApiError;

  constructor(message: string, statusCode: number, details: ApiError) {
    super(message);
    this.name = 'QuantumVaultApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class QuantumVaultTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QuantumVaultTimeoutError';
  }
}

export class QuantumVaultNetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QuantumVaultNetworkError';
  }
}

export function getQuantumClient(): QuantumVaultClient {
  return new QuantumVaultClient();
}

export default QuantumVaultClient;

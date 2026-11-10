// ============================================================
// QuantumVault API — Type Definitions (Official v1 API Spec)
// ============================================================

/** GET /me response */
export interface MeResponse {
  username: string;
  balance: number;
  credit: number;
  currency: string;
  memberSince?: string;
}

/** GET /balance response */
export interface BalanceResponse {
  balance: number;
  credit?: number;
  currency?: string;
}

/** Product variant from API */
export interface ApiVariant {
  key: string;
  name: string;
  price: number;
  stock?: number | null;
  unlimited?: boolean;
  inStock: boolean;
  description?: string;
  warranty?: {
    durationDays: number;
    details: string;
  } | null;
}

/** Deliver field descriptor (tells client what fields are delivered upon purchase) */
export interface DeliverFieldDescriptor {
  name: string;
  label: string;
}

/** Raw product as returned by QuantumVault API */
export interface ApiProduct {
  productKey: string;
  name: string;
  description?: string;
  currency?: string;
  price: number | null; // null if product has variants
  stock?: number | null;
  unlimited?: boolean;
  inStock: boolean;
  variants?: ApiVariant[];
  deliverFields?: DeliverFieldDescriptor[];
  warranty?: {
    durationDays: number;
    details: string;
  } | null;
  acquisitionMode?: string;
  icon?: string;
  category?: string;
}

/** GET /products response */
export interface ProductListResponse {
  products: ApiProduct[];
}

/** GET /products/:productKey response */
export interface ProductDetailResponse {
  product: ApiProduct;
}

/** Delivered field value */
export interface DeliveredField {
  name: string;
  label: string;
  value: string;
}

/** A single delivered item returned in order.items[] */
export interface DeliveredItem {
  orderId: string;
  purchaseId?: string;
  product: string;
  productKey: string;
  variantKey?: string | null;
  price: number;
  currency?: string;
  deliveredAt: string;
  fields: DeliveredField[];
  data: Record<string, string>;
}

/** Purchase result */
export interface PurchaseResultOrder {
  requested: number;
  fulfilled: number;
  partial?: boolean;
  unitPrice?: number;
  totalCharged: number;
  currency: string;
  items?: DeliveredItem[];
  bulk?: boolean;
  lineItems?: number;
  results?: Array<{
    productKey: string;
    variantKey?: string | null;
    requested: number;
    fulfilled: number;
    totalCharged: number;
    items?: DeliveredItem[];
  }>;
}

export interface PurchaseResponse {
  success: boolean;
  order: PurchaseResultOrder;
}

/** Order summary item from GET /orders */
export interface OrderSummaryItem {
  orderId: string;
  purchaseId?: string;
  productKey: string;
  variantKey?: string | null;
  price: number;
  currency: string;
  status: string;
  date: string;
}

export interface OrderListResponse {
  orders: OrderSummaryItem[];
  summary?: {
    totalOrders: number;
    totalSpent: number;
    currency: string;
  };
}

/** GET /orders/:orderId response */
export interface OrderDetailResponse {
  order: DeliveredItem;
}

/** API Error format */
export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
}

// ============================================================
// Resale & Frontend Types (with profit margin applied)
// ============================================================

export interface ResaleVariant {
  variantKey: string;
  name: string;
  price: number; // Final customer price
  stock?: number | null;
  unlimited?: boolean;
  inStock: boolean;
  description?: string;
  warranty?: {
    durationDays: number;
    details: string;
  } | null;
}

/** The same Spanish structure for every product. */
export interface ProductInfo {
  duration: string;
  warranty: string;
  delivery: string;
  includes: string[];
  steps: string[];
  notes: string[];
  /** False when the supplier gave no conditions to translate. */
  hasDetails: boolean;
}

export interface ResaleProduct {
  productKey: string;
  name: string;
  description: string;
  currency: string;
  minPrice: number;
  maxPrice: number;
  resaleMinPrice: number;
  resaleMaxPrice: number;
  totalStock: number;
  inStock: boolean;
  category: string;
  categoryId: string;
  brandId: string;
  brandName: string;
  logo: string | null;
  brandColor: string;
  brandAbout: string;
  info: ProductInfo;
  searchText: string;
  variants: ResaleVariant[];
  deliverFields?: DeliverFieldDescriptor[];
  warranty?: {
    durationDays: number;
    details: string;
  } | null;
}

export interface CartItem {
  productKey: string;
  variantKey?: string | null;
  productName: string;
  variantName?: string;
  quantity: number;
  resalePrice: number;
}

export interface MarginConfig {
  type: 'percentage' | 'fixed';
  value: number;
}

export interface ProductMarginOverride {
  productKey: string;
  margin: MarginConfig;
}

// ============================================================
// Pricing Utility — Applies resale margin to QuantumVault prices
// ============================================================
import type { MarginConfig, ApiProduct, ResaleProduct, ResaleVariant } from '@/lib/types';
import {
  getTieredPrice,
  productMarginOverrides,
  MIN_RESALE_PRICE,
  PRICE_DECIMALS,
} from '@/config/margins';
import { describeProduct, translateTerms } from '@/lib/product-info';

/**
 * Calculate the resale price given a base price and margin config.
 */
export function calculateResalePrice(basePrice: number, margin: MarginConfig): number {
  let resalePrice: number;

  if (margin.type === 'percentage') {
    resalePrice = basePrice * (1 + margin.value / 100);
  } else {
    // Fixed amount added on top
    resalePrice = basePrice + margin.value;
  }

  // Enforce minimum price floor
  resalePrice = Math.max(resalePrice, MIN_RESALE_PRICE);

  return parseFloat(resalePrice.toFixed(PRICE_DECIMALS));
}

/**
 * Final customer price for a supplier price: product override first, then tiers.
 */
export function getResalePrice(productKey: string, basePrice: number): number {
  const override = productMarginOverrides.find((o) => o.productKey === productKey);
  if (override) return calculateResalePrice(basePrice, override.margin);
  const price = Math.max(getTieredPrice(basePrice), MIN_RESALE_PRICE);
  return parseFloat(price.toFixed(PRICE_DECIMALS));
}

const FIELD_LABELS: Record<string, string> = {
  email: 'Correo',
  password: 'Contraseña',
  activation_url: 'Enlace de activación',
  cdk_code: 'Código de activación',
  code: 'Código',
  key: 'Clave',
};

/** Spanish presentation, shared by products with and without variants. Supplier text stays out. */
function presentProduct(product: ApiProduct) {
  const described = describeProduct(product.productKey, product.name, product.warranty?.durationDays);
  return {
    name: described.name,
    description: described.summary,
    category: described.categoryName,
    categoryId: described.categoryId,
    brandId: described.brandId,
    brandName: described.brandName,
    logo: described.logo,
    info: described.info,
    searchText: described.searchText,
    deliverFields: product.deliverFields?.map((f) => ({ name: f.name, label: FIELD_LABELS[f.name] || f.label })),
    warranty: product.warranty ? { durationDays: product.warranty.durationDays, details: '' } : null,
  };
}

/**
 * Transform an API product into a ResaleProduct, applying the margin to each price.
 * Ensures the wholesale price is stripped and never leaks to the frontend.
 */
export function applyResalePricing(product: ApiProduct): ResaleProduct {
  const variants = product.variants || [];

  if (variants.length > 0) {
    const resaleVariants: ResaleVariant[] = variants.map((v) => ({
      variantKey: v.key,
      name: translateTerms(v.name),
      price: getResalePrice(product.productKey, v.price),
      stock: v.stock,
      unlimited: v.unlimited,
      inStock: v.inStock,
      warranty: v.warranty ? { durationDays: v.warranty.durationDays, details: '' } : null,
    }));

    const prices = resaleVariants.map((v) => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const totalStock = resaleVariants.reduce((sum, v) => sum + (v.stock || 0), 0);

    return {
      ...presentProduct(product),
      productKey: product.productKey,
      currency: product.currency || 'USD',
      minPrice,
      maxPrice,
      resaleMinPrice: minPrice,
      resaleMaxPrice: maxPrice,
      totalStock,
      inStock: product.inStock,
      variants: resaleVariants,
    };
  }

  // Simple product (no variants)
  const basePrice = product.price ?? 0;
  const resalePrice = getResalePrice(product.productKey, basePrice);

  return {
    ...presentProduct(product),
    productKey: product.productKey,
    currency: product.currency || 'USD',
    minPrice: resalePrice,
    maxPrice: resalePrice,
    resaleMinPrice: resalePrice,
    resaleMaxPrice: resalePrice,
    totalStock: product.stock ?? (product.unlimited ? 999 : 0),
    inStock: product.inStock,
    variants: [],
  };
}

/**
 * Transform multiple products.
 */
export function applyResalePricingBulk(products: ApiProduct[]): ResaleProduct[] {
  return products.map(applyResalePricing);
}

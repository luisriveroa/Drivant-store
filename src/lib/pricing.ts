// ============================================================
// Pricing Utility — Applies resale margin to QuantumVault prices
// ============================================================
import type { MarginConfig, ApiProduct, ResaleProduct, ResaleVariant } from '@/lib/types';
import {
  getDefaultMargin,
  productMarginOverrides,
  MIN_RESALE_PRICE,
  PRICE_DECIMALS,
} from '@/config/margins';

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
 * Get margin config for a specific product key.
 */
export function getMarginForProduct(productKey: string): MarginConfig {
  const override = productMarginOverrides.find((o) => o.productKey === productKey);
  return override ? override.margin : getDefaultMargin();
}

/**
 * Transform an API product into a ResaleProduct, applying the margin.
 * Ensures the wholesale price is stripped and never leaks to the frontend.
 */
export function applyResalePricing(product: ApiProduct): ResaleProduct {
  const margin = getMarginForProduct(product.productKey);
  const variants = product.variants || [];

  if (variants.length > 0) {
    const resaleVariants: ResaleVariant[] = variants.map((v) => ({
      variantKey: v.key,
      name: v.name,
      price: calculateResalePrice(v.price, margin),
      stock: v.stock,
      unlimited: v.unlimited,
      inStock: v.inStock,
      description: v.description,
      warranty: v.warranty,
    }));

    const prices = resaleVariants.map((v) => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const totalStock = resaleVariants.reduce((sum, v) => sum + (v.stock || 0), 0);

    return {
      productKey: product.productKey,
      name: product.name,
      description: product.description || '',
      currency: product.currency || 'USD',
      minPrice,
      maxPrice,
      resaleMinPrice: minPrice,
      resaleMaxPrice: maxPrice,
      totalStock,
      inStock: product.inStock,
      category: product.category || 'Digital',
      variants: resaleVariants,
      deliverFields: product.deliverFields,
      warranty: product.warranty,
    };
  }

  // Simple product (no variants)
  const basePrice = product.price ?? 0;
  const resalePrice = calculateResalePrice(basePrice, margin);

  return {
    productKey: product.productKey,
    name: product.name,
    description: product.description || '',
    currency: product.currency || 'USD',
    minPrice: resalePrice,
    maxPrice: resalePrice,
    resaleMinPrice: resalePrice,
    resaleMaxPrice: resalePrice,
    totalStock: product.stock ?? (product.unlimited ? 999 : 0),
    inStock: product.inStock,
    category: product.category || 'Digital',
    variants: [],
    deliverFields: product.deliverFields,
    warranty: product.warranty,
  };
}

/**
 * Transform multiple products.
 */
export function applyResalePricingBulk(products: ApiProduct[]): ResaleProduct[] {
  return products.map(applyResalePricing);
}

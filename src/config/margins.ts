// ============================================================
// Margin / Pricing Configuration
// ============================================================
import type { MarginConfig, ProductMarginOverride } from '@/lib/types';

/**
 * Default global margin applied to all products.
 * Can be overridden via the DEFAULT_MARGIN_PERCENT env var.
 */
export function getDefaultMargin(): MarginConfig {
  const envPercent = process.env.DEFAULT_MARGIN_PERCENT;
  if (envPercent) {
    const parsed = parseFloat(envPercent);
    if (!isNaN(parsed)) {
      return { type: 'percentage', value: parsed };
    }
  }
  // Fallback: 30% markup
  return { type: 'percentage', value: 30 };
}

/**
 * Per-product margin overrides.
 * Add entries here to set custom margins for specific products.
 *
 * Example:
 *   { productKey: 'outlook-mail', margin: { type: 'fixed', value: 0.10 } }
 *   → Adds $0.10 flat on top of the base price for 'outlook-mail'
 *
 *   { productKey: 'google-ai-plus-3m', margin: { type: 'percentage', value: 50 } }
 *   → Adds 50% markup on top of the base price
 */
export const productMarginOverrides: ProductMarginOverride[] = [
  // Add your per-product overrides here
  // { productKey: 'some-product-key', margin: { type: 'percentage', value: 50 } },
];

/**
 * Minimum resale price floor (in USD).
 * No product will be sold below this price regardless of margin calculation.
 */
export const MIN_RESALE_PRICE = 0.01;

/**
 * Round resale prices to this number of decimal places.
 */
export const PRICE_DECIMALS = 2;

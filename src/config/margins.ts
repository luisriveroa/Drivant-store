// ============================================================
// Margin / Pricing Configuration
// ============================================================
import type { ProductMarginOverride } from '@/lib/types';

export interface MarginTier {
  upTo: number;
  percent: number;
}

/**
 * Automatic margin by supplier price. The first tier whose `upTo` is above the
 * supplier price applies. Edit these numbers to change prices across the store.
 *
 * Example: a product the API sells at $10 falls in the "upTo: 20" tier
 *   → $10 + 35% = $13.50
 */
export const MARGIN_TIERS: MarginTier[] = [
  { upTo: 1, percent: 100 },
  { upTo: 5, percent: 50 },
  { upTo: 20, percent: 35 },
  { upTo: Infinity, percent: 25 },
];

/**
 * Applies the tier margin to a supplier price. Never returns less than the top
 * price of the previous tier, so a dearer product can't end up cheaper to the
 * customer just because it crossed into a tier with a lower percentage.
 */
export function getTieredPrice(basePrice: number): number {
  const index = MARGIN_TIERS.findIndex((t) => basePrice < t.upTo);
  const tier = MARGIN_TIERS[index];
  const price = basePrice * (1 + tier.percent / 100);
  if (index === 0) return price;
  const previous = MARGIN_TIERS[index - 1];
  return Math.max(price, previous.upTo * (1 + previous.percent / 100));
}

/**
 * Per-product margin overrides. These win over MARGIN_TIERS.
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

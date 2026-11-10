// ============================================================
// Margin / Pricing Configuration
// ============================================================
// Two rules decide every price:
// 1. Products with a known official price sell a bit below it
//    (OFFICIAL_DISCOUNT_PERCENT), so the store is cheaper than buying direct.
// 2. Everything else gets MARGIN_TIERS on the supplier's cost, highest on cheap items.
// Prices never drop below the cost plus MIN_MARGIN_PERCENT.
// ============================================================
import type { ProductMarginOverride } from '@/lib/types';

export interface MarginTier {
  upTo: number;
  percent: number;
}

/**
 * Margin on the supplier's cost when there's no official price to compare with.
 * The first tier whose `upTo` is above the cost applies.
 *
 * Example: a product the API sells at $1 falls in the "upTo: 3" tier
 *   → $1 + 150% = $2.50, raised to the previous tier's top ($3) → $2.90
 */
export const MARGIN_TIERS: MarginTier[] = [
  { upTo: 1, percent: 200 },
  { upTo: 3, percent: 150 },
  { upTo: 10, percent: 80 },
  { upTo: 30, percent: 50 },
  { upTo: Infinity, percent: 30 },
];

/** How far below the official price the store sells: 15 → $20 becomes $17. */
export const OFFICIAL_DISCOUNT_PERCENT = 15;

/** Minimum profit over the supplier's cost, whatever the other rules say. */
export const MIN_MARGIN_PERCENT = 15;

/**
 * Brands whose price never goes above cost plus `maxPercent`, even when the
 * official price would allow more. 150 → a $1.20 cost sells at $2.90 at most.
 */
export const MARGIN_CAPS: Array<{ match: RegExp; maxPercent: number }> = [
  { match: /gemini|google ai/i, maxPercent: 150 },
];

export interface OfficialPrice {
  match: RegExp;
  /** Official price in USD for 1 month. */
  monthly: number;
  /** Official price in USD for 12 months, when the annual plan is cheaper than 12 × monthly. */
  yearly?: number;
}

/**
 * Approximate official prices in USD, as listed by each brand for an individual
 * plan. They change over time and by country: review them now and then.
 * The first match wins, so specific plans go before general ones.
 */
export const OFFICIAL_PRICES: OfficialPrice[] = [
  { match: /chat ?gpt plus/i, monthly: 20, yearly: 240 },
  { match: /claude pro/i, monthly: 20, yearly: 204 },
  { match: /google ai pro|gemini (pro|advanced)/i, monthly: 19.99, yearly: 199.99 },
  { match: /perplexity pro/i, monthly: 20, yearly: 200 },
  { match: /cursor pro\b/i, monthly: 20, yearly: 192 },
  { match: /super ?grok/i, monthly: 30, yearly: 300 },
  { match: /suno premier/i, monthly: 30, yearly: 288 },
  { match: /suno pro/i, monthly: 10, yearly: 96 },
  { match: /elevenlabs creator/i, monthly: 22, yearly: 220 },
  { match: /replit core/i, monthly: 25, yearly: 240 },
  { match: /gamma pro/i, monthly: 20, yearly: 180 },
  { match: /gamma plus/i, monthly: 10, yearly: 96 },
  { match: /netflix(?!.*extra)/i, monthly: 24.99 },
  { match: /spotify/i, monthly: 11.99 },
  { match: /youtube premium/i, monthly: 13.99, yearly: 139.99 },
  { match: /crunchyroll.*mega/i, monthly: 11.99, yearly: 119.99 },
  { match: /crunchyroll/i, monthly: 7.99, yearly: 79.99 },
  { match: /apple music/i, monthly: 10.99, yearly: 109 },
  { match: /apple tv/i, monthly: 12.99 },
  { match: /amazon prime/i, monthly: 14.99, yearly: 139 },
  { match: /prime video/i, monthly: 8.99 },
  { match: /canva pro/i, monthly: 15, yearly: 120 },
  { match: /adobe express/i, monthly: 9.99, yearly: 99.99 },
  { match: /capcut pro/i, monthly: 9.99, yearly: 89.99 },
  { match: /duolingo/i, monthly: 12.99, yearly: 83.99 },
  { match: /grammarly/i, monthly: 30, yearly: 144 },
  { match: /notion business/i, monthly: 24, yearly: 240 },
  { match: /notion plus/i, monthly: 12, yearly: 120 },
  { match: /linkedin.*navigator/i, monthly: 99.99 },
  { match: /linkedin.*business/i, monthly: 59.99 },
  { match: /linkedin.*career/i, monthly: 39.99 },
  { match: /zoom pro/i, monthly: 15.99, yearly: 149.9 },
  { match: /microsoft 365|office 365/i, monthly: 9.99, yearly: 99.99 },
  { match: /coursera plus/i, monthly: 59, yearly: 399 },
  { match: /udemy personal/i, monthly: 20 },
  { match: /nord ?vpn/i, monthly: 12.99, yearly: 59.88 },
  { match: /expressvpn/i, monthly: 12.95, yearly: 99.95 },
  { match: /proton (vpn plus|unlimited)/i, monthly: 9.99, yearly: 79.95 },
  { match: /headspace/i, monthly: 12.99, yearly: 69.99 },
  { match: /skillshare/i, monthly: 32, yearly: 168 },
  { match: /scribd/i, monthly: 11.99 },
  { match: /telegram premium/i, monthly: 4.99, yearly: 35.99 },
  { match: /snapchat/i, monthly: 3.99, yearly: 39.99 },
];

/**
 * Free plans, trials, offers and education or organization plans aren't the
 * paid personal plan the official price is for, and products sold by credits
 * or seats aren't priced by month.
 */
const NOT_A_MONTHLY_PLAN = /\b(free|trial|offer|codes?|cr(e|é)ditos?|credits?|tokens?|seats?|puestos|lifetime|de por vida|extra|edu|education|educación|org)\b/i;

/** Months a product name covers, or null when it doesn't say. */
export function monthsInName(name: string): number | null {
  const months = name.match(/\b(\d+)\s*(months?|mon|m|mes(es)?)\b/i);
  if (months) return Number(months[1]);
  const years = name.match(/\b(\d+)\s*(years?|yrs?|y|años?)\b/i);
  if (years) return Number(years[1]) * 12;
  const days = name.match(/\b(\d+)\s*(days?|d|días?)\b/i);
  if (days) return Number(days[1]) / 30;
  return null;
}

/** The official price for the time the product covers, or null when unknown. */
export function getOfficialPrice(name: string): number | null {
  if (NOT_A_MONTHLY_PLAN.test(name)) return null;
  const reference = OFFICIAL_PRICES.find((p) => p.match.test(name));
  const months = monthsInName(name);
  if (!reference || !months) return null;
  if (months >= 12 && reference.yearly) return reference.yearly * (months / 12);
  return reference.monthly * months;
}

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

/** Prices from $2 end in .90: $3.04 becomes $2.90, $17.10 becomes $16.90. */
function roundForDisplay(price: number): number {
  if (price < 2) return Math.ceil(price * 100) / 100;
  return Math.round(price) - 0.1;
}

/** Final customer price for a supplier cost and the product's name. */
export function computeResalePrice(name: string, cost: number): number {
  const official = getOfficialPrice(name);
  const target = official ? official * (1 - OFFICIAL_DISCOUNT_PERCENT / 100) : getTieredPrice(cost);
  const floor = cost * (1 + MIN_MARGIN_PERCENT / 100);
  const cap = MARGIN_CAPS.find((c) => c.match.test(name));
  const ceiling = cap ? cost * (1 + cap.maxPercent / 100) : Infinity;
  const rounded = roundForDisplay(Math.min(Math.max(target, floor), ceiling));
  // Rounding down to .90 must not eat the minimum margin, nor rounding up pass the cap.
  if (rounded < floor) return Math.ceil(floor * 100) / 100;
  return rounded > ceiling ? Math.floor(ceiling * 100) / 100 : rounded;
}

/**
 * Per-product margin overrides. These win over every rule above.
 *
 * Example:
 *   { productKey: 'outlook_mail', margin: { type: 'fixed', value: 0.10 } }
 *   → Adds $0.10 flat on top of the supplier's price
 *
 *   { productKey: 'tod--sup_bat_49', margin: { type: 'percentage', value: 50 } }
 *   → Adds 50% on top of the supplier's price
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

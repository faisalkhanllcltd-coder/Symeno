export type PricingTier = 'RETAIL' | 'B2B_TIER1' | 'B2B_TIER2';

interface ProductData {
  base_price: number;
  retail_price: number;
}

/**
 * Calculates the exact unit price based on the user's authorized tier.
 * B2B_TIER1: 5% margin above base wholesale cost.
 * B2B_TIER2: 2% margin above base wholesale cost (High volume).
 */
export function calculateTieredPrice(
  product: ProductData,
  tier: PricingTier = 'RETAIL'
): number {
  if (tier === 'RETAIL') return product.retail_price;

  const base = product.base_price;
  if (tier === 'B2B_TIER1') return Number((base * 1.05).toFixed(2));
  if (tier === 'B2B_TIER2') return Number((base * 1.02).toFixed(2));

  return product.retail_price;
}

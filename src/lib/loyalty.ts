// src/lib/loyalty.ts
export const LOYALTY_RATES = {
  EARN_RATE: 1, // 1 Point per 1 AED
  REDEEM_RATE: 100, // 100 Points = 1 AED Discount
  MULTIPLIERS: {
    BIRTHDAY: 2,
    VIP_PRODUCT: 3,
  },
};

export const TIERS = [
  {
    id: 'SILVER',
    name: 'Silver Operator',
    threshold: 0,
    color: 'text-zinc-400',
    bg: 'bg-zinc-400/10',
    border: 'border-zinc-400/30',
  },
  {
    id: 'GOLD',
    name: 'Gold Operator',
    threshold: 500,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/30',
  },
  {
    id: 'PLATINUM',
    name: 'Platinum Elite',
    threshold: 2000,
    color: 'text-brand',
    bg: 'bg-brand/10',
    border: 'border-brand/30',
  },
];

export function calculateTier(lifetimePoints: number) {
  if (lifetimePoints >= 2000) return TIERS[2];
  if (lifetimePoints >= 500) return TIERS[1];
  return TIERS[0];
}

export function calculateNextTier(lifetimePoints: number) {
  if (lifetimePoints >= 2000) return null;
  if (lifetimePoints >= 500)
    return { ...TIERS[2], pointsNeeded: 2000 - lifetimePoints };
  return { ...TIERS[1], pointsNeeded: 500 - lifetimePoints };
}

export function pointsToCurrency(points: number): number {
  return points / LOYALTY_RATES.REDEEM_RATE;
}

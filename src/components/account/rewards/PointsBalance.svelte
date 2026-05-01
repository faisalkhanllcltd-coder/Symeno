<script lang="ts">
  // FIX: Corrected directory traversal to stay within src/
  import {
    calculateTier,
    calculateNextTier,
    pointsToCurrency,
  } from '../../../lib/loyalty';

  let { stats = { current_balance: 0, lifetime_earned: 0 }, onRedeem } =
    $props<{ stats?: any; onRedeem: (pts: number) => void }>();

  let tier = $derived(calculateTier(stats.lifetime_earned));
  let nextTier = $derived(calculateNextTier(stats.lifetime_earned));
  let redeemValue = $derived(pointsToCurrency(stats.current_balance));

  let redeemInput = $state(100);
</script>

<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">        
  <div
    class="border bg-surface border-outline relative flex h-full flex-col justify-between overflow-hidden p-6 transition-colors duration-300"
  >
    <div
      class="absolute -top-10 -right-10 h-32 w-32 {tier.bg} rounded-full blur-2xl opacity-50"
    ></div>
    <div class="relative z-10">
      <h3
        class="text-xs font-bold tracking-widest uppercase {tier.color} mb-1 font-mono"
      >
        {tier.name}
      </h3>
      <p class="font-mono text-[10px] text-content-muted">

        Lifetime Earned: {stats.lifetime_earned} pts      
      </p>
    </div>

    <div class="mt-8 relative z-10">
      <p
        class="mb-2 font-mono text-[10px] tracking-widest text-content-muted uppercase"
      >
        Available Balance
      </p>
      <div class="flex items-end gap-2">
        <span class="font-mono text-5xl leading-none font-bold text-content"
          >{stats.current_balance}</span
        >
        <span class="mb-1 font-mono text-sm text-content-muted">pts</span>
      </div>
      <p class="mt-2 font-mono text-xs text-brand">        
        ≈ ${redeemValue.toFixed(2)} AED Checkout Value    
      </p>
    </div>

    {#if nextTier}
      <div class="mt-8 border-t border-outline pt-4 relative z-10">
        <div class="mb-2 flex justify-between font-mono text-[10px]">
          <span class="text-content-muted"
            >Next Tier: <span class={nextTier.color}>{nextTier.name}</span
            ></span
          >
          <span class="text-content">{nextTier.pointsNeeded} pts to go</span>
        </div>
        <div class="h-1.5 w-full overflow-hidden rounded-full bg-base border border-outline">
          <div
            class="h-full bg-content-muted transition-all duration-1000"
            style="width: {(stats.lifetime_earned / nextTier.threshold) * 100}%"
          ></div>
        </div>
      </div>
    {/if}
  </div>

  <div
    class="flex flex-col justify-between border border-outline bg-base p-6 transition-colors duration-300"
  >
    <div>
      <h3
        class="mb-2 font-mono text-xs font-bold tracking-widest text-content uppercase"
      >
        Exchange Protocol
      </h3>
      <p class="max-w-sm font-mono text-[10px] text-content-muted">
        Convert your operational points into stackable checkout discounts. (100
        pts = $1.00 AED)
      </p>
    </div>

    <div class="mt-8 space-y-4">
      <div>
        <label
          class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
          >Points to Convert</label
        >
        <div class="flex gap-2">
          <input
            type="number"
            min="100"
            step="100"
            max={stats.current_balance}
            bind:value={redeemInput}
            class="w-full border border-outline bg-surface px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand transition-colors"
          />
          <button
            onclick={() =>
              (redeemInput = Math.floor(stats.current_balance / 100) * 100)}
            class="border border-outline px-4 py-2 font-mono text-[10px] tracking-widest text-content-muted uppercase transition-colors hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
            >Max</button
          >
        </div>
        <p class="mt-2 font-mono text-[9px] text-brand">  
          Yields: ${(redeemInput / 100).toFixed(2)} AED Discount Code
        </p>
      </div>

      <button
        onclick={() => onRedeem(redeemInput)}
        disabled={stats.current_balance < 100 ||
          redeemInput < 100 ||
          redeemInput > stats.current_balance}
        class="w-full bg-brand px-4 py-3 text-xs font-bold tracking-widest text-brand-dark uppercase shadow-[0_0_15px_var(--color-brand)] transition-colors hover:opacity-80 disabled:bg-outline disabled:text-content-muted disabled:opacity-30 disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"  
      >
        Initialize Conversion
      </button>
    </div>
  </div>
</div>
<script lang="ts">
  import { calculateTier, calculateNextTier, pointsToCurrency } from '../../../../lib/loyalty';
  let { stats = { current_balance: 0, lifetime_earned: 0 }, onRedeem } = $props<{ stats: any, onRedeem: (pts: number) => void }>();

  let tier = $derived(calculateTier(stats.lifetime_earned));
  let nextTier = $derived(calculateNextTier(stats.lifetime_earned));
  let redeemValue = $derived(pointsToCurrency(stats.current_balance));

  let redeemInput = $state(100);
</script>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <div class="bg-[#111318] border {tier.border} p-6 relative overflow-hidden flex flex-col justify-between h-full">
    <div class="absolute -right-10 -top-10 w-32 h-32 {tier.bg} rounded-full blur-2xl"></div>
    <div>
      <h3 class="text-xs font-bold uppercase tracking-widest {tier.color} font-mono mb-1">{tier.name}</h3>
      <p class="text-[10px] font-mono text-white/50">Lifetime Earned: {stats.lifetime_earned} pts</p>
    </div>
    
    <div class="mt-8">
      <p class="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">Available Balance</p>
      <div class="flex items-end gap-2">
        <span class="text-5xl font-mono font-bold text-white leading-none">{stats.current_balance}</span>
        <span class="text-sm font-mono text-white/50 mb-1">pts</span>
      </div>
      <p class="text-xs text-[#36f4a4] font-mono mt-2">≈ ${redeemValue.toFixed(2)} AED Checkout Value</p>
    </div>

    {#if nextTier}
      <div class="mt-8 pt-4 border-t border-white/10">
        <div class="flex justify-between text-[10px] font-mono mb-2">
          <span class="text-white/50">Next Tier: <span class={nextTier.color}>{nextTier.name}</span></span>
          <span class="text-white">{nextTier.pointsNeeded} pts to go</span>
        </div>
        <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
          <div class="h-full bg-white/20" style="width: {((stats.lifetime_earned / nextTier.threshold) * 100)}%"></div>
        </div>
      </div>
    {/if}
  </div>

  <div class="bg-[#1A1D23] border border-white/10 p-6 flex flex-col justify-between">
    <div>
      <h3 class="text-xs font-bold uppercase tracking-widest text-white font-mono mb-2">Exchange Protocol</h3>
      <p class="text-[10px] font-mono text-white/50 max-w-sm">Convert your operational points into stackable checkout discounts. (100 pts = $1.00 AED)</p>
    </div>
    
    <div class="mt-8 space-y-4">
      <div>
        <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Points to Convert</label>
        <div class="flex gap-2">
          <input type="number" min="100" step="100" max={stats.current_balance} bind:value={redeemInput} class="w-full bg-[#111318] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
          <button onclick={() => redeemInput = Math.floor(stats.current_balance / 100) * 100} class="border border-white/10 text-white/50 px-4 py-2 text-[10px] font-mono uppercase tracking-widest hover:text-white transition-colors">Max</button>
        </div>
        <p class="text-[9px] font-mono text-[#36f4a4] mt-2">Yields: ${(redeemInput / 100).toFixed(2)} AED Discount Code</p>
      </div>

      <button 
        onclick={() => onRedeem(redeemInput)} 
        disabled={stats.current_balance < 100 || redeemInput < 100 || redeemInput > stats.current_balance}
        class="w-full bg-[#36f4a4] text-[#003822] px-4 py-3 text-xs font-bold uppercase tracking-widest disabled:opacity-30 disabled:bg-white/10 disabled:text-white/30 transition-colors shadow-[0_0_15px_rgba(54,244,164,0.15)]"
      >
        Initialize Conversion
      </button>
    </div>
  </div>
</div>
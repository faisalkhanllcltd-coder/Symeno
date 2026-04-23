<script lang="ts">
  import PointsBalance from './PointsBalance.svelte';
  import PointsHistory from './PointsHistory.svelte';
  import RewardsProgram from './RewardsProgram.svelte';

  let { initialData = { stats: {}, history: [] } } = $props<{ initialData: any }>();
  let data = $state(initialData);
  let generatedCode = $state<string | null>(null);

  async function handleRedeem(points: number) {
    const res = await fetch('/api/account/rewards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points_to_redeem: points })
    });
    
    if (res.ok) {
      const result = await res.json();
      generatedCode = result.discount_code;
      
      // Optimistic refresh - update balance and append history
      data.stats.current_balance -= points;
      data.history = [
        { id: Math.random().toString(), points: -points, reason: `Redeemed for $${result.value} discount`, created_at: new Date().toISOString() },
        ...data.history
      ];
    } else {
      const err = await res.json();
      alert(`Conversion Failed: ${err.error}`);
    }
  }
</script>

<div class="space-y-8">
  {#if generatedCode}
    <div class="bg-[#36f4a4]/10 border border-[#36f4a4]/30 p-6 flex flex-col items-center justify-center text-center animate-fade-in">
      <p class="text-xs font-bold text-[#36f4a4] uppercase tracking-widest mb-2">Conversion Successful</p>
      <p class="text-[10px] font-mono text-white/70 mb-6">Your discount code is ready. It has been securely locked to your account identity.</p>
      <div class="bg-[#111318] border border-[#36f4a4] px-6 py-3 text-2xl font-mono text-white tracking-widest select-all">
        {generatedCode}
      </div>
      <button onclick={() => generatedCode = null} class="mt-6 text-[10px] text-[#36f4a4] hover:text-white uppercase font-mono tracking-widest transition-colors">Dismiss</button>
    </div>
  {/if}

  <PointsBalance stats={data.stats} onRedeem={handleRedeem} />
  
  <div>
    <h2 class="text-xs font-bold uppercase tracking-widest text-white font-mono mb-4">Earning Protocols</h2>
    <RewardsProgram />
  </div>

  <PointsHistory ledger={data.history} />
</div>
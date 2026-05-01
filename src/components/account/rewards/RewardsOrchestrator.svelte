<script lang="ts">
  import PointsBalance from './PointsBalance.svelte';   
  import PointsHistory from './PointsHistory.svelte';   
  import RewardsProgram from './RewardsProgram.svelte'; 

  let { initialData = { stats: {}, history: [] } } = $props<{
    initialData?: any;
  }>();
  let data = $state(initialData);
  let generatedCode = $state<string | null>(null);      

  async function handleRedeem(points: number) {
    const res = await fetch('/api/account/rewards', {   
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },  
      body: JSON.stringify({ points_to_redeem: points }),
    });

    if (res.ok) {
      const result = await res.json();
      generatedCode = result.discount_code;

      // Optimistic refresh - update balance and append history
      data.stats.current_balance -= points;
      data.history = [
        {
          id: Math.random().toString(),
          points: -points,
          reason: `Redeemed for $${result.value} discount`,
          created_at: new Date().toISOString(),
        },
        ...data.history,
      ];
    } else {
      const err = await res.json();
      alert(`Conversion Failed: ${err.error}`);
    }
  }
</script>

<div class="space-y-8">
  {#if generatedCode}
    <div
      class="animate-fade-in flex flex-col items-center justify-center border border-brand/30 bg-brand/10 p-6 text-center"
    >
      <p
        class="mb-2 text-xs font-bold tracking-widest text-brand uppercase"
      >
        Conversion Successful
      </p>
      <p class="mb-6 font-mono text-[10px] text-content-muted">
        Your discount code is ready. It has been securely locked to your account
        identity.
      </p>
      <div
        class="border border-brand bg-surface px-6 py-3 font-mono text-2xl tracking-widest text-content select-all"
      >
        {generatedCode}
      </div>
      <button
        onclick={() => (generatedCode = null)}
        class="mt-6 font-mono text-[10px] tracking-widest text-brand uppercase transition-colors hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm px-2 py-1"
        >Dismiss</button
      >
    </div>
  {/if}

  <PointsBalance stats={data.stats} onRedeem={handleRedeem} />

  <div>
    <h2
      class="mb-4 font-mono text-xs font-bold tracking-widest text-content uppercase"
    >
      Earning Protocols
    </h2>
    <RewardsProgram />
  </div>

  <PointsHistory ledger={data.history} />
</div>

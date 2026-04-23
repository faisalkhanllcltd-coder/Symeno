<script lang="ts">
  let { data = [] } = $props<{ data: any[] }>();
  
  let maxAmount = $derived(Math.max(...data.map(d => Number(d.amount)), 100));
  let points = $derived(data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * 100;
    const y = 100 - ((Number(d.amount) / maxAmount) * 100);
    return `${x},${y}`;
  }).join(' '));
  
  let totalRevenue = $derived(data.reduce((sum, d) => sum + Number(d.amount), 0));
</script>

<div class="bg-[#111318] p-6 border border-white/10 flex flex-col h-full">
  <div class="flex justify-between items-start mb-6">
    <div>
      <h3 class="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Gross Revenue (Period)</h3>
      <p class="text-3xl font-mono text-[#36f4a4] font-bold">${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
    </div>
  </div>
  
  <div class="flex-1 relative w-full min-h-[250px]">
    {#if data.length > 1}
      <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
        <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.05)" stroke-width="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" stroke-width="0.5" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.05)" stroke-width="0.5" />
        <polyline fill="none" stroke="#36f4a4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {points} />
        <polygon fill="url(#revGradient)" points="0,100 {points} 100,100" />
        <defs>
          <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(54, 244, 164, 0.2)" />
            <stop offset="100%" stop-color="rgba(54, 244, 164, 0)" />
          </linearGradient>
        </defs>
      </svg>
    {:else}
      <div class="w-full h-full flex items-center justify-center text-white/30 font-mono text-xs">Insufficient data for chart</div>
    {/if}
  </div>
</div>
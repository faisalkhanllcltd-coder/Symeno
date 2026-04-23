<script lang="ts">
  let zones = $state([
    { name: 'UAE (Domestic)', carriers: ['Aramex', 'Fetchr'], flatRate: 20, freeThreshold: 500, pickup: true },
    { name: 'GCC (Regional)', carriers: ['Aramex', 'DHL'], flatRate: 50, freeThreshold: 1500, pickup: false },
    { name: 'Rest of World', carriers: ['DHL'], flatRate: 150, freeThreshold: 0, pickup: false }
  ]);
  let isSubmitting = $state(false);
</script>

<div class="bg-[#111318] p-6 border border-white/10">
  <h2 class="text-xs font-bold text-white font-mono uppercase tracking-widest border-b border-white/10 pb-2 mb-6">Logistics & Zones</h2>
  
  <div class="space-y-6">
    {#each zones as zone}
      <div class="p-4 border border-white/5 bg-white/[0.02]">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-sm font-bold text-[#36f4a4] font-mono">{zone.name}</h3>
          <span class="text-[9px] text-white/40 uppercase tracking-widest">{zone.carriers.join(' | ')}</span>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] text-white/50 font-mono mb-1">Flat Rate (AED)</label>
            <input type="number" bind:value={zone.flatRate} class="w-full bg-[#1A1D23] border border-white/10 text-white p-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
          </div>
          <div>
            <label class="block text-[10px] text-white/50 font-mono mb-1">Free Shipping Over (AED)</label>
            <input type="number" bind:value={zone.freeThreshold} class="w-full bg-[#1A1D23] border border-white/10 text-white p-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
          </div>
        </div>
        {#if zone.name === 'UAE (Domestic)'}
          <label class="flex items-center gap-2 mt-4 cursor-pointer">
            <input type="checkbox" bind:checked={zone.pickup} class="w-4 h-4 accent-[#36f4a4] bg-[#1A1D23] border-white/10" />
            <span class="text-[10px] font-mono text-white/70 uppercase tracking-widest">Enable Local Pickup</span>
          </label>
        {/if}
      </div>
    {/each}
  </div>

  <div class="flex justify-end pt-6 mt-6 border-t border-white/10">
    <button class="bg-[#36f4a4] text-black px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors">Deploy Shipping Rules</button>
  </div>
</div>
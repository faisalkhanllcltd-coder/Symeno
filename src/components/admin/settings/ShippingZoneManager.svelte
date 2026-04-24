<script lang="ts">
  let zones = $state([
    {
      name: 'UAE (Domestic)',
      carriers: ['Aramex', 'Fetchr'],
      flatRate: 20,
      freeThreshold: 500,
      pickup: true,
    },
    {
      name: 'GCC (Regional)',
      carriers: ['Aramex', 'DHL'],
      flatRate: 50,
      freeThreshold: 1500,
      pickup: false,
    },
    {
      name: 'Rest of World',
      carriers: ['DHL'],
      flatRate: 150,
      freeThreshold: 0,
      pickup: false,
    },
  ]);
  let isSubmitting = $state(false);
</script>

<div class="border border-white/10 bg-[#111318] p-6">
  <h2
    class="mb-6 border-b border-white/10 pb-2 font-mono text-xs font-bold tracking-widest text-white uppercase"
  >
    Logistics & Zones
  </h2>

  <div class="space-y-6">
    {#each zones as zone}
      <div class="border border-white/5 bg-white/[0.02] p-4">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="font-mono text-sm font-bold text-[#36f4a4]">
            {zone.name}
          </h3>
          <span class="text-[9px] tracking-widest text-white/40 uppercase"
            >{zone.carriers.join(' | ')}</span
          >
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-1 block font-mono text-[10px] text-white/50"
              >Flat Rate (AED)</label
            >
            <input
              type="number"
              bind:value={zone.flatRate}
              class="w-full border border-white/10 bg-[#1A1D23] p-2 font-mono text-sm text-white focus:border-[#36f4a4]/50 focus:outline-none"
            />
          </div>
          <div>
            <label class="mb-1 block font-mono text-[10px] text-white/50"
              >Free Shipping Over (AED)</label
            >
            <input
              type="number"
              bind:value={zone.freeThreshold}
              class="w-full border border-white/10 bg-[#1A1D23] p-2 font-mono text-sm text-white focus:border-[#36f4a4]/50 focus:outline-none"
            />
          </div>
        </div>
        {#if zone.name === 'UAE (Domestic)'}
          <label class="mt-4 flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              bind:checked={zone.pickup}
              class="h-4 w-4 border-white/10 bg-[#1A1D23] accent-[#36f4a4]"
            />
            <span
              class="font-mono text-[10px] tracking-widest text-white/70 uppercase"
              >Enable Local Pickup</span
            >
          </label>
        {/if}
      </div>
    {/each}
  </div>

  <div class="mt-6 flex justify-end border-t border-white/10 pt-6">
    <button
      class="bg-[#36f4a4] px-6 py-2 text-[10px] font-bold tracking-widest text-black uppercase transition-colors hover:bg-white"
      >Deploy Shipping Rules</button
    >
  </div>
</div>

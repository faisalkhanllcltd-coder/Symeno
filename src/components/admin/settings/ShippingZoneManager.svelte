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

<div class="border border-outline bg-surface p-6">
  <h2
    class="mb-6 border-b border-outline pb-2 font-mono text-xs font-bold tracking-widest text-content uppercase"
  >
    Logistics & Zones
  </h2>

  <div class="space-y-6">
    {#each zones as zone}
      <div class="border border-outline bg-base p-4">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="font-mono text-sm font-bold text-brand">
            {zone.name}
          </h3>
          <span class="text-[9px] tracking-widest text-content-muted uppercase"
            >{zone.carriers.join(' | ')}</span
          >
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-1 block font-mono text-[10px] text-content-muted"
              >Flat Rate (AED)</label
            >
            <input
              type="number"
              bind:value={zone.flatRate}
              class="w-full border border-outline bg-surface p-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
            />
          </div>
          <div>
            <label class="mb-1 block font-mono text-[10px] text-content-muted"
              >Free Shipping Over (AED)</label
            >
            <input
              type="number"
              bind:value={zone.freeThreshold}
              class="w-full border border-outline bg-surface p-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
            />
          </div>
        </div>
        {#if zone.name === 'UAE (Domestic)'}
          <label class="mt-4 flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              bind:checked={zone.pickup}
              class="h-4 w-4 border-outline bg-surface accent-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
            />
            <span
              class="font-mono text-[10px] tracking-widest text-content-muted uppercase"
              >Enable Local Pickup</span
            >
          </label>
        {/if}
      </div>
    {/each}
  </div>

  <div class="mt-6 flex justify-end border-t border-outline pt-6">
    <button
      class="bg-brand px-6 py-2 text-[10px] font-bold tracking-widest text-black uppercase transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      >Deploy Shipping Rules</button
    >
  </div>
</div>

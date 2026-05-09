<script lang="ts">
  // Strictly mapped to the new catalog_cache output
  interface InventoryItem {
    id: string;
    name: string;
    slug: string;
    in_stock: number;
    price: number;
  }

  let { inventory = [] } = $props<{ inventory?: InventoryItem[] }>();

  let searchQuery = $state('');

  let filteredInventory = $derived(
    inventory.filter((item) => {
      const query = searchQuery.toLowerCase();
      const nameMatch = item.name?.toLowerCase().includes(query);
      const slugMatch = item.slug?.toLowerCase().includes(query);
      return nameMatch || slugMatch;
    })
  );
</script>

<div class="space-y-4">
  <div class="flex flex-col justify-between gap-3 sm:flex-row">
    <div class="relative w-full sm:w-80">
      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-content-muted">
        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search Matrix..."
        class="w-full rounded-sm border border-outline bg-base py-2 pr-4 pl-9 font-mono text-[10px] text-content transition-colors placeholder:text-content-muted/50 focus:border-brand/50 focus:outline-none focus-visible:ring-1 focus-visible:ring-brand shadow-inner"
      />
    </div>

    <div class="flex items-center gap-2 border border-outline bg-surface px-3 py-1 font-mono text-[9px] text-content-muted tracking-widest uppercase rounded-sm">
      <span>Indexed Slugs: <span class="font-bold text-brand">{filteredInventory.length}</span></span>
    </div>
  </div>

  <div class="overflow-x-auto rounded-md border border-outline bg-surface shadow-sm">
    <table class="w-full border-collapse text-left whitespace-nowrap">
      <thead>
        <tr class="border-b border-outline bg-base/50 font-mono text-[9px] tracking-widest text-content-muted uppercase">
          <th class="px-4 py-3 font-semibold">Slug / Identity</th>
          <th class="px-4 py-3 font-semibold">Asset Designation</th>
          <th class="px-4 py-3 text-right font-semibold">Base Price</th>
          <th class="px-4 py-3 text-right font-semibold">MSRP (UI Target)</th>
          <th class="px-4 py-3 text-center font-semibold">Allocation</th>
          <th class="px-4 py-3 text-right font-semibold">Terminal</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-outline/40">
        {#each filteredInventory as item}
          <tr class="group transition-colors hover:bg-white/[0.03]">
            <td class="px-4 py-3">
              <div class="flex flex-col gap-0.5">
                <span class="font-mono text-[10px] font-bold text-content max-w-[150px] truncate">{item.slug || 'N/A'}</span>
                {#if item.in_stock === 1}
                  <span class="flex items-center gap-1.5 text-[8px] tracking-widest text-brand uppercase">
                    <span class="h-1 w-1 rounded-full bg-brand animate-pulse"></span> Network Active
                  </span>
                {:else}
                  <span class="flex items-center gap-1.5 text-[8px] tracking-widest text-brand-alert uppercase">
                    <span class="h-1 w-1 rounded-full bg-brand-alert"></span> Disconnected
                  </span>
                {/if}
              </div>
            </td>
            <td class="px-4 py-3">
              <span class="block max-w-[280px] truncate font-medium text-[11px] text-content">{item.name}</span>
            </td>
            <td class="px-4 py-3 text-right font-mono text-[10px] text-content-muted">
              ${(item.price || 0).toFixed(2)}
            </td>
            <td class="px-4 py-3 text-right font-mono text-[10px] font-bold text-brand">
              ${(item.price ? item.price * 1.15 : 0).toFixed(2)}
            </td>
            <td class="px-4 py-3 text-center">
              <div class="inline-flex items-center rounded-sm border border-outline bg-base px-2 py-0.5 font-mono text-[9px]">
                <span class={item.in_stock === 1 ? 'text-brand' : 'text-brand-alert'}>
                  {item.in_stock === 1 ? 'LIVE' : 'ZERO'}
                </span>
              </div>
            </td>
            <td class="px-4 py-3 text-right">
              <a
                href={`/admin/products/${item.id}`}
                class="border border-transparent bg-base/50 px-2.5 py-1.5 font-mono text-[9px] tracking-widest text-content-muted uppercase transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand rounded-sm opacity-0 group-hover:opacity-100"
              >
                Manage
              </a>
            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="6" class="px-4 py-16 text-center text-content-muted font-mono text-[10px] uppercase tracking-widest">
              No active nodes matching your parameters.
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
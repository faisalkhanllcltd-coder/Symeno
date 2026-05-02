<script lang="ts">
  interface InventoryItem {
    id: number | string;
    title: string;
    is_active: boolean | number;
    slug: string;
    stock_quantity: number;
    wholesale_cost: number;
    retailPrice: number;
  }

  // SVELTE 5 UPGRADE: Strict typing via $props()
  let { inventory = [] } = $props<{ inventory?: InventoryItem[] }>();

  let searchQuery = $state('');

  // SVELTE 5 UPGRADE: Derived state instead of reactive $: blocks
  let filteredInventory = $derived(
    inventory.filter((item) => {
      const query = searchQuery.toLowerCase();
      const titleMatch = item.title?.toLowerCase().includes(query);
      const slugMatch = item.slug?.toLowerCase().includes(query);
      return titleMatch || slugMatch;
    })
  );
</script>

<div class="space-y-4">
  <div class="flex flex-col justify-between gap-4 sm:flex-row">
    <div class="relative w-full sm:w-96">
      <div
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-content-muted"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          /></svg
        >
      </div>
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search by Title or Slug..."
        class="w-full border border-outline bg-base py-2 pr-4 pl-10 font-mono text-sm text-content transition-colors placeholder:text-content-muted focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      />
    </div>

    <div class="flex items-center gap-2 font-mono text-xs text-content-muted">
      <span
        >Total Slugs: <span class="font-bold text-content"
          >{filteredInventory.length}</span
        ></span
      >
    </div>
  </div>

  <div
    class="overflow-x-auto border border-outline bg-surface shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]"
  >
    <table class="w-full border-collapse text-left whitespace-nowrap">
      <thead>
        <tr
          class="border-b border-outline bg-surface font-mono text-[10px] tracking-widest text-content-muted uppercase"
        >
          <th class="px-6 py-4 font-semibold">Slug / Status</th>
          <th class="px-6 py-4 font-semibold">Product Title</th>
          <th class="px-6 py-4 text-right font-semibold">Wholesale</th>
          <th class="px-6 py-4 text-right font-semibold">Retail</th>
          <th class="px-6 py-4 text-right font-semibold">Gross Margin</th>
          <th class="px-6 py-4 text-right font-semibold">Stock</th>
          <th class="px-6 py-4 text-center font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-outline text-sm">
        {#each filteredInventory as item}
          <tr class="group transition-colors hover:bg-white/[0.02]">
            <td class="px-6 py-4">
              <div class="flex flex-col gap-1">
                <span class="font-mono font-bold text-brand"
                  >{item.slug || 'N/A'}</span
                >
                {#if item.is_active}
                  <span
                    class="flex items-center gap-1 text-[9px] tracking-widest text-brand/70 uppercase"
                    ><span class="h-1.5 w-1.5 rounded-full bg-brand"></span> Active</span
                  >
                {:else}
                  <span
                    class="flex items-center gap-1 text-[9px] tracking-widest text-brand-alert/70 uppercase"
                    ><span class="h-1.5 w-1.5 rounded-full bg-brand-alert"></span> Inactive</span
                  >
                {/if}
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="block max-w-[250px] truncate font-medium text-content"
                >{item.title}</span
              >
            </td>
            <td class="px-6 py-4 text-right font-mono text-content-muted">
              ${(item.wholesale_cost || 0).toFixed(2)}
            </td>
            <td class="px-6 py-4 text-right font-mono font-bold text-content">
              ${(item.retailPrice || 0).toFixed(2)}
            </td>
            <td class="px-6 py-4 text-right font-mono">
              {#if item.wholesale_cost > 0 && item.retailPrice > 0}
                {@const margin = (
                  ((item.retailPrice - item.wholesale_cost) /
                    item.retailPrice) *
                  100
                ).toFixed(1)}
                <span
                  class={parseFloat(margin) > 20
                    ? 'text-brand'
                    : 'text-amber-400'}>{margin}%</span
                >
                <span class="mt-0.5 block text-[10px] text-content-muted"
                  >+${(item.retailPrice - item.wholesale_cost).toFixed(
                    2
                  )}</span
                >
              {:else}
                <span class="text-content-muted">N/A</span>
              {/if}
            </td>
            <td class="px-6 py-4 text-right">
              <div
                class="inline-flex items-center rounded border border-outline bg-surface px-2 py-1 font-mono text-xs"
              >
                <span
                  class={item.stock_quantity <= 5
                    ? 'animate-pulse text-brand-alert'
                    : 'text-content'}>{item.stock_quantity || 0}</span
                >
              </div>
            </td>
            <td class="px-6 py-4 text-center">
              <a
                href={`/admin/products/${item.id}`}
                class="border border-transparent px-2 py-1 font-mono text-[10px] tracking-widest text-content-muted uppercase transition-colors hover:border-outline hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
              >
                Edit
              </a>
            </td>
          </tr>
        {:else}
          <tr>
            <td
              colspan="7"
              class="px-6 py-12 text-center text-content-muted font-mono text-sm"
            >
              No inventory records found matching your criteria.
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

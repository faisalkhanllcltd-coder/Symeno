<script lang="ts">
  let { inventory = [] } = $props<{ inventory?: any[] }>();
  let searchQuery = $state('');

  let filtered = $derived(
    inventory.filter(
      (item) =>
        item.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.product_title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
</script>

<div class="flex h-full flex-col border border-outline bg-surface">
  <div class="flex justify-between border-b border-outline p-4">
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Search SKUs or Titles..."
      class="w-72 border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
    />
    <a
      href="/api/admin/inventory/export"
      target="_blank"
      class="border border-outline px-4 py-2 font-mono text-[10px] tracking-widest text-content-muted uppercase transition-colors hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      >Export CSV</a
    >
  </div>

  <div class="flex-1 overflow-x-auto">
    <table class="w-full border-collapse text-left whitespace-nowrap">
      <thead>
        <tr
          class="border-b border-outline bg-surface font-mono text-[10px] tracking-widest text-content-muted uppercase"
        >
          <th class="p-4 font-normal">SKU</th>
          <th class="p-4 font-normal">Product & Variant</th>
          <th class="p-4 text-right font-normal">Available</th>
          <th class="p-4 text-right font-normal">Reserved (Carts)</th>
          <th class="p-4 text-right font-normal">Status</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-outline">
        {#each filtered as item}
          <tr class="transition-colors hover:bg-white/[0.02]">
            <td class="p-4 font-mono text-xs font-bold text-brand"
              >{item.sku || 'NO-SKU'}</td
            >
            <td class="p-4 text-xs">
              <a
                href={`/admin/products/${item.product_id}`}
                class="block text-content hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm">{item.product_title}</a
              >
              <span class="font-mono text-[10px] text-content-muted"
                >{item.variant_title !== 'Default'
                  ? item.variant_title
                  : ''}</span
              >
            </td>
            <td
              class="p-4 text-right font-mono text-xs {item.stock <= 5
                ? 'text-brand-alert'
                : 'text-content'}">{item.stock}</td
            >
            <td class="p-4 text-right font-mono text-xs text-content-muted">0</td>
            <td class="p-4 text-right">
              {#if item.is_active}
                <span
                  class="border border-brand/30 bg-brand/10 px-2 py-1 text-[9px] tracking-widest text-brand uppercase"
                  >Active</span
                >
              {:else}
                <span
                  class="border border-outline bg-white/5 px-2 py-1 text-[9px] tracking-widest text-content-muted uppercase"
                  >Draft</span
                >
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

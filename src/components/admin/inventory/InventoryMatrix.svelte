<script lang="ts">
  let { inventory = [] } = $props<{ inventory: any[] }>();
  let searchQuery = $state('');

  let filtered = $derived(
    inventory.filter(
      (item) =>
        item.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.product_title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
</script>

<div class="flex h-full flex-col border border-white/10 bg-[#111318]">
  <div class="flex justify-between border-b border-white/10 p-4">
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Search SKUs or Titles..."
      class="w-72 border border-white/10 bg-[#1A1D23] px-3 py-2 font-mono text-sm text-white focus:border-[#36f4a4]/50 focus:outline-none"
    />
    <a
      href="/api/admin/inventory/export"
      target="_blank"
      class="border border-white/10 px-4 py-2 font-mono text-[10px] tracking-widest text-white/70 uppercase transition-colors hover:text-white"
      >Export CSV</a
    >
  </div>

  <div class="flex-1 overflow-x-auto">
    <table class="w-full border-collapse text-left whitespace-nowrap">
      <thead>
        <tr
          class="border-b border-white/10 bg-[#0a0b0e] font-mono text-[10px] tracking-widest text-white/40 uppercase"
        >
          <th class="p-4 font-normal">SKU</th>
          <th class="p-4 font-normal">Product & Variant</th>
          <th class="p-4 text-right font-normal">Available</th>
          <th class="p-4 text-right font-normal">Reserved (Carts)</th>
          <th class="p-4 text-right font-normal">Status</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/[0.04]">
        {#each filtered as item}
          <tr class="transition-colors hover:bg-white/[0.02]">
            <td class="p-4 font-mono text-xs font-bold text-[#36f4a4]"
              >{item.sku || 'NO-SKU'}</td
            >
            <td class="p-4 text-xs">
              <a
                href={`/admin/products/${item.product_id}`}
                class="block text-white hover:underline">{item.product_title}</a
              >
              <span class="font-mono text-[10px] text-white/50"
                >{item.variant_title !== 'Default'
                  ? item.variant_title
                  : ''}</span
              >
            </td>
            <td
              class="p-4 text-right font-mono text-xs {item.stock <= 5
                ? 'text-rose-400'
                : 'text-white'}">{item.stock}</td
            >
            <td class="p-4 text-right font-mono text-xs text-white/30">0</td>
            <td class="p-4 text-right">
              {#if item.is_active}
                <span
                  class="border border-[#36f4a4]/30 bg-[#36f4a4]/10 px-2 py-1 text-[9px] tracking-widest text-[#36f4a4] uppercase"
                  >Active</span
                >
              {:else}
                <span
                  class="border border-white/10 bg-white/5 px-2 py-1 text-[9px] tracking-widest text-white/50 uppercase"
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

<script lang="ts">
  let { inventory = [] } = $props<{ inventory: any[] }>();
  let searchQuery = $state('');

  let filtered = $derived(inventory.filter(item => 
    item.sku?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.product_title?.toLowerCase().includes(searchQuery.toLowerCase())
  ));
</script>

<div class="bg-[#111318] border border-white/10 flex flex-col h-full">
  <div class="p-4 border-b border-white/10 flex justify-between">
    <input type="text" bind:value={searchQuery} placeholder="Search SKUs or Titles..." class="w-72 bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
    <a href="/api/admin/inventory/export" target="_blank" class="border border-white/10 text-white/70 hover:text-white px-4 py-2 text-[10px] font-mono uppercase tracking-widest transition-colors">Export CSV</a>
  </div>
  
  <div class="flex-1 overflow-x-auto">
    <table class="w-full text-left border-collapse whitespace-nowrap">
      <thead>
        <tr class="bg-[#0a0b0e] border-b border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/40">
          <th class="p-4 font-normal">SKU</th>
          <th class="p-4 font-normal">Product & Variant</th>
          <th class="p-4 font-normal text-right">Available</th>
          <th class="p-4 font-normal text-right">Reserved (Carts)</th>
          <th class="p-4 font-normal text-right">Status</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/[0.04]">
        {#each filtered as item}
          <tr class="hover:bg-white/[0.02] transition-colors">
            <td class="p-4 text-xs font-mono font-bold text-[#36f4a4]">{item.sku || 'NO-SKU'}</td>
            <td class="p-4 text-xs">
              <a href={`/admin/products/${item.product_id}`} class="text-white hover:underline block">{item.product_title}</a>
              <span class="text-[10px] text-white/50 font-mono">{item.variant_title !== 'Default' ? item.variant_title : ''}</span>
            </td>
            <td class="p-4 text-xs font-mono text-right {item.stock <= 5 ? 'text-rose-400' : 'text-white'}">{item.stock}</td>
            <td class="p-4 text-xs font-mono text-white/30 text-right">0</td>
            <td class="p-4 text-right">
              {#if item.is_active}
                <span class="text-[9px] px-2 py-1 uppercase tracking-widest border border-[#36f4a4]/30 text-[#36f4a4] bg-[#36f4a4]/10">Active</span>
              {:else}
                <span class="text-[9px] px-2 py-1 uppercase tracking-widest border border-white/10 text-white/50 bg-white/5">Draft</span>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
<script lang="ts">
  interface InventoryItem {
    id: number | string;
    title: string;
    is_active: boolean | number;
    sku: string;
    stock_quantity: number;
    wholesale_cost: number;
    retail_price: number;
  }

  // SVELTE 5 UPGRADE: Strict typing via $props()
  let { inventory = [] } = $props<{ inventory: InventoryItem[] }>();
  
  let searchQuery = $state('');
  
  // SVELTE 5 UPGRADE: Derived state instead of reactive $: blocks
  let filteredInventory = $derived(
    inventory.filter(item => {
      const query = searchQuery.toLowerCase();
      const titleMatch = item.title?.toLowerCase().includes(query);
      const skuMatch = item.sku?.toLowerCase().includes(query);
      return titleMatch || skuMatch;
    })
  );
</script>

<div class="space-y-4">
  <div class="flex flex-col sm:flex-row justify-between gap-4">
    <div class="relative w-full sm:w-96">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#dae5e6]/40">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
      </div>
      <input 
        type="text" 
        bind:value={searchQuery}
        placeholder="Search by Title or SKU..." 
        class="w-full bg-[#0b1516] border border-[#dae5e6]/10 text-white pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 transition-colors font-mono placeholder:text-[#dae5e6]/30"
      />
    </div>
    
    <div class="flex items-center gap-2 text-xs font-mono text-[#dae5e6]/50">
      <span>Total SKUs: <span class="text-white font-bold">{filteredInventory.length}</span></span>
    </div>
  </div>

  <div class="bg-[#131d1e] border border-[#dae5e6]/10 overflow-x-auto shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]">
    <table class="w-full text-left border-collapse whitespace-nowrap">
      <thead>
        <tr class="bg-[#070d0e] border-b border-[#dae5e6]/10 text-[10px] uppercase tracking-widest text-[#dae5e6]/50 font-mono">
          <th class="px-6 py-4 font-semibold">SKU / Status</th>
          <th class="px-6 py-4 font-semibold">Product Title</th>
          <th class="px-6 py-4 font-semibold text-right">Wholesale</th>
          <th class="px-6 py-4 font-semibold text-right">Retail</th>
          <th class="px-6 py-4 font-semibold text-right">Gross Margin</th>
          <th class="px-6 py-4 font-semibold text-right">Stock</th>
          <th class="px-6 py-4 font-semibold text-center">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-[#dae5e6]/5 text-sm">
        {#each filteredInventory as item}
          <tr class="hover:bg-[#0b1516] transition-colors group">
            <td class="px-6 py-4">
              <div class="flex flex-col gap-1">
                <span class="font-mono text-[#36f4a4] font-bold">{item.sku || 'N/A'}</span>
                {#if item.is_active}
                  <span class="text-[9px] uppercase tracking-widest text-[#36f4a4]/70 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-[#36f4a4]"></span> Active</span>
                {:else}
                  <span class="text-[9px] uppercase tracking-widest text-rose-400/70 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Inactive</span>
                {/if}
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="font-medium text-white block truncate max-w-[250px]">{item.title}</span>
            </td>
            <td class="px-6 py-4 text-right font-mono text-[#dae5e6]/60">
              ${(item.wholesale_cost || 0).toFixed(2)}
            </td>
            <td class="px-6 py-4 text-right font-mono text-white font-bold">
              ${(item.retail_price || 0).toFixed(2)}
            </td>
            <td class="px-6 py-4 text-right font-mono">
              {#if item.wholesale_cost > 0 && item.retail_price > 0}
                {@const margin = ((item.retail_price - item.wholesale_cost) / item.retail_price * 100).toFixed(1)}
                <span class="{parseFloat(margin) > 20 ? 'text-[#36f4a4]' : 'text-amber-400'}">{margin}%</span>
                <span class="block text-[10px] text-[#dae5e6]/40 mt-0.5">+${(item.retail_price - item.wholesale_cost).toFixed(2)}</span>
              {:else}
                <span class="text-[#dae5e6]/30">N/A</span>
              {/if}
            </td>
            <td class="px-6 py-4 text-right">
              <div class="inline-flex items-center px-2 py-1 rounded bg-[#070d0e] border border-[#dae5e6]/10 font-mono text-xs">
                <span class="{item.stock_quantity <= 5 ? 'text-rose-400 animate-pulse' : 'text-white'}">{item.stock_quantity || 0}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-center">
              <a href={`/admin/products/${item.id}`} class="text-[#dae5e6]/40 hover:text-white transition-colors text-[10px] font-mono uppercase tracking-widest border border-transparent hover:border-[#dae5e6]/20 px-2 py-1 focus:outline-none">
                Edit
              </a>
            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="7" class="px-6 py-12 text-center text-[#dae5e6]/40 font-mono text-sm">
              No inventory records found matching your criteria.
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
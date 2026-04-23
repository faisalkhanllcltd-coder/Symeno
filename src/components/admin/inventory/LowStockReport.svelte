<script lang="ts">
  let { inventory = [] } = $props<{ inventory: any[] }>();
  let lowStockThreshold = 5;
  let criticalItems = $derived(inventory.filter(i => i.stock <= lowStockThreshold).sort((a,b) => a.stock - b.stock));
</script>

<div class="bg-[#111318] border border-rose-500/30 overflow-hidden h-full flex flex-col">
  <div class="p-4 border-b border-rose-500/30 bg-rose-500/5">
    <h3 class="text-[10px] font-bold uppercase tracking-widest text-rose-400 font-mono">Critical Low Stock Report</h3>
  </div>
  <div class="flex-1 overflow-y-auto">
    <ul class="divide-y divide-white/5">
      {#each criticalItems as item}
        <li class="p-4 hover:bg-white/[0.02] flex justify-between items-center">
          <div>
            <div class="text-xs font-bold text-white">{item.product_title}</div>
            <div class="text-[10px] text-white/50 font-mono mt-1">SKU: <span class="text-[#36f4a4]">{item.sku}</span></div>
          </div>
          <div class="text-right">
            <span class="text-xs font-mono font-bold {item.stock === 0 ? 'text-rose-500' : 'text-amber-400'} border {item.stock === 0 ? 'border-rose-500/30 bg-rose-500/10' : 'border-amber-500/30 bg-amber-500/10'} px-2 py-1">
              {item.stock} Left
            </span>
          </div>
        </li>
      {:else}
        <li class="p-8 text-center text-[10px] font-mono text-white/30 uppercase">All inventory levels above threshold.</li>
      {/each}
    </ul>
  </div>
</div>
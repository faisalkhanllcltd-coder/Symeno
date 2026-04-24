<script lang="ts">
  let { inventory = [] } = $props<{ inventory: any[] }>();
  let lowStockThreshold = 5;
  let criticalItems = $derived(
    inventory
      .filter((i) => i.stock <= lowStockThreshold)
      .sort((a, b) => a.stock - b.stock)
  );
</script>

<div
  class="flex h-full flex-col overflow-hidden border border-rose-500/30 bg-[#111318]"
>
  <div class="border-b border-rose-500/30 bg-rose-500/5 p-4">
    <h3
      class="font-mono text-[10px] font-bold tracking-widest text-rose-400 uppercase"
    >
      Critical Low Stock Report
    </h3>
  </div>
  <div class="flex-1 overflow-y-auto">
    <ul class="divide-y divide-white/5">
      {#each criticalItems as item}
        <li class="flex items-center justify-between p-4 hover:bg-white/[0.02]">
          <div>
            <div class="text-xs font-bold text-white">{item.product_title}</div>
            <div class="mt-1 font-mono text-[10px] text-white/50">
              SKU: <span class="text-[#36f4a4]">{item.sku}</span>
            </div>
          </div>
          <div class="text-right">
            <span
              class="font-mono text-xs font-bold {item.stock === 0
                ? 'text-rose-500'
                : 'text-amber-400'} border {item.stock === 0
                ? 'border-rose-500/30 bg-rose-500/10'
                : 'border-amber-500/30 bg-amber-500/10'} px-2 py-1"
            >
              {item.stock} Left
            </span>
          </div>
        </li>
      {:else}
        <li
          class="p-8 text-center text-[10px] font-mono text-white/30 uppercase"
        >
          All inventory levels above threshold.
        </li>
      {/each}
    </ul>
  </div>
</div>

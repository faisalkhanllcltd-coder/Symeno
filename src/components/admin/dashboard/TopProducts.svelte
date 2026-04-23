<script lang="ts">
  let { products = [] } = $props<{ products: { title: string, revenue: number }[] }>();
  let maxRevenue = $derived(Math.max(...products.map(p => p.revenue), 1));
</script>

<div class="bg-[#111318] p-6 border border-white/10 h-full">
  <h3 class="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-6">Top Performers (Revenue)</h3>
  <div class="space-y-4">
    {#each products as product}
      {@const width = (product.revenue / maxRevenue) * 100}
      <div>
        <div class="flex justify-between text-xs font-mono text-white/80 mb-1">
          <span class="truncate max-w-[200px]">{product.title}</span>
          <span class="text-[#36f4a4]">${product.revenue.toLocaleString()}</span>
        </div>
        <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
          <div class="bg-[#36f4a4] h-full" style="width: {width}%"></div>
        </div>
      </div>
    {:else}
      <div class="text-center text-[10px] font-mono text-white/30 uppercase mt-8">No sales data available.</div>
    {/each}
  </div>
</div>
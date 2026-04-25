<script lang="ts">
  let { products = [] } = $props<{
    products?: { title: string; revenue: number }[];
  }>();
  let maxRevenue = $derived(Math.max(...products.map((p) => p.revenue), 1));
</script>

<div class="h-full border border-outline bg-surface p-6">
  <h3
    class="mb-6 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
  >
    Top Performers (Revenue)
  </h3>
  <div class="space-y-4">
    {#each products as product}
      {@const width = (product.revenue / maxRevenue) * 100}
      <div>
        <div class="mb-1 flex justify-between font-mono text-xs text-content-muted">
          <span class="max-w-[200px] truncate text-content">{product.title}</span>
          <span class="text-brand">${product.revenue.toLocaleString()}</span>
        </div>
        <div class="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div class="h-full bg-brand" style="width: {width}%"></div>
        </div>
      </div>
    {:else}
      <div
        class="text-center text-[10px] font-mono text-content-muted uppercase mt-8"
      >
        No sales data available.
      </div>
    {/each}
  </div>
</div>

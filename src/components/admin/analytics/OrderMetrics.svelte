<script lang="ts">
  let { data = [] } = $props<{ data?: any[] }>();
  let totalOrders = $derived(data.reduce((sum, d) => sum + Number(d.count), 0));
</script>

<div class="h-full border border-outline bg-surface p-6">
  <h3
    class="mb-6 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
  >
    Order Status Distribution
  </h3>
  <div class="mb-8 flex items-center justify-center">
    <div class="text-center">
      <div class="mb-2 font-mono text-4xl text-content">{totalOrders}</div>
      <div
        class="font-mono text-[10px] tracking-widest text-content-muted uppercase"
      >
        Total Orders
      </div>
    </div>
  </div>
  <div class="space-y-4">
    {#each data as item}
      {@const percentage = ((Number(item.count) / totalOrders) * 100).toFixed(
        1
      )}
      <div>
        <div class="mb-1 flex justify-between font-mono text-[10px]">
          <span class="text-content-muted uppercase">{item.status}</span>
          <span class="font-bold text-content"
            >{item.count}
            <span class="text-content-muted">({percentage}%)</span></span
          >
        </div>
        <div class="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            class="h-full {item.status === 'CANCELLED' ||
            item.status === 'REFUNDED'
              ? 'bg-brand-alert'
              : 'bg-brand'}"
            style="width: {percentage}%"
          ></div>
        </div>
      </div>
    {/each}
  </div>
</div>

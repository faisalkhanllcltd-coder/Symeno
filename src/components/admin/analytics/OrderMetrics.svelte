<script lang="ts">
  let { data = [] } = $props<{ data: any[] }>();
  let totalOrders = $derived(data.reduce((sum, d) => sum + Number(d.count), 0));
</script>

<div class="h-full border border-white/10 bg-[#111318] p-6">
  <h3
    class="mb-6 font-mono text-[10px] font-bold tracking-widest text-white/50 uppercase"
  >
    Order Status Distribution
  </h3>
  <div class="mb-8 flex items-center justify-center">
    <div class="text-center">
      <div class="mb-2 font-mono text-4xl text-white">{totalOrders}</div>
      <div
        class="font-mono text-[10px] tracking-widest text-white/40 uppercase"
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
          <span class="text-white/70 uppercase">{item.status}</span>
          <span class="font-bold text-white"
            >{item.count}
            <span class="text-white/30">({percentage}%)</span></span
          >
        </div>
        <div class="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            class="h-full {item.status === 'CANCELLED' ||
            item.status === 'REFUNDED'
              ? 'bg-rose-400'
              : 'bg-[#36f4a4]'}"
            style="width: {percentage}%"
          ></div>
        </div>
      </div>
    {/each}
  </div>
</div>

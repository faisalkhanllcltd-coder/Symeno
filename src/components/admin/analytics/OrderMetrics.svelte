<script lang="ts">
  let { data = [] } = $props<{ data: any[] }>();
  let totalOrders = $derived(data.reduce((sum, d) => sum + Number(d.count), 0));
</script>

<div class="bg-[#111318] p-6 border border-white/10 h-full">
  <h3 class="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-6">Order Status Distribution</h3>
  <div class="flex items-center justify-center mb-8">
    <div class="text-center">
      <div class="text-4xl font-mono text-white mb-2">{totalOrders}</div>
      <div class="text-[10px] font-mono text-white/40 uppercase tracking-widest">Total Orders</div>
    </div>
  </div>
  <div class="space-y-4">
    {#each data as item}
      {@const percentage = ((Number(item.count) / totalOrders) * 100).toFixed(1)}
      <div>
        <div class="flex justify-between text-[10px] font-mono mb-1">
          <span class="text-white/70 uppercase">{item.status}</span>
          <span class="text-white font-bold">{item.count} <span class="text-white/30">({percentage}%)</span></span>
        </div>
        <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
          <div class="h-full {item.status === 'CANCELLED' || item.status === 'REFUNDED' ? 'bg-rose-400' : 'bg-[#36f4a4]'}" style="width: {percentage}%"></div>
        </div>
      </div>
    {/each}
  </div>
</div>
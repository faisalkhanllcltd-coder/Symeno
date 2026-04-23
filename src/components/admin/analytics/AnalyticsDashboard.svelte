<script lang="ts">
  interface Metrics {
    revenue: number;
    orders: number;
    activeUsers: number;
  }
  let { metrics = { revenue: 0, orders: 0, activeUsers: 0 } } = $props<{ metrics: Metrics }>();
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div class="bg-[#111318] p-6 border border-white/10 flex flex-col justify-between">
    <h3 class="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-4">Gross Revenue</h3>
    <p class="text-3xl text-[#36f4a4] font-mono">${metrics.revenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
  </div>
  <div class="bg-[#111318] p-6 border border-white/10 flex flex-col justify-between">
    <h3 class="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-4">Total Orders</h3>
    <p class="text-3xl text-white font-mono">{metrics.orders}</p>
  </div>
  <div class="bg-[#111318] p-6 border border-white/10 flex flex-col justify-between">
    <h3 class="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-4">Active Sessions</h3>
    <p class="text-3xl text-amber-400 font-mono">{metrics.activeUsers}</p>
  </div>
</div>
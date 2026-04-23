<script lang="ts">
  let { metrics } = $props<{ 
    metrics: {
      revenueToday: number; revenueChange: number;
      ordersToday: number; ordersWeek: number;
      newCustomers: number; conversionRate: number;
      aov: number; pendingFulfillment: number;
      lowStockCount: number; pendingReturns: number;
    } 
  }>();

  const formatMoney = (val: number) => `$${val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
</script>

<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
  <div class="bg-[#111318] p-4 border border-white/10 flex flex-col justify-between">
    <h3 class="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Revenue (24h)</h3>
    <p class="text-2xl text-[#36f4a4] font-mono">{formatMoney(metrics.revenueToday)}</p>
    <div class="mt-2 text-[10px] font-mono {metrics.revenueChange >= 0 ? 'text-[#36f4a4]' : 'text-rose-400'}">
      {metrics.revenueChange >= 0 ? '+' : ''}{metrics.revenueChange.toFixed(1)}% vs yesterday
    </div>
  </div>

  <div class="bg-[#111318] p-4 border border-white/10 flex flex-col justify-between">
    <h3 class="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Avg Order Value</h3>
    <p class="text-2xl text-white font-mono">{formatMoney(metrics.aov)}</p>
    <div class="mt-2 text-[10px] font-mono text-white/40">Trailing 7 Days</div>
  </div>

  <div class="bg-[#111318] p-4 border border-white/10 flex flex-col justify-between">
    <h3 class="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Orders (24h)</h3>
    <p class="text-2xl text-white font-mono">{metrics.ordersToday}</p>
    <div class="mt-2 text-[10px] font-mono text-white/40">{metrics.ordersWeek} this week</div>
  </div>

  <div class="bg-[#111318] p-4 border {metrics.pendingFulfillment > 10 ? 'border-rose-500/50 bg-rose-500/5' : 'border-white/10'} flex flex-col justify-between">
    <h3 class="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Pending Dispatch</h3>
    <p class="text-2xl font-mono {metrics.pendingFulfillment > 10 ? 'text-rose-400' : 'text-white'}">{metrics.pendingFulfillment}</p>
    <div class="mt-2 text-[10px] font-mono text-white/40">Awaiting shipment</div>
  </div>

  <div class="bg-[#111318] p-4 border {metrics.lowStockCount > 0 ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/10'} flex flex-col justify-between">
    <h3 class="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Low Stock SKUs</h3>
    <p class="text-2xl font-mono {metrics.lowStockCount > 0 ? 'text-amber-400' : 'text-white'}">{metrics.lowStockCount}</p>
    <div class="mt-2 text-[10px] font-mono text-white/40">Requires restock</div>
  </div>
</div>
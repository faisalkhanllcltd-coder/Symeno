<script lang="ts">
  let { metrics } = $props<{
    metrics: {
      revenueToday: number;
      revenueChange: number;
      ordersToday: number;
      ordersWeek: number;
      newCustomers: number;
      conversionRate: number;
      aov: number;
      pendingFulfillment: number;
      lowStockCount: number;
      pendingReturns: number;
    };
  }>();

  const formatMoney = (val: number) =>
    `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
</script>

<div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
  <div
    class="flex flex-col justify-between border border-white/10 bg-[#111318] p-4"
  >
    <h3
      class="mb-2 font-mono text-[10px] font-bold tracking-widest text-white/50 uppercase"
    >
      Revenue (24h)
    </h3>
    <p class="font-mono text-2xl text-[#36f4a4]">
      {formatMoney(metrics.revenueToday)}
    </p>
    <div
      class="mt-2 font-mono text-[10px] {metrics.revenueChange >= 0
        ? 'text-[#36f4a4]'
        : 'text-rose-400'}"
    >
      {metrics.revenueChange >= 0 ? '+' : ''}{metrics.revenueChange.toFixed(1)}%
      vs yesterday
    </div>
  </div>

  <div
    class="flex flex-col justify-between border border-white/10 bg-[#111318] p-4"
  >
    <h3
      class="mb-2 font-mono text-[10px] font-bold tracking-widest text-white/50 uppercase"
    >
      Avg Order Value
    </h3>
    <p class="font-mono text-2xl text-white">{formatMoney(metrics.aov)}</p>
    <div class="mt-2 font-mono text-[10px] text-white/40">Trailing 7 Days</div>
  </div>

  <div
    class="flex flex-col justify-between border border-white/10 bg-[#111318] p-4"
  >
    <h3
      class="mb-2 font-mono text-[10px] font-bold tracking-widest text-white/50 uppercase"
    >
      Orders (24h)
    </h3>
    <p class="font-mono text-2xl text-white">{metrics.ordersToday}</p>
    <div class="mt-2 font-mono text-[10px] text-white/40">
      {metrics.ordersWeek} this week
    </div>
  </div>

  <div
    class="border bg-[#111318] p-4 {metrics.pendingFulfillment > 10
      ? 'border-rose-500/50 bg-rose-500/5'
      : 'border-white/10'} flex flex-col justify-between"
  >
    <h3
      class="mb-2 font-mono text-[10px] font-bold tracking-widest text-white/50 uppercase"
    >
      Pending Dispatch
    </h3>
    <p
      class="font-mono text-2xl {metrics.pendingFulfillment > 10
        ? 'text-rose-400'
        : 'text-white'}"
    >
      {metrics.pendingFulfillment}
    </p>
    <div class="mt-2 font-mono text-[10px] text-white/40">
      Awaiting shipment
    </div>
  </div>

  <div
    class="border bg-[#111318] p-4 {metrics.lowStockCount > 0
      ? 'border-amber-500/50 bg-amber-500/5'
      : 'border-white/10'} flex flex-col justify-between"
  >
    <h3
      class="mb-2 font-mono text-[10px] font-bold tracking-widest text-white/50 uppercase"
    >
      Low Stock SKUs
    </h3>
    <p
      class="font-mono text-2xl {metrics.lowStockCount > 0
        ? 'text-amber-400'
        : 'text-white'}"
    >
      {metrics.lowStockCount}
    </p>
    <div class="mt-2 font-mono text-[10px] text-white/40">Requires restock</div>
  </div>
</div>

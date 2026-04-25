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
    class="flex flex-col justify-between border border-outline bg-surface p-4"
  >
    <h3
      class="mb-2 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
    >
      Revenue (24h)
    </h3>
    <p class="font-mono text-2xl text-brand">
      {formatMoney(metrics.revenueToday)}
    </p>
    <div
      class="mt-2 font-mono text-[10px] {metrics.revenueChange >= 0
        ? 'text-brand'
        : 'text-brand-alert'}"
    >
      {metrics.revenueChange >= 0 ? '+' : ''}{metrics.revenueChange.toFixed(1)}%
      vs yesterday
    </div>
  </div>

  <div
    class="flex flex-col justify-between border border-outline bg-surface p-4"
  >
    <h3
      class="mb-2 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
    >
      Avg Order Value
    </h3>
    <p class="font-mono text-2xl text-content">{formatMoney(metrics.aov)}</p>
    <div class="mt-2 font-mono text-[10px] text-content-muted">Trailing 7 Days</div>
  </div>

  <div
    class="flex flex-col justify-between border border-outline bg-surface p-4"
  >
    <h3
      class="mb-2 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
    >
      Orders (24h)
    </h3>
    <p class="font-mono text-2xl text-content">{metrics.ordersToday}</p>
    <div class="mt-2 font-mono text-[10px] text-content-muted">
      {metrics.ordersWeek} this week
    </div>
  </div>

  <div
    class="border bg-surface p-4 {metrics.pendingFulfillment > 10
      ? 'border-brand-alert/50 bg-brand-alert/5'
      : 'border-outline'} flex flex-col justify-between"
  >
    <h3
      class="mb-2 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
    >
      Pending Dispatch
    </h3>
    <p
      class="font-mono text-2xl {metrics.pendingFulfillment > 10
        ? 'text-brand-alert'
        : 'text-content'}"
    >
      {metrics.pendingFulfillment}
    </p>
    <div class="mt-2 font-mono text-[10px] text-content-muted">
      Awaiting shipment
    </div>
  </div>

  <div
    class="border bg-surface p-4 {metrics.lowStockCount > 0
      ? 'border-amber-500/50 bg-amber-500/5'
      : 'border-outline'} flex flex-col justify-between"
  >
    <h3
      class="mb-2 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
    >
      Low Stock SKUs
    </h3>
    <p
      class="font-mono text-2xl {metrics.lowStockCount > 0
        ? 'text-amber-400'
        : 'text-content'}"
    >
      {metrics.lowStockCount}
    </p>
    <div class="mt-2 font-mono text-[10px] text-content-muted">Requires restock</div>
  </div>
</div>

<script lang="ts">
  interface Metrics {
    revenue: number;
    orders: number;
    activeUsers: number;
  }
  let { metrics = { revenue: 0, orders: 0, activeUsers: 0 } } = $props<{
    metrics?: Metrics;
  }>();
</script>

<div class="grid grid-cols-1 gap-6 md:grid-cols-3">     
  <div
    class="flex flex-col justify-between border border-outline bg-surface p-6"
  >
    <h3
      class="mb-4 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
    >
      Gross Revenue
    </h3>
    <p class="font-mono text-3xl text-brand">       
      ${metrics.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
    </p>
  </div>
  <div
    class="flex flex-col justify-between border border-outline bg-surface p-6"
  >
    <h3
      class="mb-4 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
    >
      Total Orders
    </h3>
    <p class="font-mono text-3xl text-content">{metrics.orders}</p>
  </div>
  <div
    class="flex flex-col justify-between border border-outline bg-surface p-6"
  >
    <h3
      class="mb-4 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
    >
      Active Sessions
    </h3>
    <p class="font-mono text-3xl text-content">{metrics.activeUsers}</p>
  </div>
</div>
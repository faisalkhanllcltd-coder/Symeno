<script lang="ts">
  let { reports = [] } = $props<{ reports?: any[] }>();
</script>

<div class="h-full border border-outline bg-surface p-6">
  <h3
    class="mb-6 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
  >
    Revenue Impact (Top Campaigns)
  </h3>
  <div class="space-y-4">
    {#each reports as report}
      <div>
        <div class="mb-1 flex justify-between font-mono text-[10px]">
          <span class="text-brand">{report.code}</span>
          <span class="text-content"
            >Generated: ${report.revenue_generated.toLocaleString()}</span
          >
        </div>
        <div
          class="mb-2 flex justify-between font-mono text-[9px] text-content-muted"
        >
          <span>{report.uses} Orders</span>
          <span>Cost to Business: ${report.discount_cost.toLocaleString()}</span
          >
        </div>
        <div class="flex h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            class="bg-brand"
            style="width: {(report.revenue_generated /
              (report.revenue_generated + report.discount_cost)) *
              100}%"
          ></div>
          <div class="bg-brand-alert" style="flex: 1"></div>
        </div>
      </div>
    {:else}
      <div
        class="text-[10px] font-mono text-content-muted uppercase text-center mt-8"
      >
        No usage data aggregated.
      </div>
    {/each}
  </div>
</div>

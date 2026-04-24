<script lang="ts">
  let { reports = [] } = $props<{ reports: any[] }>();
</script>

<div class="h-full border border-white/10 bg-[#111318] p-6">
  <h3
    class="mb-6 font-mono text-[10px] font-bold tracking-widest text-white/50 uppercase"
  >
    Revenue Impact (Top Campaigns)
  </h3>
  <div class="space-y-4">
    {#each reports as report}
      <div>
        <div class="mb-1 flex justify-between font-mono text-[10px]">
          <span class="text-[#36f4a4]">{report.code}</span>
          <span class="text-white"
            >Generated: ${report.revenue_generated.toLocaleString()}</span
          >
        </div>
        <div
          class="mb-2 flex justify-between font-mono text-[9px] text-white/40"
        >
          <span>{report.uses} Orders</span>
          <span>Cost to Business: ${report.discount_cost.toLocaleString()}</span
          >
        </div>
        <div class="flex h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            class="bg-[#36f4a4]"
            style="width: {(report.revenue_generated /
              (report.revenue_generated + report.discount_cost)) *
              100}%"
          ></div>
          <div class="bg-rose-400" style="flex: 1"></div>
        </div>
      </div>
    {:else}
      <div
        class="text-[10px] font-mono text-white/30 uppercase text-center mt-8"
      >
        No usage data aggregated.
      </div>
    {/each}
  </div>
</div>

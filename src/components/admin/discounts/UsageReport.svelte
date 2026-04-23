<script lang="ts">
  let { reports = [] } = $props<{ reports: any[] }>();
</script>

<div class="bg-[#111318] p-6 border border-white/10 h-full">
  <h3 class="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-6">Revenue Impact (Top Campaigns)</h3>
  <div class="space-y-4">
    {#each reports as report}
      <div>
        <div class="flex justify-between text-[10px] font-mono mb-1">
          <span class="text-[#36f4a4]">{report.code}</span>
          <span class="text-white">Generated: ${report.revenue_generated.toLocaleString()}</span>
        </div>
        <div class="flex justify-between text-[9px] font-mono text-white/40 mb-2">
          <span>{report.uses} Orders</span>
          <span>Cost to Business: ${report.discount_cost.toLocaleString()}</span>
        </div>
        <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden flex">
          <div class="bg-[#36f4a4]" style="width: {(report.revenue_generated / (report.revenue_generated + report.discount_cost)) * 100}%"></div>
          <div class="bg-rose-400" style="flex: 1"></div>
        </div>
      </div>
    {:else}
      <div class="text-[10px] font-mono text-white/30 uppercase text-center mt-8">No usage data aggregated.</div>
    {/each}
  </div>
</div>
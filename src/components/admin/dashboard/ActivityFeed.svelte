<script lang="ts">
  let { activities = [] } = $props<{ activities: { message: string, time: string }[] }>();
</script>

<div class="bg-[#111318] p-6 border border-white/10 h-full">
  <h3 class="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-6">System Feed</h3>
  <div class="space-y-4">
    {#each activities as act}
      <div class="flex gap-3 text-xs font-mono">
        <span class="text-white/30 shrink-0">{act.time}</span>
        <span class="text-white/70">{act.message}</span>
      </div>
    {:else}
      <div class="text-[10px] font-mono text-white/30 uppercase">No recent activity.</div>
    {/each}
  </div>
</div>
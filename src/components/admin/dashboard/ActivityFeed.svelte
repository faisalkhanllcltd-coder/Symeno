<script lang="ts">
  let { activities = [] } = $props<{
    activities: { message: string; time: string }[];
  }>();
</script>

<div class="h-full border border-white/10 bg-[#111318] p-6">
  <h3
    class="mb-6 font-mono text-[10px] font-bold tracking-widest text-white/50 uppercase"
  >
    System Feed
  </h3>
  <div class="space-y-4">
    {#each activities as act}
      <div class="flex gap-3 font-mono text-xs">
        <span class="shrink-0 text-white/30">{act.time}</span>
        <span class="text-white/70">{act.message}</span>
      </div>
    {:else}
      <div class="text-[10px] font-mono text-white/30 uppercase">
        No recent activity.
      </div>
    {/each}
  </div>
</div>

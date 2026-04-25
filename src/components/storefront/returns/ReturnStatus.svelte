<script lang="ts">
  let { status = 'RETURN_REQUESTED' } = $props<{ status: string }>();

  const stages = [
    { id: 'RETURN_REQUESTED', label: 'Requested' },
    { id: 'RETURN_APPROVED', label: 'Approved' },
    { id: 'RETURN_RECEIVED', label: 'Received' },
    { id: 'REFUNDED', label: 'Resolved' },
  ];

  let currentIndex = $derived(stages.findIndex((s) => s.id === status));
</script>

<div class="border border-outline bg-base p-6">
  <h3
    class="mb-6 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
  >
    RMA Progress
  </h3>
  <div class="relative flex items-center justify-between px-4">
    <div
      class="absolute top-1/2 right-4 left-4 z-0 h-0.5 -translate-y-1/2 bg-outline"
    ></div>
    <div
      class="absolute top-1/2 left-4 z-0 h-0.5 -translate-y-1/2 bg-brand transition-all duration-500"
      style="width: {(Math.max(0, currentIndex) / (stages.length - 1)) * 100}%"
    ></div>

    {#each stages as stage, i}
      <div class="relative z-10 flex flex-col items-center gap-2">
        <div
          class="h-4 w-4 rounded-full border-2 {i <= currentIndex
            ? 'border-brand bg-brand'
            : 'border-outline bg-surface'}"
        ></div>
        <span
          class="absolute -bottom-6 w-20 text-center font-mono text-[9px] tracking-widest uppercase {i <=
          currentIndex
            ? 'text-brand'
            : 'text-content-muted'}">{stage.label}</span
        >
      </div>
    {/each}
  </div>
</div>

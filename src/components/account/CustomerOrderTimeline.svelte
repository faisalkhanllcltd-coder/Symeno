<script lang="ts">
  let { status = 'PENDING' } = $props<{ status?: string }>();

  const stages = [
    { id: 'PENDING', label: 'Placed' },
    { id: 'CONFIRMED', label: 'Confirmed' },
    { id: 'SHIPPED', label: 'Shipped' },
    { id: 'DELIVERED', label: 'Delivered' },
  ];

  let currentIndex = $derived(stages.findIndex((s) => s.id === status));
  let isTerminalError = $derived(['CANCELLED', 'RETURNED'].includes(status));
</script>

<div class="overflow-x-auto py-6">
  <div class="relative flex min-w-[400px] items-center justify-between px-8">
    <div
      class="absolute top-1/2 right-8 left-8 z-0 h-0.5 -translate-y-1/2 bg-outline"
    ></div>
    <div
      class="absolute top-1/2 left-8 z-0 h-0.5 -translate-y-1/2 transition-all duration-500 {isTerminalError    
        ? 'bg-brand-alert/50'
        : 'bg-brand'}"
      style="width: {isTerminalError
        ? '100%'
        : `${(Math.max(0, currentIndex) / (stages.length - 1)) * 100}%`}"
    ></div>

    {#each stages as stage, i}
      <div class="relative z-10 flex flex-col items-center gap-2">
        <div
          class="h-4 w-4 rounded-full border-2 transition-colors {isTerminalError
            ? 'border-brand-alert/50 bg-base'
            : i <= currentIndex
              ? 'border-brand bg-brand'
              : 'border-outline bg-base'}"        
        ></div>
        <span
          class="absolute -bottom-6 w-24 text-center font-mono text-[9px] tracking-widest uppercase transition-colors {isTerminalError
            ? 'text-brand-alert'
            : i <= currentIndex
              ? 'text-content'
              : 'text-content-muted'}"
        >
          {stage.label}
        </span>
      </div>
    {/each}
  </div>
</div>

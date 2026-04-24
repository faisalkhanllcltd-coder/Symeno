<script lang="ts">
  let { currentStatus = 'PENDING' } = $props<{ currentStatus?: string }>();

  const stages = [
    { id: 'PENDING', label: 'Order Placed' },
    { id: 'CONFIRMED', label: 'Confirmed' },
    { id: 'PROCESSING', label: 'Processing' },
    { id: 'SHIPPED', label: 'Shipped' },
    { id: 'DELIVERED', label: 'Delivered' },
  ];

  let currentIndex = $derived(stages.findIndex((s) => s.id === currentStatus));
</script>

<div class="border border-outline bg-surface p-6">   
  <h3
    class="mb-6 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
  >
    Fulfillment Timeline
  </h3>
  <div class="relative flex items-center justify-between">
    <div
      class="absolute top-1/2 left-0 z-0 h-0.5 w-full -translate-y-1/2 bg-outline"
    ></div>
    <div
      class="absolute top-1/2 left-0 z-0 h-0.5 -translate-y-1/2 bg-brand transition-all duration-500"       
      style="width: {(Math.max(0, currentIndex) / (stages.length - 1)) * 100}%"
    ></div>

    {#each stages as stage, i}
      <div class="relative z-10 flex flex-col items-center gap-2">
        <div
          class="h-4 w-4 rounded-full border-2 transition-colors duration-500 {i <= currentIndex
            ? 'border-brand bg-brand'
            : 'border-outline bg-base'}"
        ></div>
        <span
          class="font-mono text-[9px] tracking-widest uppercase transition-colors duration-500 {i <=
          currentIndex
            ? 'text-content'
            : 'text-content-muted'}">{stage.label}</span     
        >
      </div>
    {/each}
  </div>
</div>
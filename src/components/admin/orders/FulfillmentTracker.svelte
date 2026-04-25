<script lang="ts">
  let {
    status = 'pending',
    trackingNumber = '',
    carrier = '',
  } = $props<{
    status?: 'pending' | 'processing' | 'shipped' | 'delivered';
    trackingNumber?: string;
    carrier?: string;
  }>();

  const steps = [
    { id: 'pending', label: 'Payment Verified' },
    { id: 'processing', label: 'Hardware Audit' },
    { id: 'shipped', label: 'Dispatched' },
    { id: 'delivered', label: 'Delivered' },
  ];

  let currentIndex = $derived(steps.findIndex((s) => s.id === status));
</script>

<div class="border border-outline bg-surface p-6">
  <h3
    class="mb-6 border-b border-outline pb-3 font-mono text-xs font-bold tracking-widest text-content uppercase"
  >
    Logistics Pipeline
  </h3>

  <div class="relative mb-8 flex items-center justify-between">
    <div
      class="absolute top-1/2 left-0 z-0 h-0.5 w-full -translate-y-1/2 bg-outline"
    ></div>
    <div
      class="absolute top-1/2 left-0 z-0 h-0.5 -translate-y-1/2 bg-brand transition-all duration-500"
      style="width: {(currentIndex / (steps.length - 1)) * 100}%"
    ></div>

    {#each steps as step, i}
      <div class="group relative z-10 flex flex-col items-center gap-2">
        <div
          class="flex h-4 w-4 items-center justify-center border {i <=
          currentIndex
            ? 'border-brand bg-brand'
            : 'border-outline bg-base'} transition-colors duration-300"
        >
          {#if i < currentIndex}
            <svg
              class="h-3 w-3 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="3"
              stroke="currentColor"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              /></svg
            >
          {/if}
        </div>
        <span
          class="absolute -bottom-6 font-mono text-[9px] tracking-widest uppercase {i <=
          currentIndex
            ? 'text-brand'
            : 'text-content-muted'} -ml-10 w-24 text-center"
        >
          {step.label}
        </span>
      </div>
    {/each}
  </div>

  {#if status === 'shipped' || status === 'delivered'}
    <div
      class="mt-12 flex items-center justify-between border-t border-l-2 border-outline border-l-brand bg-base p-4 pt-6"
    >
      <div>
        <p
          class="mb-1 font-mono text-[9px] tracking-widest text-content-muted uppercase"
        >
          Tracking Telemetry ({carrier})
        </p>
        <p class="font-mono text-sm font-bold tracking-wider text-content">
          {trackingNumber}
        </p>
      </div>
      <button
        class="bg-brand px-4 py-2 font-mono text-[10px] tracking-widest text-black uppercase transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      >
        Verify on {carrier}
      </button>
    </div>
  {/if}
</div>

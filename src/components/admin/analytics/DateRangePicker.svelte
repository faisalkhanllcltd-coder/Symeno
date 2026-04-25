<script lang="ts">
  let { selectedRange = $bindable('30d') } = $props<{
    selectedRange?: string;
  }>();

  const ranges = [
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: '90d', label: 'Last 90 Days' },
    { id: 'ytd', label: 'Year to Date' },
  ];
</script>

<div class="flex items-center gap-2 border border-outline bg-surface p-1">
  {#each ranges as range}
    <button
      class="px-4 py-1.5 font-mono text-[10px] tracking-widest uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm {selectedRange ===
      range.id
        ? 'bg-brand font-bold text-black'
        : 'text-content-muted hover:bg-white/5 hover:text-content'}"
      onclick={() => (selectedRange = range.id)}
    >
      {range.label}
    </button>
  {/each}
</div>

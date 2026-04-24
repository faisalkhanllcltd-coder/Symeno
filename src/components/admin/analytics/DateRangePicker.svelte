<script lang="ts">
  let { selectedRange = $bindable('30d') } = $props<{
    selectedRange: string;
  }>();

  const ranges = [
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: '90d', label: 'Last 90 Days' },
    { id: 'ytd', label: 'Year to Date' },
  ];
</script>

<div class="flex items-center gap-2 border border-white/10 bg-[#1A1D23] p-1">
  {#each ranges as range}
    <button
      class="px-4 py-1.5 font-mono text-[10px] tracking-widest uppercase transition-colors {selectedRange ===
      range.id
        ? 'bg-[#36f4a4] font-bold text-black'
        : 'text-white/50 hover:bg-white/5 hover:text-white'}"
      onclick={() => (selectedRange = range.id)}
    >
      {range.label}
    </button>
  {/each}
</div>

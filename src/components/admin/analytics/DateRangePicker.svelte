<script lang="ts">
  let { selectedRange = $bindable('30d') } = $props<{ selectedRange: string }>();
  
  const ranges = [
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: '90d', label: 'Last 90 Days' },
    { id: 'ytd', label: 'Year to Date' }
  ];
</script>

<div class="flex items-center gap-2 bg-[#1A1D23] border border-white/10 p-1">
  {#each ranges as range}
    <button 
      class="px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest transition-colors {selectedRange === range.id ? 'bg-[#36f4a4] text-black font-bold' : 'text-white/50 hover:text-white hover:bg-white/5'}"
      onclick={() => selectedRange = range.id}
    >
      {range.label}
    </button>
  {/each}
</div>
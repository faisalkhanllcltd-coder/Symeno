<script lang="ts">
  let { status = 'PENDING' } = $props<{ status: string }>();
  
  const stages = [
    { id: 'PENDING', label: 'Placed' },
    { id: 'CONFIRMED', label: 'Confirmed' },
    { id: 'SHIPPED', label: 'Shipped' },
    { id: 'DELIVERED', label: 'Delivered' }
  ];

  let currentIndex = $derived(stages.findIndex(s => s.id === status));
  let isTerminalError = $derived(['CANCELLED', 'RETURNED'].includes(status));
</script>

<div class="py-6 overflow-x-auto">
  <div class="min-w-[400px] flex items-center justify-between relative px-8">
    <div class="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-white/10 z-0"></div>
    <div class="absolute left-8 top-1/2 -translate-y-1/2 h-0.5 z-0 transition-all duration-500 {isTerminalError ? 'bg-rose-500/50' : 'bg-[#36f4a4]'}" style="width: {isTerminalError ? '100%' : `${(Math.max(0, currentIndex) / (stages.length - 1)) * 100}%`}"></div>
    
    {#each stages as stage, i}
      <div class="relative z-10 flex flex-col items-center gap-2">
        <div class="w-4 h-4 rounded-full border-2 transition-colors {isTerminalError ? 'bg-[#1A1D23] border-rose-500/50' : (i <= currentIndex ? 'bg-[#36f4a4] border-[#36f4a4]' : 'bg-[#1A1D23] border-white/20')}"></div>
        <span class="text-[9px] font-mono uppercase tracking-widest absolute -bottom-6 w-24 text-center {isTerminalError ? 'text-rose-400' : (i <= currentIndex ? 'text-white' : 'text-white/30')}">
          {stage.label}
        </span>
      </div>
    {/each}
  </div>
</div>
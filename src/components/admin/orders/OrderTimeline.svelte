<script lang="ts">
  let { currentStatus = 'PENDING' } = $props<{ currentStatus: string }>();
  
  const stages = [
    { id: 'PENDING', label: 'Order Placed' },
    { id: 'CONFIRMED', label: 'Confirmed' },
    { id: 'PROCESSING', label: 'Processing' },
    { id: 'SHIPPED', label: 'Shipped' },
    { id: 'DELIVERED', label: 'Delivered' }
  ];

  let currentIndex = $derived(stages.findIndex(s => s.id === currentStatus));
</script>

<div class="bg-[#111318] p-6 border border-white/10">
  <h3 class="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-6">Fulfillment Timeline</h3>
  <div class="flex items-center justify-between relative">
    <div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/5 z-0"></div>
    <div class="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#36f4a4] z-0 transition-all duration-500" style="width: {(Math.max(0, currentIndex) / (stages.length - 1)) * 100}%"></div>
    
    {#each stages as stage, i}
      <div class="relative z-10 flex flex-col items-center gap-2">
        <div class="w-4 h-4 rounded-full border-2 {i <= currentIndex ? 'bg-[#36f4a4] border-[#36f4a4]' : 'bg-[#1A1D23] border-white/20'}"></div>
        <span class="text-[9px] font-mono uppercase tracking-widest {i <= currentIndex ? 'text-white' : 'text-white/30'}">{stage.label}</span>
      </div>
    {/each}
  </div>
</div>
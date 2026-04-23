<script lang="ts">
  let { status = 'RETURN_REQUESTED' } = $props<{ status: string }>();
  
  const stages = [
    { id: 'RETURN_REQUESTED', label: 'Requested' },
    { id: 'RETURN_APPROVED', label: 'Approved' },
    { id: 'RETURN_RECEIVED', label: 'Received' },
    { id: 'REFUNDED', label: 'Resolved' }
  ];

  let currentIndex = $derived(stages.findIndex(s => s.id === status));
</script>

<div class="bg-[#111318] p-6 border border-white/10">
  <h3 class="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-6">RMA Progress</h3>
  <div class="flex items-center justify-between relative px-4">
    <div class="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-white/10 z-0"></div>
    <div class="absolute left-4 top-1/2 -translate-y-1/2 h-0.5 bg-[#36f4a4] z-0 transition-all duration-500" style="width: {(Math.max(0, currentIndex) / (stages.length - 1)) * 100}%"></div>
    
    {#each stages as stage, i}
      <div class="relative z-10 flex flex-col items-center gap-2">
        <div class="w-4 h-4 rounded-full border-2 {i <= currentIndex ? 'bg-[#36f4a4] border-[#36f4a4]' : 'bg-[#1A1D23] border-white/20'}"></div>
        <span class="text-[9px] font-mono uppercase tracking-widest absolute -bottom-6 w-20 text-center {i <= currentIndex ? 'text-[#36f4a4]' : 'text-white/30'}">{stage.label}</span>
      </div>
    {/each}
  </div>
</div>
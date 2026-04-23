<script lang="ts">
  export let status: 'pending' | 'processing' | 'shipped' | 'delivered' = 'pending';
  export let trackingNumber: string = '';
  export let carrier: string = '';

  const steps = [
    { id: 'pending', label: 'Payment Verified' },
    { id: 'processing', label: 'Hardware Audit' },
    { id: 'shipped', label: 'Dispatched' },
    { id: 'delivered', label: 'Delivered' }
  ];

  $: currentIndex = steps.findIndex(s => s.id === status);
</script>

<div class="bg-[#111318] border border-white/10 p-6">
  <h3 class="text-xs font-bold text-white uppercase tracking-widest font-mono border-b border-white/10 pb-3 mb-6">Logistics Pipeline</h3>
  
  <div class="relative flex justify-between items-center mb-8">
    <div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/10 z-0"></div>
    <div class="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#36f4a4] z-0 transition-all duration-500" style="width: {(currentIndex / (steps.length - 1)) * 100}%"></div>
    
    {#each steps as step, i}
      <div class="relative z-10 flex flex-col items-center gap-2 group">
        <div class="w-4 h-4 flex items-center justify-center border {i <= currentIndex ? 'bg-[#36f4a4] border-[#36f4a4]' : 'bg-[#1A1D23] border-white/20'} transition-colors duration-300">
          {#if i < currentIndex}
            <svg class="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
          {/if}
        </div>
        <span class="absolute -bottom-6 text-[9px] font-mono uppercase tracking-widest {i <= currentIndex ? 'text-[#36f4a4]' : 'text-white/40'} text-center w-24 -ml-10">
          {step.label}
        </span>
      </div>
    {/each}
  </div>

  {#if status === 'shipped' || status === 'delivered'}
    <div class="mt-12 pt-6 border-t border-white/10 flex justify-between items-center bg-[#1A1D23] p-4 border-l-2 border-l-[#36f4a4]">
      <div>
        <p class="text-[9px] font-mono text-white/50 uppercase tracking-widest mb-1">Tracking Telemetry ({carrier})</p>
        <p class="text-sm font-bold text-white font-mono tracking-wider">{trackingNumber}</p>
      </div>
      <button class="text-[10px] font-mono text-black bg-[#36f4a4] px-4 py-2 uppercase tracking-widest hover:bg-white transition-colors focus:outline-none">
        Verify on {carrier}
      </button>
    </div>
  {/if}
</div>

<script lang="ts">
  let emailBcc = $state(true);
  let triggers = $state([
    { id: 'order_conf', label: 'Order Confirmation', active: true },
    { id: 'ship_conf', label: 'Shipping Dispatch', active: true },
    { id: 'delivery', label: 'Delivery Complete', active: false },
    { id: 'return', label: 'Return Approved', active: true }
  ]);
</script>

<div class="bg-[#111318] p-6 border border-white/10 space-y-6">
  <h2 class="text-xs font-bold text-white font-mono uppercase tracking-widest border-b border-white/10 pb-2">Email Triggers (Resend)</h2>
  
  <div class="space-y-3">
    {#each triggers as t}
      <label class="flex items-center gap-3 cursor-pointer p-2 hover:bg-white/5 transition-colors">
        <input type="checkbox" bind:checked={t.active} class="w-4 h-4 accent-[#36f4a4] bg-[#1A1D23] border-white/10" />
        <span class="text-[10px] font-mono text-white/80 uppercase">{t.label}</span>
      </label>
    {/each}
  </div>

  <div class="border-t border-white/10 pt-4 mt-4">
    <label class="flex items-center gap-3 cursor-pointer p-2">
      <input type="checkbox" bind:checked={emailBcc} class="w-4 h-4 accent-amber-500 bg-[#1A1D23] border-white/10" />
      <span class="text-[10px] font-mono text-amber-400 uppercase tracking-widest">BCC Admin on all outbound comms</span>
    </label>
  </div>
</div>
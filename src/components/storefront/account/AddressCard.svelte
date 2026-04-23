<script lang="ts">
  let { address, onEdit, onDelete, onMakeDefault } = $props<{ address: any, onEdit: () => void, onDelete: () => void, onMakeDefault: () => void }>();
  let isUAE = $derived(address.country === 'United Arab Emirates');
</script>

<div class="bg-[#111318] border border-white/10 flex flex-col h-full {address.is_default ? 'border-[#36f4a4]/30 bg-[#36f4a4]/5' : 'hover:border-white/30 transition-colors'}">
  <div class="p-4 border-b border-white/10 flex justify-between items-center">
    <div class="flex items-center gap-2">
      <h4 class="text-xs font-bold text-white uppercase tracking-widest font-mono">{address.label}</h4>
      {#if address.is_default}
        <span class="text-[9px] px-2 py-0.5 bg-[#36f4a4]/20 text-[#36f4a4] border border-[#36f4a4]/30 uppercase tracking-widest font-mono">Default</span>
      {/if}
    </div>
    <div class="flex gap-2">
      <button onclick={onEdit} class="text-[10px] text-white/50 hover:text-[#36f4a4] font-mono uppercase transition-colors focus:outline-none">Edit</button>
      {#if !address.is_default}
        <button onclick={onDelete} class="text-[10px] text-white/50 hover:text-rose-400 font-mono uppercase transition-colors focus:outline-none">Delete</button>
      {/if}
    </div>
  </div>
  
  <div class="p-4 flex-1 space-y-1 text-xs font-mono text-white/70">
    <p class="font-bold text-white mb-2">{address.full_name}</p>
    {#if address.line2}<p>{address.line2}</p>{/if}
    <p>{address.line1}</p>
    <p>{address.city}, {address.state} {!isUAE && address.landmark ? address.landmark : ''}</p>
    <p>{address.country}</p>
    {#if isUAE && address.landmark}
      <p class="text-amber-400/80 mt-2 text-[10px]">Landmark: {address.landmark}</p>
    {/if}
    <p class="pt-2 text-[10px] text-white/40">{address.phone}</p>
  </div>
  
  {#if !address.is_default}
    <div class="p-4 border-t border-white/10 mt-auto">
      <button onclick={onMakeDefault} class="w-full border border-white/10 text-white/70 px-4 py-2 text-[10px] font-mono uppercase tracking-widest hover:border-[#36f4a4]/50 hover:text-[#36f4a4] transition-colors focus:outline-none">
        Set as Default
      </button>
    </div>
  {/if}
</div>
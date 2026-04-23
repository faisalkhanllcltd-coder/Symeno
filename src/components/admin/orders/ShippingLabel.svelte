<script lang="ts">
  let { orderId, address } = $props<{ orderId: string, address: string }>();
  let carrier = $state('aramex');
  let trackingNum = $state('');
  let isSaving = $state(false);

  // Mock save function
  const saveTracking = () => { isSaving = true; setTimeout(() => isSaving = false, 800); };
</script>

<div class="bg-[#111318] p-6 border border-white/10">
  <h3 class="text-[10px] font-bold uppercase tracking-widest text-[#36f4a4] font-mono mb-4">Logistics & Dispatch</h3>
  
  <div class="text-xs font-mono text-white/70 mb-4 p-3 bg-white/5 border border-white/5 whitespace-pre-wrap">
    {address || 'No shipping address provided.'}
  </div>

  <div class="space-y-4">
    <div>
      <label class="block text-[10px] text-white/50 font-mono mb-2">Carrier</label>
      <select bind:value={carrier} class="w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono cursor-pointer">
        <option value="aramex">Aramex (MENA Standard)</option>
        <option value="dhl">DHL Express (Global)</option>
        <option value="saudi_post">Saudi Post (SPL)</option>
      </select>
    </div>
    <div>
      <label class="block text-[10px] text-white/50 font-mono mb-2">Tracking Number</label>
      <input type="text" bind:value={trackingNum} placeholder="e.g. 3948293001" class="w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
    </div>
    <div class="flex gap-2">
      <button class="flex-1 border border-[#36f4a4]/30 text-[#36f4a4] px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-[#36f4a4]/10 transition-colors">Generate Label PDF</button>
      <button onclick={saveTracking} disabled={isSaving} class="flex-1 bg-[#36f4a4] text-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50">Save Tracking</button>
    </div>
  </div>
</div>
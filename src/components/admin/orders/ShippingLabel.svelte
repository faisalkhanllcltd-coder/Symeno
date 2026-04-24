<script lang="ts">
  let { orderId, address } = $props<{ orderId: string; address: string }>();
  let carrier = $state('aramex');
  let trackingNum = $state('');
  let isSaving = $state(false);

  // Mock save function
  const saveTracking = () => {
    isSaving = true;
    setTimeout(() => (isSaving = false), 800);
  };
</script>

<div class="border border-white/10 bg-[#111318] p-6">
  <h3
    class="mb-4 font-mono text-[10px] font-bold tracking-widest text-[#36f4a4] uppercase"
  >
    Logistics & Dispatch
  </h3>

  <div
    class="mb-4 border border-white/5 bg-white/5 p-3 font-mono text-xs whitespace-pre-wrap text-white/70"
  >
    {address || 'No shipping address provided.'}
  </div>

  <div class="space-y-4">
    <div>
      <label class="mb-2 block font-mono text-[10px] text-white/50"
        >Carrier</label
      >
      <select
        bind:value={carrier}
        class="w-full cursor-pointer border border-white/10 bg-[#1A1D23] px-3 py-2 font-mono text-sm text-white focus:border-[#36f4a4]/50 focus:outline-none"
      >
        <option value="aramex">Aramex (MENA Standard)</option>
        <option value="dhl">DHL Express (Global)</option>
        <option value="saudi_post">Saudi Post (SPL)</option>
      </select>
    </div>
    <div>
      <label class="mb-2 block font-mono text-[10px] text-white/50"
        >Tracking Number</label
      >
      <input
        type="text"
        bind:value={trackingNum}
        placeholder="e.g. 3948293001"
        class="w-full border border-white/10 bg-[#1A1D23] px-3 py-2 font-mono text-sm text-white focus:border-[#36f4a4]/50 focus:outline-none"
      />
    </div>
    <div class="flex gap-2">
      <button
        class="flex-1 border border-[#36f4a4]/30 px-4 py-2 text-[10px] font-bold tracking-widest text-[#36f4a4] uppercase transition-colors hover:bg-[#36f4a4]/10"
        >Generate Label PDF</button
      >
      <button
        onclick={saveTracking}
        disabled={isSaving}
        class="flex-1 bg-[#36f4a4] px-4 py-2 text-[10px] font-bold tracking-widest text-black uppercase transition-colors hover:bg-white disabled:opacity-50"
        >Save Tracking</button
      >
    </div>
  </div>
</div>

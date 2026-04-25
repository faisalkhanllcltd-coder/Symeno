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

<div class="border border-outline bg-surface p-6">
  <h3
    class="mb-4 font-mono text-[10px] font-bold tracking-widest text-brand uppercase"
  >
    Logistics & Dispatch
  </h3>

  <div
    class="mb-4 border border-outline bg-base p-3 font-mono text-xs whitespace-pre-wrap text-content-muted"
  >
    {address || 'No shipping address provided.'}
  </div>

  <div class="space-y-4">
    <div>
      <label class="mb-2 block font-mono text-[10px] text-content-muted"
        >Carrier</label
      >
      <select
        bind:value={carrier}
        class="w-full cursor-pointer border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      >
        <option value="aramex">Aramex (MENA Standard)</option>
        <option value="dhl">DHL Express (Global)</option>
        <option value="saudi_post">Saudi Post (SPL)</option>
      </select>
    </div>
    <div>
      <label class="mb-2 block font-mono text-[10px] text-content-muted"
        >Tracking Number</label
      >
      <input
        type="text"
        bind:value={trackingNum}
        placeholder="e.g. 3948293001"
        class="w-full border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      />
    </div>
    <div class="flex gap-2">
      <button
        class="flex-1 border border-brand/30 px-4 py-2 text-[10px] font-bold tracking-widest text-brand uppercase transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        >Generate Label PDF</button
      >
      <button
        onclick={saveTracking}
        disabled={isSaving}
        class="flex-1 bg-brand px-4 py-2 text-[10px] font-bold tracking-widest text-black uppercase transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm disabled:opacity-50"
        >Save Tracking</button
      >
    </div>
  </div>
</div>

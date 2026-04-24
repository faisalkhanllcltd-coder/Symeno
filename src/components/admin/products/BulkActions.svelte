<script lang="ts">
  let { selectedIds = [], onComplete } = $props<{
    selectedIds: string[];
    onComplete: () => void;
  }>();
  let isProcessing = $state(false);
  let showPriceModal = $state(false);
  let priceAdjustment = $state(0);

  async function executeBulk(action: string, payload?: any) {
    if (selectedIds.length === 0) return;
    if (
      action === 'DELETE' &&
      !confirm(`Delete ${selectedIds.length} products permanently?`)
    )
      return;

    isProcessing = true;
    try {
      const res = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, action, payload }),
      });
      if (res.ok) {
        showPriceModal = false;
        onComplete();
      }
    } finally {
      isProcessing = false;
    }
  }
</script>

{#if selectedIds.length > 0}
  <div
    class="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-6 border border-[#36f4a4]/30 bg-[#0a0b0e] px-6 py-4 shadow-[0_10px_40px_rgba(54,244,164,0.1)]"
  >
    <div
      class="flex items-center gap-2 font-mono text-sm font-bold text-[#36f4a4]"
    >
      <span class="h-2 w-2 animate-pulse rounded-full bg-[#36f4a4]"></span>
      {selectedIds.length} Selected
    </div>
    <div class="h-6 w-px bg-white/10"></div>
    <div class="flex gap-2">
      <button
        onclick={() => executeBulk('ACTIVATE')}
        disabled={isProcessing}
        class="border border-white/10 px-3 py-1.5 font-mono text-[10px] tracking-widest text-white/70 uppercase transition-colors hover:border-white/30 hover:text-white"
        >Activate</button
      >
      <button
        onclick={() => executeBulk('DEACTIVATE')}
        disabled={isProcessing}
        class="border border-white/10 px-3 py-1.5 font-mono text-[10px] tracking-widest text-white/70 uppercase transition-colors hover:border-white/30 hover:text-white"
        >Draft</button
      >
      <button
        onclick={() => (showPriceModal = true)}
        disabled={isProcessing}
        class="border border-white/10 px-3 py-1.5 font-mono text-[10px] tracking-widest text-white/70 uppercase transition-colors hover:border-white/30 hover:text-white"
        >Adjust Price</button
      >
      <button
        onclick={() => executeBulk('DELETE')}
        disabled={isProcessing}
        class="border border-transparent px-3 py-1.5 font-mono text-[10px] tracking-widest text-rose-400 uppercase transition-colors hover:bg-rose-500/10"
        >Delete</button
      >
    </div>
  </div>

  {#if showPriceModal}
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
    >
      <div class="w-96 border border-white/10 bg-[#111318] p-6">
        <h3 class="mb-4 font-mono text-sm text-white">Adjust Prices (Bulk)</h3>
        <label class="mb-2 block text-[10px] text-white/50"
          >Percentage Change (+ or -)</label
        >
        <input
          type="number"
          bind:value={priceAdjustment}
          class="mb-4 w-full border border-white/10 bg-[#1a1d23] p-2 font-mono text-sm text-white focus:border-[#36f4a4]/50 focus:outline-none"
        />
        <div class="flex justify-end gap-2">
          <button
            onclick={() => (showPriceModal = false)}
            class="px-4 py-2 font-mono text-xs text-white/50 hover:text-white"
            >Cancel</button
          >
          <button
            onclick={() =>
              executeBulk('ADJUST_PRICE', { percentage: priceAdjustment })}
            class="bg-[#36f4a4] px-4 py-2 font-mono text-xs font-bold text-black"
            >Apply</button
          >
        </div>
      </div>
    </div>
  {/if}
{/if}

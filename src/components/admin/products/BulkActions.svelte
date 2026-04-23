<script lang="ts">
  let { selectedIds = [], onComplete } = $props<{ selectedIds: string[], onComplete: () => void }>();
  let isProcessing = $state(false);
  let showPriceModal = $state(false);
  let priceAdjustment = $state(0);

  async function executeBulk(action: string, payload?: any) {
    if (selectedIds.length === 0) return;
    if (action === 'DELETE' && !confirm(`Delete ${selectedIds.length} products permanently?`)) return;

    isProcessing = true;
    try {
      const res = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, action, payload })
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
  <div class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0a0b0e] border border-[#36f4a4]/30 px-6 py-4 flex items-center gap-6 shadow-[0_10px_40px_rgba(54,244,164,0.1)] z-50">
    <div class="text-[#36f4a4] font-mono text-sm font-bold flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-[#36f4a4] animate-pulse"></span>
      {selectedIds.length} Selected
    </div>
    <div class="h-6 w-px bg-white/10"></div>
    <div class="flex gap-2">
      <button onclick={() => executeBulk('ACTIVATE')} disabled={isProcessing} class="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-white/70 hover:text-white border border-white/10 hover:border-white/30 transition-colors">Activate</button>
      <button onclick={() => executeBulk('DEACTIVATE')} disabled={isProcessing} class="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-white/70 hover:text-white border border-white/10 hover:border-white/30 transition-colors">Draft</button>
      <button onclick={() => showPriceModal = true} disabled={isProcessing} class="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-white/70 hover:text-white border border-white/10 hover:border-white/30 transition-colors">Adjust Price</button>
      <button onclick={() => executeBulk('DELETE')} disabled={isProcessing} class="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-rose-400 hover:bg-rose-500/10 border border-transparent transition-colors">Delete</button>
    </div>
  </div>

  {#if showPriceModal}
    <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div class="bg-[#111318] p-6 border border-white/10 w-96">
        <h3 class="text-white font-mono text-sm mb-4">Adjust Prices (Bulk)</h3>
        <label class="block text-[10px] text-white/50 mb-2">Percentage Change (+ or -)</label>
        <input type="number" bind:value={priceAdjustment} class="w-full bg-[#1a1d23] border border-white/10 text-white p-2 text-sm font-mono focus:outline-none focus:border-[#36f4a4]/50 mb-4" />
        <div class="flex justify-end gap-2">
          <button onclick={() => showPriceModal = false} class="px-4 py-2 text-xs font-mono text-white/50 hover:text-white">Cancel</button>
          <button onclick={() => executeBulk('ADJUST_PRICE', { percentage: priceAdjustment })} class="px-4 py-2 bg-[#36f4a4] text-black text-xs font-bold font-mono">Apply</button>
        </div>
      </div>
    </div>
  {/if}
{/if}
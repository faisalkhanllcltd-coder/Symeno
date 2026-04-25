<script lang="ts">
  let { selectedIds = [], onComplete } = $props<{
    selectedIds?: string[];
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
    class="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-6 border border-brand/30 bg-surface px-6 py-4 shadow-[0_10px_40px_rgba(54,244,164,0.1)]"
  >
    <div
      class="flex items-center gap-2 font-mono text-sm font-bold text-brand"
    >
      <span class="h-2 w-2 animate-pulse rounded-full bg-brand"></span>
      {selectedIds.length} Selected
    </div>
    <div class="h-6 w-px bg-outline"></div>
    <div class="flex gap-2">
      <button
        onclick={() => executeBulk('ACTIVATE')}
        disabled={isProcessing}
        class="border border-outline px-3 py-1.5 font-mono text-[10px] tracking-widest text-content-muted uppercase transition-colors hover:border-outline hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        >Activate</button
      >
      <button
        onclick={() => executeBulk('DEACTIVATE')}
        disabled={isProcessing}
        class="border border-outline px-3 py-1.5 font-mono text-[10px] tracking-widest text-content-muted uppercase transition-colors hover:border-outline hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        >Draft</button
      >
      <button
        onclick={() => (showPriceModal = true)}
        disabled={isProcessing}
        class="border border-outline px-3 py-1.5 font-mono text-[10px] tracking-widest text-content-muted uppercase transition-colors hover:border-outline hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        >Adjust Price</button
      >
      <button
        onclick={() => executeBulk('DELETE')}
        disabled={isProcessing}
        class="border border-transparent px-3 py-1.5 font-mono text-[10px] tracking-widest text-brand-alert uppercase transition-colors hover:bg-brand-alert/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        >Delete</button
      >
    </div>
  </div>

  {#if showPriceModal}
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-base/80"
    >
      <div class="w-96 border border-outline bg-surface p-6">
        <h3 class="mb-4 font-mono text-sm text-content">Adjust Prices (Bulk)</h3>
        <label class="mb-2 block text-[10px] text-content-muted"
          >Percentage Change (+ or -)</label
        >
        <input
          type="number"
          bind:value={priceAdjustment}
          class="mb-4 w-full border border-outline bg-base p-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        />
        <div class="flex justify-end gap-2">
          <button
            onclick={() => (showPriceModal = false)}
            class="px-4 py-2 font-mono text-xs text-content-muted hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
            >Cancel</button
          >
          <button
            onclick={() =>
              executeBulk('ADJUST_PRICE', { percentage: priceAdjustment })}
            class="bg-brand px-4 py-2 font-mono text-xs font-bold text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
            >Apply</button
          >
        </div>
      </div>
    </div>
  {/if}
{/if}

<script lang="ts">
  let { inventory = [], onSuccess } = $props<{
    inventory?: any[];
    onSuccess: () => void;
  }>();

  let selectedVariant = $state('');
  let adjustment = $state(0);
  let reason = $state('RESTOCK');
  let notes = $state('');
  let isSubmitting = $state(false);

  async function submitAdjustment(e: Event) {
    e.preventDefault();
    if (!selectedVariant || adjustment === 0) return;

    isSubmitting = true;
    try {
      const res = await fetch('/api/admin/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variant_id: selectedVariant,
          adjustment,
          reason,
          notes,
        }),
      });
      if (res.ok) {
        adjustment = 0;
        notes = '';
        onSuccess(); // Triggers a reload of the parent data
      } else {
        alert("Adjustment failed. Ensure stock doesn't drop below zero.");
      }
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div
  class="relative overflow-hidden border border-brand/30 bg-surface p-6"
>
  <div
    class="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-brand/50 to-transparent"
  ></div>
  <h3
    class="mb-4 font-mono text-[10px] font-bold tracking-widest text-brand uppercase"
  >
    Atomic Stock Adjustment
  </h3>

  <form onsubmit={submitAdjustment} class="space-y-4">
    <div>
      <label class="mb-2 block font-mono text-[10px] text-content-muted"
        >Target Slug</label
      >
      <select
        bind:value={selectedVariant}
        required
        class="w-full border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      >
        <option value="" disabled selected>Select Slug to adjust...</option>
        {#each inventory as item}
          <option value={item.variant_id}
            >{item.slug} - {item.product_title} ({item.stock} in stock)</option
          >
        {/each}
      </select>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="mb-2 block font-mono text-[10px] text-content-muted"
          >Change (Use - for reduction)</label
        >
        <input
          type="number"
          bind:value={adjustment}
          required
          placeholder="+10 or -5"
          class="w-full border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        />
      </div>
      <div>
        <label class="mb-2 block font-mono text-[10px] text-content-muted"
          >Reason Code</label
        >
        <select
          bind:value={reason}
          class="w-full border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        >
          <option value="RESTOCK">Received Shipment</option>
          <option value="DAMAGED">Damaged / Destroyed</option>
          <option value="CORRECTION">Count Correction</option>
          <option value="RETURNED">Customer Return</option>
        </select>
      </div>
    </div>

    <div>
      <label class="mb-2 block font-mono text-[10px] text-content-muted"
        >Audit Notes (Optional)</label
      >
      <input
        type="text"
        bind:value={notes}
        placeholder="e.g. PO# 10442"
        class="w-full border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      />
    </div>

    <button
      type="submit"
      disabled={isSubmitting || adjustment === 0 || !selectedVariant}
      class="w-full bg-brand px-4 py-2 text-[10px] font-bold tracking-widest text-black uppercase transition-colors hover:bg-white disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
    >
      {isSubmitting ? 'Processing...' : 'Execute Adjustment'}
    </button>
  </form>
</div>

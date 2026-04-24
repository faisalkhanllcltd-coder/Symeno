<script lang="ts">
  let { inventory = [], onSuccess } = $props<{
    inventory: any[];
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
  class="relative overflow-hidden border border-[#36f4a4]/30 bg-[#111318] p-6"
>
  <div
    class="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-[#36f4a4]/50 to-transparent"
  ></div>
  <h3
    class="mb-4 font-mono text-[10px] font-bold tracking-widest text-[#36f4a4] uppercase"
  >
    Atomic Stock Adjustment
  </h3>

  <form onsubmit={submitAdjustment} class="space-y-4">
    <div>
      <label class="mb-2 block font-mono text-[10px] text-white/50"
        >Target SKU</label
      >
      <select
        bind:value={selectedVariant}
        required
        class="w-full border border-white/10 bg-[#1A1D23] px-3 py-2 font-mono text-sm text-white focus:border-[#36f4a4]/50 focus:outline-none"
      >
        <option value="" disabled selected>Select SKU to adjust...</option>
        {#each inventory as item}
          <option value={item.variant_id}
            >{item.sku} - {item.product_title} ({item.stock} in stock)</option
          >
        {/each}
      </select>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="mb-2 block font-mono text-[10px] text-white/50"
          >Change (Use - for reduction)</label
        >
        <input
          type="number"
          bind:value={adjustment}
          required
          placeholder="+10 or -5"
          class="w-full border border-white/10 bg-[#1A1D23] px-3 py-2 font-mono text-sm text-white focus:border-[#36f4a4]/50 focus:outline-none"
        />
      </div>
      <div>
        <label class="mb-2 block font-mono text-[10px] text-white/50"
          >Reason Code</label
        >
        <select
          bind:value={reason}
          class="w-full border border-white/10 bg-[#1A1D23] px-3 py-2 font-mono text-sm text-white focus:border-[#36f4a4]/50 focus:outline-none"
        >
          <option value="RESTOCK">Received Shipment</option>
          <option value="DAMAGED">Damaged / Destroyed</option>
          <option value="CORRECTION">Count Correction</option>
          <option value="RETURNED">Customer Return</option>
        </select>
      </div>
    </div>

    <div>
      <label class="mb-2 block font-mono text-[10px] text-white/50"
        >Audit Notes (Optional)</label
      >
      <input
        type="text"
        bind:value={notes}
        placeholder="e.g. PO# 10442"
        class="w-full border border-white/10 bg-[#1A1D23] px-3 py-2 font-mono text-sm text-white focus:border-[#36f4a4]/50 focus:outline-none"
      />
    </div>

    <button
      type="submit"
      disabled={isSubmitting || adjustment === 0 || !selectedVariant}
      class="w-full bg-[#36f4a4] px-4 py-2 text-[10px] font-bold tracking-widest text-black uppercase transition-colors hover:bg-white disabled:opacity-50"
    >
      {isSubmitting ? 'Processing...' : 'Execute Adjustment'}
    </button>
  </form>
</div>

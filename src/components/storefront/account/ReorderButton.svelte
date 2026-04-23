<script lang="ts">
  let { orderId } = $props<{ orderId: string }>();
  let isProcessing = $state(false);

  async function handleReorder() {
    isProcessing = true;
    try {
      const res = await fetch(`/api/account/orders/${orderId}/reorder`, { method: 'POST' });
      if (res.ok) {
        const { items } = await res.json();
        // In a real app, you would import the Cart store here and add the items
        alert("Items added to your active matrix (cart).");
        window.location.href = '/cart';
      }
    } finally {
      isProcessing = false;
    }
  }
</script>

<button onclick={handleReorder} disabled={isProcessing} class="w-full bg-[#1A1D23] border border-[#36f4a4]/30 text-[#36f4a4] hover:bg-[#36f4a4]/10 px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50">
  {isProcessing ? 'Hydrating Cart...' : 'Buy Again'}
</button>
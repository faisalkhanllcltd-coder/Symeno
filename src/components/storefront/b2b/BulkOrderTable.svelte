<script lang="ts">
  let { products = [] } = $props<{ products?: any[] }>();

  // Matrix to store quantities keyed by product ID
  let quantities = $state<Record<string, number>>({});
  let isProcessing = $state(false);

  let totalItems = $derived(
    Object.values(quantities).reduce((a, b) => a + (b || 0), 0)
  );

  async function injectBulkToCart() {
    if (totalItems === 0) return;
    isProcessing = true;

    try {
      const { cart } = await import('../../../stores/cart.svelte');

      // Inject all non-zero quantities into the cart matrix
      Object.entries(quantities).forEach(([id, qty]) => {
        if (qty > 0) {
          const product = products.find((p) => p.id === id);
          if (product) {
            cart.addItem({
              productId: product.id,
              title: product.title,
              price: product.base_price * 1.05, // Assumed Tier 1 preview
              quantity: qty,
              sku: product.id.substring(0, 8),
            });
          }
        }
      });

      quantities = {}; // Reset matrix
      alert(`Bulk injection successful. ${totalItems} units added to queue.`);
    } finally {
      isProcessing = false;
    }
  }
</script>

<div class="overflow-hidden border border-outline bg-base">
  <div
    class="sticky top-0 z-10 flex items-center justify-between border-b border-outline bg-surface p-4"
  >
    <h3
      class="font-mono text-xs font-bold tracking-widest text-content uppercase"
    >
      High-Volume Order Matrix
    </h3>
    <button
      onclick={injectBulkToCart}
      disabled={totalItems === 0 || isProcessing}
      class="bg-brand px-4 py-2 text-[10px] font-bold tracking-widest text-brand-dark uppercase transition-colors hover:opacity-80 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark rounded-sm"
    >
      {isProcessing ? 'Injecting...' : `Add ${totalItems} Units to Cart`}
    </button>
  </div>

  <div class="max-h-[60vh] overflow-x-auto overflow-y-auto">
    <table class="w-full border-collapse text-left">
      <thead
        class="sticky top-0 z-0 border-b border-outline bg-base shadow-sm"
      >
        <tr>
          <th
            class="p-4 text-[10px] font-bold tracking-widest text-content-muted uppercase"
            >SKU</th
          >
          <th
            class="p-4 text-[10px] font-bold tracking-widest text-content-muted uppercase"
            >Product Intel</th
          >
          <th
            class="p-4 text-[10px] font-bold tracking-widest text-content-muted uppercase"
            >Tier 1 Unit Cost</th
          >
          <th
            class="p-4 text-right text-[10px] font-bold tracking-widest text-content-muted uppercase"
            >Qty</th
          >
        </tr>
      </thead>
      <tbody class="divide-y divide-outline/50">
        {#each products as product}
          <tr class="transition-colors hover:bg-surface/50">
            <td class="p-4 font-mono text-xs text-content-muted"
              >{product.id.substring(0, 8).toUpperCase()}</td
            >
            <td class="p-4 text-xs font-bold text-content">{product.title}</td>
            <td class="p-4 font-mono text-xs text-brand"
              >${(product.base_price * 1.05).toFixed(2)}</td
            >
            <td class="p-4 text-right">
              <input
                type="number"
                min="0"
                placeholder="0"
                bind:value={quantities[product.id]}
                class="w-20 border border-outline bg-surface px-2 py-1 text-center font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
              />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

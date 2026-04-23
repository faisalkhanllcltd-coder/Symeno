<script lang="ts">
  let { products = [] } = $props<{ products: any[] }>();
  
  // Matrix to store quantities keyed by product ID
  let quantities = $state<Record<string, number>>({});
  let isProcessing = $state(false);

  let totalItems = $derived(Object.values(quantities).reduce((a, b) => a + (b || 0), 0));

  async function injectBulkToCart() {
    if (totalItems === 0) return;
    isProcessing = true;
    
    try {
      const { cart } = await import('../../../stores/cart.svelte');
      
      // Inject all non-zero quantities into the cart matrix
      Object.entries(quantities).forEach(([id, qty]) => {
        if (qty > 0) {
          const product = products.find(p => p.id === id);
          if (product) {
            cart.addItem({
              productId: product.id,
              title: product.title,
              price: product.base_price * 1.05, // Assumed Tier 1 preview
              quantity: qty,
              sku: product.id.substring(0,8)
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

<div class="bg-[#111318] border border-white/10 overflow-hidden">
  <div class="p-4 border-b border-white/10 bg-[#1A1D23] flex justify-between items-center sticky top-0 z-10">
    <h3 class="text-xs font-bold text-white uppercase tracking-widest font-mono">High-Volume Order Matrix</h3>
    <button 
      onclick={injectBulkToCart} 
      disabled={totalItems === 0 || isProcessing}
      class="bg-[#36f4a4] text-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50"
    >
      {isProcessing ? 'Injecting...' : `Add ${totalItems} Units to Cart`}
    </button>
  </div>

  <div class="overflow-x-auto max-h-[60vh] overflow-y-auto">
    <table class="w-full text-left border-collapse">
      <thead class="sticky top-0 bg-[#111318] z-0 shadow-sm border-b border-white/10">
        <tr>
          <th class="p-4 text-[10px] font-bold uppercase tracking-widest text-white/50">SKU</th>
          <th class="p-4 text-[10px] font-bold uppercase tracking-widest text-white/50">Product Intel</th>
          <th class="p-4 text-[10px] font-bold uppercase tracking-widest text-white/50">Tier 1 Unit Cost</th>
          <th class="p-4 text-[10px] font-bold uppercase tracking-widest text-white/50 text-right">Qty</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/5">
        {#each products as product}
          <tr class="hover:bg-white/[0.02] transition-colors">
            <td class="p-4 text-xs font-mono text-white/40">{product.id.substring(0,8).toUpperCase()}</td>
            <td class="p-4 text-xs font-bold text-white">{product.title}</td>
            <td class="p-4 text-xs font-mono text-[#36f4a4]">${(product.base_price * 1.05).toFixed(2)}</td>
            <td class="p-4 text-right">
              <input 
                type="number" 
                min="0" 
                placeholder="0"
                bind:value={quantities[product.id]} 
                class="w-20 bg-[#1A1D23] border border-white/10 text-white px-2 py-1 text-center text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono"
              />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
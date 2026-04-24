<script lang="ts">
  import { cart } from '../../../stores/cart.svelte';

  let { orderId } = $props<{ orderId: string }>();      
  let isProcessing = $state(false);

  async function handleReorder() {
    isProcessing = true;
    try {
      const res = await fetch(`/api/account/orders/${orderId}/reorder`, {
        method: 'POST',
      });
      if (res.ok) {
        const { items } = await res.json();
        
        // Wire natively to Svelte 5 Cart Store
        items.forEach((item: any) => {
          cart.addItem({
            id: item.product_id,
            productId: item.product_id,
            brand: item.brand || 'Unknown',
            name: item.title,
            price: item.base_price,
            was: item.retail_price,
            stock: item.stock || 10,
            image: item.image_url || '/placeholder.png'
          }, item.quantity || 1);
        });

        // Trigger the cart drawer explicitly
        if (typeof cart.toggleCart === 'function') {
          cart.toggleCart();
        } else {
          // Fallback if toggleCart isn't standard
          window.dispatchEvent(new CustomEvent('open-cart'));
        }
      }
    } finally {
      isProcessing = false;
    }
  }
</script>

<button
  onclick={handleReorder}
  disabled={isProcessing}
  class="w-full border border-brand/30 bg-base px-6 py-3 text-xs font-bold tracking-widest text-brand uppercase transition-colors hover:bg-brand/10 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
>
  {isProcessing ? 'Hydrating Cart...' : 'Buy Again'}    
</button>

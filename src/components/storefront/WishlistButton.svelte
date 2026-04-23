<script lang="ts">
  let { productId, initialState = false } = $props<{ productId: string, initialState?: boolean }>();
  let isSaved = $state(initialState);
  let isProcessing = $state(false);

  async function toggleWishlist(e: Event) {
    e.preventDefault();
    e.stopPropagation(); // Prevent triggering product card link
    
    if (isProcessing) return;
    
    // Optimistic UI Update
    isSaved = !isSaved;
    isProcessing = true;

    try {
      const method = isSaved ? 'POST' : 'DELETE';
      const body = isSaved ? { product_id: productId, notify_price_drop: true, notify_restock: true } : { product_id: productId };
      
      const res = await fetch('/api/account/wishlist', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (!res.ok) {
        // Revert on failure
        isSaved = !isSaved;
        if (res.status === 401) window.location.href = '/auth/login';
      }
    } catch {
      isSaved = !isSaved; // Revert on network error
    } finally {
      isProcessing = false;
    }
  }
</script>

<button 
  onclick={toggleWishlist} 
  class="absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all {isSaved ? 'bg-[#36f4a4]/20 border-[#36f4a4]/50' : 'bg-black/50 border-white/10 hover:border-white/30'} focus:outline-none z-10 group"
  aria-label="Toggle Wishlist"
>
  <svg class="w-4 h-4 transition-colors {isSaved ? 'text-[#36f4a4] fill-[#36f4a4]' : 'text-white/70 group-hover:text-white fill-transparent'}" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
</button>
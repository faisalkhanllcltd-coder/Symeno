<script lang="ts">
  let { initialItems = [], shareId = '' } = $props<{ initialItems: any[], shareId: string }>();
  let items = $state(initialItems);
  let shareCopied = $state(false);

  async function removeItem(productId: string) {
    items = items.filter(i => i.product_id !== productId); // Optimistic
    await fetch('/api/account/wishlist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId })
    });
  }

  async function updateNotifications(productId: string, priceDrop: boolean, restock: boolean) {
    await fetch('/api/account/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, notify_price_drop: priceDrop, notify_restock: restock })
    });
  }

  async function moveToCart(productId: string) {
    // In production, integrate with Cart Store here
    // e.g., cartStore.add(productId);
    alert('Added to cart');
    await removeItem(productId);
  }

  function copyShareLink() {
    const url = `${window.location.origin}/wishlist/${shareId}`;
    navigator.clipboard.writeText(url);
    shareCopied = true;
    setTimeout(() => shareCopied = false, 2000);
  }
</script>

<div class="space-y-6">
  {#if items.length > 0}
    <div class="flex justify-between items-center bg-[#111318] p-4 border border-white/10">
      <div class="text-xs font-mono text-white/50">{items.length} Items Saved</div>
      <button onclick={copyShareLink} class="flex items-center gap-2 border border-[#36f4a4]/30 text-[#36f4a4] px-4 py-2 text-[10px] font-mono uppercase tracking-widest hover:bg-[#36f4a4]/10 transition-colors">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-5.368m0 5.368l5.662 3.146m-5.662-3.146l5.662-3.146m0 0a3 3 0 105.368-3.146 3 3 0 00-5.368 3.146z" /></svg>
        {shareCopied ? 'Link Copied!' : 'Share Wishlist'}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each items as item}
        <div class="bg-[#111318] border border-white/10 flex flex-col hover:border-white/30 transition-colors group">
          <div class="aspect-square bg-[#0a0b0e] relative overflow-hidden">
            <img src={item.image_url || '/placeholder.png'} alt={item.title} class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            <button onclick={() => removeItem(item.product_id)} class="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-white/50 hover:text-rose-400 hover:bg-black transition-colors">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            {#if item.stock <= 0}
              <div class="absolute bottom-0 left-0 w-full bg-rose-500/90 text-white text-[10px] font-bold text-center py-1 uppercase tracking-widest">Out of Stock</div>
            {/if}
          </div>
          
          <div class="p-4 flex-1 flex flex-col">
            <a href={`/shop/product/${item.slug}`} class="text-xs font-bold text-white hover:text-[#36f4a4] mb-1 truncate block">{item.title}</a>
            <p class="text-[10px] font-mono text-[#36f4a4] font-bold mb-4">${item.base_price?.toFixed(2)}</p>
            
            <div class="space-y-2 mt-auto border-t border-white/10 pt-4 mb-4">
              <label class="flex items-center gap-2 cursor-pointer group/toggle">
                <input type="checkbox" bind:checked={item.notify_price_drop} onchange={() => updateNotifications(item.product_id, item.notify_price_drop, item.notify_restock)} class="accent-[#36f4a4] w-3 h-3" />
                <span class="text-[9px] font-mono text-white/50 group-hover/toggle:text-white transition-colors">Notify on price drop</span>
              </label>
              {#if item.stock <= 0}
                <label class="flex items-center gap-2 cursor-pointer group/toggle">
                  <input type="checkbox" bind:checked={item.notify_restock} onchange={() => updateNotifications(item.product_id, item.notify_price_drop, item.notify_restock)} class="accent-[#36f4a4] w-3 h-3" />
                  <span class="text-[9px] font-mono text-white/50 group-hover/toggle:text-white transition-colors">Notify when restocked</span>
                </label>
              {/if}
            </div>

            <button onclick={() => moveToCart(item.product_id)} disabled={item.stock <= 0} class="w-full border border-white/10 text-white px-4 py-2 text-[10px] font-mono uppercase tracking-widest hover:bg-white/5 transition-colors disabled:opacity-30 disabled:hover:bg-transparent">
              {item.stock > 0 ? 'Move to Cart' : 'Unavailable'}
            </button>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="bg-[#111318] p-12 border border-white/10 text-center">
      <svg class="w-12 h-12 text-white/20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
      <h3 class="text-sm font-bold text-white uppercase tracking-widest mb-2">Your wishlist is empty</h3>
      <p class="text-[10px] font-mono text-white/40 mb-6">Explore the matrix to find hardware and upgrades.</p>
      <a href="/shop" class="bg-[#36f4a4] text-black px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors">Explore Products</a>
    </div>
  {/if}
</div>
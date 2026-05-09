<script lang="ts">
  // FIX: Removed the explicit .ts extension 
  import { cart } from '../../stores/cart.svelte.ts';

  let { initialItems = [], shareId = '' } = $props<{    
    initialItems?: any[];
    shareId?: string;
  }>();
  let items = $state(structuredClone(initialItems));
  let shareCopied = $state(false);

  async function removeItem(productId: string) {        
    items = items.filter((i) => i.product_id !== productId); 
    await fetch('/api/account/wishlist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },    
      body: JSON.stringify({ product_id: productId }),    
    });
  }

  async function updateNotifications(
    productId: string,
    priceDrop: boolean,
    restock: boolean
  ) {
    await fetch('/api/account/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },    
      body: JSON.stringify({
        product_id: productId,
        notify_price_drop: priceDrop,
        notify_restock: restock,
      }),
    });
  }

  async function moveToCart(item: any) {
    cart.addItem({
      id: item.product_id,
      productId: item.product_id,
      brand: item.brand || 'Unknown',
      name: item.title,
      price: item.base_price,
      was: item.retail_price,
      stock: item.stock,
      image: item.image_url || '/placeholder.webp'        
    }, 1);

    await removeItem(item.product_id);
  }

  function copyShareLink() {
    const url = `${window.location.origin}/wishlist/${shareId}`;
    navigator.clipboard.writeText(url);
    shareCopied = true;
    setTimeout(() => (shareCopied = false), 2000);        
  }
</script>

<div class="space-y-6 transition-colors duration-300">    
  {#if items.length > 0}
    <div
      class="flex items-center justify-between border border-outline bg-surface p-4"
    >
      <div class="font-mono text-xs text-content-muted">  
        {items.length} Items Saved
      </div>
      <button
        onclick={copyShareLink}
        class="flex items-center gap-2 border border-brand/30 px-4 py-2 font-mono text-[10px] tracking-widest text-brand uppercase transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-5.368m0 5.368l5.662 3.146m-5.662-3.146l5.662-3.146m0 0a3 3 0 105.368-3.146 3 3 0 00-5.368 3.146z"
          /></svg
        >
        {shareCopied ? 'Link Copied!' : 'Share Wishlist'} 
      </button>
    </div>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {#each items as item}
        <div
          class="group relative flex flex-col border border-outline bg-surface transition-colors hover:border-content-muted focus-within:ring-2 focus-within:ring-brand" 
        >

          <a href={`/shop/product/${item.slug}`} class="absolute inset-0 z-10" aria-label={`View ${item.title}`}></a>

          <div class="relative aspect-square overflow-hidden bg-base">
            <img
              src={item.image_url || '/placeholder.webp'} 
              alt={item.title}
              class="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
            />

            <button
              onclick={() => removeItem(item.product_id)} 
              class="absolute top-2 right-2 z-20 rounded-full bg-base/50 p-2 text-content-muted transition-colors hover:bg-base hover:text-brand-alert focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-alert"       
            >
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                /></svg
              >
            </button>
            {#if item.stock <= 0}
              <div
                class="absolute bottom-0 left-0 w-full bg-brand-alert/90 py-1 text-center text-[10px] font-bold tracking-widest text-brand-dark uppercase z-0"
              >
                Out of Stock
              </div>
            {/if}
          </div>

          <div class="flex flex-1 flex-col p-4 relative z-0 pointer-events-none">
            <h3
              class="mb-1 block truncate text-xs font-bold text-content transition-colors group-hover:text-brand rounded-sm"
              >{item.title}</h3
            >
            <p class="mb-4 font-mono text-[10px] font-bold text-brand">
              ${(item.base_price || 0).toFixed(2)}
            </p>

            <div class="mt-auto mb-4 space-y-2 border-t border-outline pt-4 pointer-events-auto relative z-20">
              <label
                class="group/toggle flex cursor-pointer items-center gap-2"
              >
                <input
                  type="checkbox"
                  bind:checked={item.notify_price_drop}   
                  onchange={() =>
                    updateNotifications(
                      item.product_id,
                      item.notify_price_drop,
                      item.notify_restock
                    )}
                  class="h-3 w-3 border-outline bg-base accent-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
                />
                <span
                  class="font-mono text-[9px] text-content-muted transition-colors group-hover/toggle:text-content" 
                  >Notify on price drop</span
                >
              </label>
              {#if item.stock <= 0}
                <label
                  class="group/toggle flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="checkbox"
                    bind:checked={item.notify_restock}    
                    onchange={() =>
                      updateNotifications(
                        item.product_id,
                        item.notify_price_drop,
                        item.notify_restock
                      )}
                    class="h-3 w-3 border-outline bg-base accent-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
                  />
                  <span
                    class="font-mono text-[9px] text-content-muted transition-colors group-hover/toggle:text-content"
                    >Notify when restocked</span
                  >
                </label>
              {/if}
            </div>


            <button
              onclick={() => moveToCart(item)}
              disabled={item.stock <= 0}
              class="pointer-events-auto relative z-20 w-full border border-outline px-4 py-2 font-mono text-[10px] tracking-widest text-content uppercase transition-colors hover:bg-base disabled:opacity-30 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"   
            >
              {item.stock > 0 ? 'Move to Cart' : 'Unavailable'}
            </button>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="border border-outline bg-surface p-12 text-center">
      <svg
        class="mx-auto mb-4 h-12 w-12 text-content-muted opacity-50"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        /></svg
      >
      <h3 class="mb-2 text-sm font-bold tracking-widest text-content uppercase">
        Your wishlist is empty
      </h3>
      <p class="mb-6 font-mono text-[10px] text-content-muted">
        Explore the matrix to find hardware and upgrades. 
      </p>
      <a
        href="/shop"
        class="inline-block bg-brand px-6 py-3 text-[10px] font-bold tracking-widest text-brand-dark uppercase transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark rounded-sm"
        >Explore Products</a
      >
    </div>
  {/if}
</div>
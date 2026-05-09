<script lang="ts">
  import { onMount } from 'svelte';
  import { cart } from '../../../stores/cart.svelte.ts';

  interface Props {
    product: {
      id: string;
      slug: string;
      name: string;
      brand: string;
      price: number;
      retailPrice: number;
      in_stock: number;
      images: string[];
    };
  }

  let { product } = $props<Props>();

  let isVisible = $state(false);
  let isAdding = $state(false);

  // Performance-optimized viewport tracking
  onMount(() => {
    const mainCartZone = document.getElementById('main-add-to-cart');
    
    if (!mainCartZone) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible = false;
        } else {
          // Show only if user scrolled DOWN past the button
          isVisible = entry.boundingClientRect.top < 0;
        }
      },
      { root: null, threshold: 0 }
    );

    observer.observe(mainCartZone);
    return () => observer.disconnect();
  });

  function handleAddToCart() {
    if (isAdding) return;
    isAdding = true;
    
    cart.addItem({
      id: product.id,
      slug: product.slug,
      brand: product.brand,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0] : '/images/system/fallback.webp'
    }, 1);

    cart.openCart();
    setTimeout(() => { isAdding = false; }, 600);
  }
</script>

<div
  class="bg-surface border-outline fixed bottom-0 left-0 z-40 w-full border-t p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden"
  style="transform: translateY({isVisible ? '0%' : '100%'})"
  aria-hidden={!isVisible}
>
  <div class="mx-auto flex max-w-6xl items-center justify-between gap-4">
    <div class="flex flex-1 items-center gap-3 overflow-hidden">
      {#if product.images && product.images.length > 0}
        <img src={product.images[0]} alt={product.name} class="border-outline bg-base h-10 w-10 shrink-0 rounded-md border object-cover" />
      {/if}
      <div class="flex flex-col overflow-hidden">
        <span class="text-content truncate font-mono text-[10px] tracking-widest uppercase">{product.name}</span>
        <span class="text-brand font-mono text-[11px] font-bold">${product.price.toFixed(2)}</span>
      </div>
    </div>

    <button
      onclick={handleAddToCart}
      disabled={isAdding || product.in_stock === 0}
      class="bg-brand text-brand-dark min-w-[120px] shrink-0 rounded-md px-6 py-3 font-mono text-[10px] font-bold tracking-widest uppercase transition-all duration-300 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-50"
    >
      {#if product.in_stock === 0}
        Depleted
      {:else if isAdding}
        Securing...
      {:else}
        Add to Cart
      {/if}
    </button>
  </div>
</div>
<script lang="ts">
  // THE FIX: Removed the .ts extension to prevent Vite build failure
  import { cart } from '../../stores/cart.svelte.ts';

  // Svelte 5 Runes API for incoming props
  let { product } = $props<{ product: any }>();
  
  let status = $state<'idle' | 'adding' | 'success'>('idle');

  function handleAdd() {
    if (product.stock <= 0) return;

    status = 'adding';

    cart.addItem(
      {
        id: product.id,
        productId: product.productId,
        brand: product.brand,
        name: product.name,
        price: product.price,
        was: product.was,
        stock: product.stock,
        image: product.image,
      },
      1
    );

    setTimeout(() => {
      status = 'success';
      setTimeout(() => {
        status = 'idle';
      }, 2000);
    }, 200);
  }
</script>

<button
  onclick={handleAdd}
  disabled={product.stock <= 0 || status !== 'idle'}
  class="w-full py-4 text-sm font-bold tracking-widest uppercase shadow-[0_10px_20px_-10px_var(--color-brand)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand
    {status === 'success'
    ? 'bg-content text-base shadow-[0_0_20px_var(--color-content)]'
    : 'bg-brand text-brand-dark hover:opacity-80'}
    disabled:cursor-not-allowed disabled:opacity-50"
>
  {#if status === 'success'}
    Added to Secure Cart &check;
  {:else if status === 'adding'}
    Processing...
  {:else if product.stock <= 0}
    Out of Stock
  {:else}
    Add to Secure Cart
  {/if}
</button>
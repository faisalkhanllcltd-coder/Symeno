<script lang="ts">
  import { cart } from '../../stores/cart.svelte.ts';

  let { product } = $props<{ product: any }>();
  
  let status = $state<'idle' | 'adding' | 'success'>('idle');

  function handleAdd() {
    if (!product || product.stockStatus <= 0) return;

    status = 'adding';

    // THE FIX: Aligned perfectly with our D1 Edge Database schema
    cart.addItem(
      {
        id: product.id,
        slug: product.slug,
        brand: product.brand,
        name: product.name,
        price: product.price,
        retailPrice: product.retailPrice,
        stockStatus: product.stockStatus,
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
  disabled={product.stockStatus <= 0 || status !== 'idle'}
  class="w-full min-h-[48px] rounded py-3 text-sm font-bold tracking-widest uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:ring-offset-2 focus:ring-offset-base
    {status === 'success'
    ? 'bg-content text-base shadow-[0_0_20px_rgba(var(--color-content-rgb),0.2)]'
    : 'bg-brand text-brand-dark hover:opacity-90 shadow-[0_0_15px_rgba(54,244,164,0.15)] hover:shadow-[0_0_25px_rgba(54,244,164,0.3)]'}
    disabled:cursor-not-allowed disabled:opacity-50"
>
  {#if status === 'success'}
    Allocation Secured &check;
  {:else if status === 'adding'}
    Processing...
  {:else if product.stockStatus <= 0}
    Allocation Exhausted
  {:else}
    Add to Cart
  {/if}
</button>
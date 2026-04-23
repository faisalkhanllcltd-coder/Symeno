<script>
  import { cart } from '../../stores/cart.svelte.ts';

  // The product data passed down from the Astro server
  export let product = {};

  let status = 'idle'; // 'idle', 'adding', 'success'

  function handleAdd() {
    if (product.stock <= 0) return;
    
    status = 'adding';
    
    // Push the item to our global Svelte 5 Rune store
    cart.addItem({
      id: product.id,
      productId: product.productId,
      brand: product.brand,
      name: product.name,
      price: product.price,
      was: product.was,
      stock: product.stock,
      image: product.image
    }, 1);

    // Provide high-end visual feedback
    setTimeout(() => {
      status = 'success';
      setTimeout(() => {
        status = 'idle';
      }, 2000);
    }, 200);
  }
</script>

<button 
  on:click={handleAdd}
  disabled={product.stock <= 0 || status !== 'idle'}
  class="w-full py-4 font-bold text-sm uppercase tracking-widest transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(54,244,164,0.3)] 
    {status === 'success' ? 'bg-white text-[#003822] shadow-[0_0_20px_rgba(255,255,255,0.4)]' : 'bg-[#36f4a4] text-[#003822] hover:bg-white'} 
    disabled:opacity-50 disabled:cursor-not-allowed"
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

<script>
  import { cart } from '../../stores/cart.svelte.ts';
  import { fade } from 'svelte/transition';

  // UX State Management
  let isCheckingOut = $state(false);
  let activeToast = $state('');
  let toastTimeout;

  function triggerToast(message) {
    activeToast = message;
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      activeToast = '';
    }, 3000);
  }

  function handleUpdateQuantity(id, currentQty, newQty, stock) {
    if (newQty > stock) {
      triggerToast(`Maximum allocated inventory (${stock} units) reached.`);
      return;
    }
    cart.updateQuantity(id, newQty);
  }

  async function handleCheckout() {
    isCheckingOut = true;
    
    try {
      // Allow Edge KV to complete final sync and transition securely
      await new Promise(resolve => setTimeout(resolve, 600)); 
      window.location.href = '/checkout';
    } catch (e) {
      isCheckingOut = false;
      triggerToast('Checkout initialization failed. Please try again.');
    }
  }
</script>

{#if activeToast}
  <div transition:fade={{ duration: 150 }} class="fixed bottom-6 right-6 bg-brand-alert/10 border border-brand-alert/30 text-brand-alert px-4 py-3 text-[10px] font-mono uppercase tracking-widest z-50 shadow-[0_0_20px_rgba(239,68,68,0.15)] flex items-center gap-2">
    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
    {activeToast}
  </div>
{/if}

{#if cart.items.length === 0}
  <div class="flex flex-col items-center justify-center py-24 text-center border border-[#dae5e6]/10 bg-[#131d1e]">
    <svg class="w-16 h-16 text-[#dae5e6]/20 mb-6" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
    <h2 class="text-2xl font-bold text-white tracking-tight mb-2">Your cart is empty.</h2>
    <p class="text-[#dae5e6]/50 mb-8 font-light">Access our wholesale catalog to begin adding inventory.</p>
    <a href="/shop" class="bg-[#36f4a4] text-[#003822] px-8 py-4 font-bold text-sm uppercase tracking-widest hover:bg-white transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(54,244,164,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
      Browse Catalog
    </a>
  </div>
{:else}
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
    
    <div class="lg:col-span-8 space-y-6">
      <div class="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-[#dae5e6]/10 text-xs font-mono text-[#dae5e6]/50 uppercase tracking-widest">
        <div class="col-span-6">Product</div>
        <div class="col-span-3 text-center">Quantity</div>
        <div class="col-span-3 text-right">Total</div>
      </div>

      {#each cart.items as item (item.id)}
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-4 border-b border-[#dae5e6]/5 group">
          <div class="col-span-1 md:col-span-6 flex gap-4">
            <div class="w-24 h-24 bg-[#131d1e] border border-[#dae5e6]/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
              <span class="text-[10px] font-mono text-[#dae5e6]/20">{item.image || "Image"}</span>
            </div>
            <div class="flex flex-col justify-center">
              <span class="text-[10px] uppercase font-mono tracking-widest text-[#dae5e6]/50 mb-1">{item.brand}</span>
              <a href={`/shop/product/${item.productId}`} class="text-sm font-medium text-white hover:text-[#36f4a4] transition-colors line-clamp-2 leading-snug focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#36f4a4]">{item.name}</a>
              <button on:click={() => cart.removeItem(item.id)} class="text-xs text-rose-400/80 hover:text-rose-400 mt-2 text-left font-mono uppercase tracking-wider w-fit transition-colors focus-visible:outline-none focus-visible:underline">Remove</button>
            </div>
          </div>

          <div class="col-span-1 md:col-span-3 flex md:justify-center items-center mt-2 md:mt-0">
            <div class="flex items-center border border-[#dae5e6]/15 bg-[#070d0e]">
              <button on:click={() => handleUpdateQuantity(item.id, item.qty, item.qty - 1, item.stock)} class="px-3 py-1.5 text-[#dae5e6]/50 hover:text-[#36f4a4] transition-colors disabled:opacity-30 focus-visible:outline-none focus-visible:bg-white/5" disabled={item.qty <= 1}>-</button>
              <span class="w-8 text-center text-sm font-mono text-white">{item.qty}</span>
              <button on:click={() => handleUpdateQuantity(item.id, item.qty, item.qty + 1, item.stock)} class="px-3 py-1.5 text-[#dae5e6]/50 hover:text-[#36f4a4] transition-colors disabled:opacity-30 focus-visible:outline-none focus-visible:bg-white/5" disabled={item.qty >= item.stock}>+</button>
            </div>
            {#if item.qty >= item.stock}
               <span class="text-[10px] text-rose-400 font-mono ml-3 uppercase tracking-widest md:hidden">Max Stock</span>
            {/if}
          </div>

          <div class="col-span-1 md:col-span-3 flex justify-between md:justify-end items-center mt-2 md:mt-0">
            <span class="md:hidden text-xs font-mono text-[#dae5e6]/50 uppercase">Total:</span>
            <div class="text-right">
              <span class="block text-lg font-bold text-[#36f4a4] font-mono tracking-tight">${(item.price * item.qty).toFixed(2)}</span>
              <span class="block text-[10px] text-[#dae5e6]/40 line-through font-mono uppercase mt-0.5">Retail: ${(item.was * item.qty).toFixed(2)}</span>
            </div>
          </div>
        </div>
      {/each}
    </div>

    <div class="lg:col-span-4">
      <div class="bg-[#131d1e] border border-[#dae5e6]/10 p-6 md:p-8 sticky top-28 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]">
        <h2 class="text-lg font-bold text-white mb-6 tracking-tight">Order Summary</h2>
        
        <div class="space-y-4 text-sm mb-6 border-b border-[#dae5e6]/10 pb-6">
          <div class="flex justify-between text-[#dae5e6]/70">
            <span>Subtotal</span>
            <span class="font-mono text-white">${cart.subtotal.toFixed(2)}</span>
          </div>
          <div class="flex justify-between text-[#dae5e6]/70">
            <span>Priority Shipping</span>
            <span class="font-mono text-[#36f4a4] uppercase tracking-wider text-xs font-bold">Free</span>
          </div>
          <div class="flex justify-between text-[#36f4a4] font-bold">
            <span>Total Savings</span>
            <span class="font-mono">-${cart.savings.toFixed(2)}</span>
          </div>
        </div>

        <div class="flex justify-between items-end mb-8">
          <span class="text-base font-medium text-white">Total</span>
          <span class="text-3xl font-bold text-white font-mono tracking-tighter">${cart.subtotal.toFixed(2)}</span>
        </div>

        <button 
          on:click={handleCheckout} 
          disabled={isCheckingOut} 
          class="block w-full bg-[#36f4a4] text-[#003822] text-center py-4 font-bold text-sm uppercase tracking-widest hover:bg-white transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(54,244,164,0.3)] disabled:opacity-70 disabled:cursor-wait focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white flex items-center justify-center gap-2"
        >
          {#if isCheckingOut}
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-[#003822]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Securing...
          {:else}
            Proceed to Checkout
          {/if}
        </button>

        <p class="text-center text-[10px] font-mono text-[#dae5e6]/40 mt-6 uppercase tracking-[0.1em]">
          Taxes calculated at checkout
        </p>
      </div>
    </div>

  </div>
{/if}
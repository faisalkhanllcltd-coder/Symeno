<script lang="ts">
  import { cart } from '../../../stores/cart.svelte';
  
  let isProcessing = $state(false);

  async function initializeCheckout() {
    if (cart.items.length === 0) return;
    isProcessing = true;

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart.items })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Checkout initialization failed');
      }

      const { url } = await response.json();
      
      // Redirect the user's browser to the secure Stripe Checkout Session
      window.location.href = url;
      
    } catch (error) {
      console.error('[CHECKOUT_ERROR]', error);
      alert('The secure checkout gateway is temporarily unreachable.');
      isProcessing = false;
    }
  }
</script>

{#if cart.isOpen}
  <div 
    class="fixed inset-0 bg-content/80 backdrop-blur-sm z-40 transition-opacity"
    aria-hidden="true"
    onclick={() => cart.closeCart()}
  ></div>
{/if}

<div 
  class="fixed inset-y-0 right-0 w-full max-w-md bg-base shadow-[0_0_50px_rgba(0,0,0,0.5)] z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col border-l border-outline"
  style="transform: translateX({cart.isOpen ? '0%' : '100%'})"
>
  <div class="px-6 py-6 border-b border-outline flex items-center justify-between bg-surface">
    <h2 class="text-lg font-bold text-content font-sans uppercase tracking-tight flex items-center gap-3">
      <span class="w-2 h-2 bg-brand"></span>
      Active Payload
    </h2>
    <button onclick={() => cart.closeCart()} class="text-content-muted hover:text-brand transition-colors p-2 focus:outline-none" aria-label="Close cart">
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
    </button>
  </div>

  <div class="flex-1 overflow-y-auto p-6 space-y-6">
    {#if cart.items.length === 0}
      <div class="h-full flex flex-col items-center justify-center text-center opacity-50">
        <svg class="w-12 h-12 text-content-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        <p class="text-sm font-mono text-content-muted uppercase tracking-widest">Cart is empty</p>
      </div>
    {:else}
      {#each cart.items as item (item.id)}
        <div class="flex gap-4 p-4 bg-surface rounded-xl border border-outline shadow-ambient group">
          <div class="w-20 h-20 bg-surface-hover rounded-md flex items-center justify-center border border-outline/50">
            <span class="text-[8px] text-content-muted font-mono uppercase tracking-widest opacity-50">SKU</span>
          </div>
          <div class="flex-1 flex flex-col">
            <div class="flex justify-between items-start mb-1">
              <span class="text-xs font-mono text-brand uppercase tracking-widest truncate max-w-[150px]">{item.productId}</span>
              <button onclick={() => cart.removeItem(item.id)} class="text-content-muted hover:text-brand-alert transition-colors" aria-label="Remove">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
            
            {#if item.variantId}
              <span class="text-[10px] text-content-muted font-mono mb-2 block border border-outline w-max px-2 py-0.5 rounded">{item.variantId}</span>
            {/if}

            <div class="mt-auto flex items-center justify-between">
              <div class="flex items-center gap-3 bg-base border border-outline rounded-md p-1">
                <button onclick={() => cart.updateQuantity(item.id, item.quantity - 1)} class="w-6 h-6 flex items-center justify-center text-content-muted hover:text-content transition-colors" aria-label="Decrease">&minus;</button>
                <span class="text-xs font-mono text-content w-4 text-center">{item.quantity}</span>
                <button onclick={() => cart.updateQuantity(item.id, item.quantity + 1)} class="w-6 h-6 flex items-center justify-center text-content-muted hover:text-content transition-colors" aria-label="Increase">&plus;</button>
              </div>
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>

  {#if cart.items.length > 0}
    <div class="p-6 bg-surface border-t border-outline space-y-4">
      <div class="flex items-center justify-between font-mono text-sm mb-4">
        <span class="text-content-muted uppercase tracking-widest">Total Operators:</span>
        <span class="text-brand font-bold">{cart.totalItems}</span>
      </div>
      <button 
        onclick={initializeCheckout} 
        disabled={isProcessing}
        class="w-full bg-brand text-brand-dark py-4 rounded-md text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-all duration-300 shadow-[0_0_15px_rgba(54,244,164,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Establishing Secure Link...' : 'Proceed to Checkout'}
      </button>
      <p class="text-[9px] text-content-muted text-center font-mono uppercase tracking-widest mt-4">Pricing calculated securely on server</p>
    </div>
  {/if}
</div>
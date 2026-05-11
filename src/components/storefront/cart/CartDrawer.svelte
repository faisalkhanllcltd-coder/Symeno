<script lang="ts">
  import { onMount } from 'svelte';
  import { cart } from '../../../stores/cart.svelte.ts';
  import { auth } from '../../../stores/auth.svelte.ts';

  let isProcessing = $state(false);

  // Ensure we know the user's auth status before they try to checkout
  onMount(() => {
    if (auth.isLoading && !auth.isAuthenticated) {
      auth.checkSession();
    }
  });

  async function initializeCheckout() {
    if (cart.items.length === 0) return;

    // THE GATEKEEPER: Intercept unauthenticated users securely
    if (!auth.isAuthenticated) {
      cart.closeCart();
      window.location.href = '/auth/register?returnTo=/checkout';
      return;
    }

    isProcessing = true;

    try {
      const response = await fetch('/api/checkout/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: cart.items,
          // Fallback mocked data for checkout init requirements
          customer_email: auth.user?.email || 'pending@checkout.com',
          shipping_name: auth.user?.firstName ? `${auth.user.firstName} ${auth.user.lastName}` : 'Pending',
          shipping_address: 'Pending'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Checkout initialization failed');        
      }

      const { url, orderId } = await response.json();
      
      // If Stripe URL exists, route there. Otherwise, route to manual checkout page.
      if (url) {
        window.location.href = url;
      } else {
        window.location.href = `/checkout?order=${orderId}`;
      }
    } catch (error) {
      console.error('[CHECKOUT_ERROR]', error);
      alert('The secure checkout gateway is temporarily unreachable.');
      isProcessing = false;
    }
  }
</script>

{#if cart.isOpen}
  <div
    class="bg-base/80 fixed inset-0 z-60 backdrop-blur-sm transition-opacity"    
    aria-hidden="true"
    onclick={() => cart.closeCart()}
    role="presentation"
  ></div>
{/if}

<div
  class="bg-surface border-outline fixed inset-y-0 right-0 z-70 flex w-full max-w-md transform flex-col border-l shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
  style="transform: translateX({cart.isOpen ? '0%' : '100%'})"
>
  <div class="border-outline bg-base flex items-center justify-between border-b px-5 py-5">
    <h2 class="text-content flex items-center gap-2 font-mono text-sm font-bold tracking-widest uppercase">
      <span class="bg-brand h-1.5 w-1.5 animate-pulse rounded-full"></span>
      Active Payload
    </h2>
    <button
      onclick={() => cart.closeCart()}
      class="text-content-muted hover:text-brand flex min-h-[36px] min-w-[36px] items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand rounded-sm"
      aria-label="Close cart"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  </div>

  <div class="flex-1 space-y-4 overflow-y-auto p-5">
    {#if cart.items.length === 0}
      <div class="flex h-full flex-col items-center justify-center text-center opacity-60">
        <svg class="text-content-muted mb-3 h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
        <p class="text-content-muted font-mono text-[10px] tracking-widest uppercase">Cart is empty</p>
      </div>
    {:else}
      {#each cart.items as item (item.id)}
        <div class="bg-base border-outline group flex gap-3 rounded-lg border p-3 shadow-sm transition-colors hover:border-brand/30">
          <div class="bg-surface border-outline/50 relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border">
            {#if item.image}
              <img src={item.image} alt={item.name} class="h-full w-full object-cover" />
            {:else}
              <span class="text-content-muted font-mono text-[7px] tracking-widest uppercase opacity-50">IMG</span>
            {/if}
          </div>
          <div class="flex flex-1 flex-col">
            <div class="mb-0.5 flex items-start justify-between">
              <span class="text-brand max-w-[140px] truncate font-mono text-[10px] font-bold tracking-widest uppercase" title={item.name}>{item.name}</span>
              <button
                onclick={() => cart.removeItem(item.id)}
                disabled={isProcessing}
                class="text-content-muted hover:text-brand-alert flex min-h-[32px] min-w-[32px] items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-alert rounded-sm disabled:opacity-50 disabled:cursor-not-allowed -mt-1.5 -mr-1.5"
                aria-label="Remove"
              >
                <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>

            <div class="flex items-center justify-between">
               <span class="font-mono text-[9px] text-content-muted truncate max-w-[100px]">ID: {item.slug}</span>
               {#if item.variantId}
                 <span class="text-content-muted border-outline rounded-sm border px-1.5 py-0.5 font-mono text-[8px]">{item.variantId}</span>
               {/if}
            </div>

            <div class="mt-auto flex items-center justify-between pt-2">
              <span class="font-mono text-[11px] text-content font-bold">${(item.price || 0).toFixed(2)}</span>
              <div class="bg-surface border-outline flex items-center rounded-sm border p-0.5">
                <button
                  onclick={() => cart.updateQuantity(item.id, item.qty - 1)}
                  disabled={isProcessing}
                  class="text-content-muted hover:text-content hover:bg-base flex h-6 w-6 items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Decrease">&minus;</button>
                <span class="text-content w-5 text-center font-mono text-[10px]">{item.qty}</span>
                <button
                  onclick={() => cart.updateQuantity(item.id, item.qty + 1)}
                  disabled={isProcessing}
                  class="text-content-muted hover:text-content hover:bg-base flex h-6 w-6 items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Increase">&plus;</button>
              </div>
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>

  {#if cart.items.length > 0}
    <div class="bg-base border-outline space-y-3 border-t p-5">
      <div class="flex items-center justify-between font-mono text-[11px]">        
        <span class="text-content-muted tracking-widest uppercase">Total Operators:</span>
        <span class="text-content font-bold">{cart.totalItems}</span>
      </div>
      <div class="flex items-center justify-between font-mono text-xs pb-2 border-b border-outline/50">        
        <span class="text-content-muted tracking-widest uppercase">Subtotal:</span>
        <span class="text-brand font-bold">${(cart.subtotal || 0).toFixed(2)}</span>
      </div>
      <button
        onclick={initializeCheckout}
        disabled={isProcessing}
        class="bg-brand text-brand-dark w-full min-h-[40px] rounded-sm py-3 font-mono text-[10px] font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(54,244,164,0.15)] transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_20px_rgba(54,244,164,0.25)] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-dark mt-2"
      >
        {isProcessing ? 'Establishing Link...' : 'Proceed to Checkout'}      
      </button>
      <p class="text-content-muted mt-2 text-center font-mono text-[8px] tracking-widest uppercase">End-to-End Encrypted</p>
    </div>
  {/if}
</div>
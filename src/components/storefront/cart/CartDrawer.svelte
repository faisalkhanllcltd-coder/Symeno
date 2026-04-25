<script lang="ts">
  import { cart } from '../../../stores/cart.svelte.ts';

  let isProcessing = $state(false);

  async function initializeCheckout() {
    if (cart.items.length === 0) return;
    isProcessing = true;

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart.items }),
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
    class="bg-content/80 fixed inset-0 z-40 backdrop-blur-sm transition-opacity"
    aria-hidden="true"
    onclick={() => cart.closeCart()}
    role="presentation"
  ></div>
{/if}

<div
  class="bg-base border-outline fixed inset-y-0 right-0 z-50 flex w-full max-w-md transform flex-col border-l shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
  style="transform: translateX({cart.isOpen ? '0%' : '100%'})"        
>
  <div
    class="border-outline bg-surface flex items-center justify-between border-b px-6 py-6"
  >
    <h2
      class="text-content flex items-center gap-3 font-sans text-lg font-bold tracking-tight uppercase"
    >
      <span class="bg-brand h-2 w-2"></span>
      Active Payload
    </h2>
    <button
      onclick={() => cart.closeCart()}
      class="text-content-muted hover:text-brand p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      aria-label="Close cart"
    >
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        /></svg
      >
    </button>
  </div>

  <div class="flex-1 space-y-6 overflow-y-auto p-6">
    {#if cart.items.length === 0}
      <div
        class="flex h-full flex-col items-center justify-center text-center opacity-50"
      >
        <svg
          class="text-content-muted mb-4 h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          /></svg
        >
        <p
          class="text-content-muted font-mono text-sm tracking-widest uppercase"
        >
          Cart is empty
        </p>
      </div>
    {:else}
      {#each cart.items as item (item.id)}
        <div
          class="bg-surface border-outline group flex gap-4 rounded-xl border p-4 shadow-sm"
        >
          <div
            class="bg-base border-outline/50 flex h-20 w-20 items-center justify-center rounded-md border"
          >
            <span
              class="text-content-muted font-mono text-[8px] tracking-widest uppercase opacity-50"
              >SKU</span
            >
          </div>
          <div class="flex flex-1 flex-col">
            <div class="mb-1 flex items-start justify-between">       
              <span
                class="text-brand max-w-[150px] truncate font-mono text-xs tracking-widest uppercase"
                >{item.productId}</span
              >
              <button
                onclick={() => cart.removeItem(item.id)}
                class="text-content-muted hover:text-brand-alert transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-alert rounded-sm"
                aria-label="Remove"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  /></svg
                >
              </button>
            </div>

            {#if item.variantId}
              <span
                class="text-content-muted border-outline mb-2 block w-max rounded border px-2 py-0.5 font-mono text-[10px]"
                >{item.variantId}</span
              >
            {/if}

            <div class="mt-auto flex items-center justify-between">   
              <div
                class="bg-base border-outline flex items-center gap-3 rounded-md border p-1"
              >
                <button
                  onclick={() =>
                    cart.updateQuantity(item.id, item.quantity - 1)}  
                  class="text-content-muted hover:text-content flex h-6 w-6 items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand rounded-sm"
                  aria-label="Decrease">&minus;</button
                >
                <span class="text-content w-4 text-center font-mono text-xs"
                  >{item.quantity}</span
                >
                <button
                  onclick={() =>
                    cart.updateQuantity(item.id, item.quantity + 1)}  
                  class="text-content-muted hover:text-content flex h-6 w-6 items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand rounded-sm"
                  aria-label="Increase">&plus;</button
                >
              </div>
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>

  {#if cart.items.length > 0}
    <div class="bg-surface border-outline space-y-4 border-t p-6">    
      <div class="mb-4 flex items-center justify-between font-mono text-sm">
        <span class="text-content-muted tracking-widest uppercase"    
          >Total Operators:</span
        >
        <span class="text-brand font-bold">{cart.totalItems}</span>   
      </div>
      <button
        onclick={initializeCheckout}
        disabled={isProcessing}
        class="bg-brand text-brand-dark w-full rounded-md py-4 text-sm font-bold tracking-widest uppercase shadow-[0_0_15px_var(--color-brand)] transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
      >
        {isProcessing ? 'Establishing Secure Link...' : 'Proceed to Checkout'}
      </button>
      <p
        class="text-content-muted mt-4 text-center font-mono text-[9px] tracking-widest uppercase"
      >
        Pricing calculated securely on server
      </p>
    </div>
  {/if}
</div>
<script lang="ts">
  import { onMount } from 'svelte';
  import Turnstile from '../../security/Turnstile.svelte';
  import { ui } from '../../../stores/ui.svelte.ts';

  let isLoading = $state(true);
  let isProcessing = $state(false);
  let errorMessage = $state('');
  
  // THE FIX: Explicit state container for the Cloudflare token
  let turnstileToken = $state('');

  let formData = $state({
    fullName: '',
    email: '',
    country: 'AE',
    city: '',
    paymentMethod: 'pre_order',
  });

  let cartItems: any[] = [];
  let cartStore: any = null;

  onMount(async () => {
    const { cart } = await import('../../../stores/cart.svelte');
    cartStore = cart;

    if (cart.items.length === 0) {
      window.location.href = '/shop';
      return;
    }

    cartItems = cart.items;
    isLoading = false;
  });

  async function handleSubmit(e: Event) {
    e.preventDefault();
    
    // THE FIX: Direct validation of Svelte state instead of DOM extraction
    if (!turnstileToken) {
      errorMessage = 'Security token missing. Are you a bot?';
      return;
    }

    isProcessing = true;
    errorMessage = '';

    try {
      const shippingAddress = `${formData.city}, ${formData.country}`;
      
      // Accurately map Svelte 5 cart store properties to the API payload
      const payloadItems = cartItems.map(item => ({        
        productId: item.id || item.slug, 
        qty: item.qty || 1
      }));

      const res = await fetch('/api/checkout/process', {  
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },  
        body: JSON.stringify({
          customer_email: formData.email,
          shipping_name: formData.fullName,
          shipping_address: shippingAddress,
          items: payloadItems,
          'cf-turnstile-response': turnstileToken
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        if ((window as any).turnstile) (window as any).turnstile.reset();
        throw new Error(data.error || 'Failed to process authorization.');
      }

      if (data.success && data.orderId) {
        // Route perfectly to the dedicated Success Terminal
        window.location.href = `/checkout/success?order=${data.orderId}`;
      }
    } catch (e: any) {
      errorMessage = e.message || 'Transmission failed. Retrying required.';
      isProcessing = false;
      if ((window as any).turnstile) (window as any).turnstile.reset();
    }
  }
</script>

<div class="relative min-h-[400px] border border-outline bg-surface p-6 sm:p-8 transition-colors duration-300 rounded-xl shadow-ambient">     
  <h2 class="mb-8 border-b border-outline pb-4 font-mono text-sm font-bold tracking-widest text-content uppercase"> 
    Secure Checkout Gateway
  </h2>

  {#if isLoading}
    <div class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-base/80 backdrop-blur-sm rounded-xl">        
      <div class="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-brand/20 border-t-brand"></div>
      <p class="animate-pulse font-mono text-[10px] tracking-widest text-brand uppercase">
        Initializing native gateway...
      </p>
    </div>
  {/if}

  {#if errorMessage}
    <div class="mb-6 border border-brand-alert/30 bg-brand-alert/10 p-4 font-mono text-xs tracking-widest text-brand-alert uppercase rounded">
      {errorMessage}
    </div>
  {/if}

  <form onsubmit={handleSubmit} id="payment-form" data-secured="true" class="space-y-8 {isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}">

    <div>
      <h3 class="mb-4 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase">
        1. Logistics Destination
      </h3>
      <div class="space-y-4 font-mono text-xs text-content">
        <input
          type="text"
          bind:value={formData.fullName}
          required
          placeholder="FULL NAME"
          class="w-full rounded border border-outline bg-base p-3 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors"
        />
        <input
          type="email"
          bind:value={formData.email}
          required
          placeholder="EMAIL TRANSMISSION ADDRESS"        
          class="w-full rounded border border-outline bg-base p-3 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors"
        />
        <div class="grid grid-cols-2 gap-4">
          <select
            bind:value={formData.country}
            class="w-full rounded border border-outline bg-base p-3 uppercase focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors"
          >
            <option value="AE">United Arab Emirates</option>
            <option value="SA">Saudi Arabia</option>      
            <option value="US">United States</option>     
            <option value="GB">United Kingdom</option>    
          </select>
          <input
            type="text"
            bind:value={formData.city}
            required
            placeholder="CITY"
            class="w-full rounded border border-outline bg-base p-3 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors"
          />
        </div>
      </div>
    </div>

    <div>
      <h3 class="mb-4 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase">
        2. Financial Authorization Method
      </h3>
      <div class="space-y-3 font-mono text-xs">
        <label class="flex cursor-pointer items-center gap-3 rounded border border-outline bg-base p-4 transition-colors hover:border-brand has-[:checked]:border-brand has-[:checked]:bg-brand/5">
          <input
            type="radio"
            bind:group={formData.paymentMethod}
            value="bank_transfer"
            class="h-4 w-4 accent-brand"
          />
          <div class="flex flex-col">
            <span class="font-bold text-content uppercase">Direct Bank Transfer / Invoice</span>
            <span class="mt-1 text-[10px] text-content-muted">Secure your order now. We will email you an invoice with banking instructions.</span>
          </div>
        </label>

        <label class="flex cursor-pointer items-center gap-3 rounded border border-outline bg-base p-4 transition-colors hover:border-brand has-[:checked]:border-brand has-[:checked]:bg-brand/5">
          <input
            type="radio"
            bind:group={formData.paymentMethod}
            value="pre_order"
            class="h-4 w-4 accent-brand"
          />
          <div class="flex flex-col">
            <span class="font-bold text-content uppercase">Waitlist / Pre-Order</span>
            <span class="mt-1 text-[10px] text-content-muted">Reserve your allocation. Payment will be collected when infrastructure is live.</span>
          </div>
        </label>
      </div>
    </div>

    <Turnstile bind:token={turnstileToken} />

    <button
      type="submit"
      disabled={isProcessing || isLoading}
      class="w-full rounded bg-brand px-4 py-4 font-mono text-xs font-bold tracking-widest text-brand-dark uppercase shadow-[0_0_15px_var(--color-brand)] transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
    >
      {isProcessing ? 'Processing Transaction...' : 'Authorize Payload'}
    </button>
  </form>
</div>
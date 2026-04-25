<script lang="ts">
  import { onMount } from 'svelte';

  // Svelte 5 Runes for incoming props
  let { publicKey = '' } = $props<{ publicKey: string }>();

  let stripe: any = null;
  let elements: any = null;
  let isLoading = $state(true);
  let isProcessing = $state(false);
  let errorMessage = $state('');

  onMount(async () => {
    const { cart } = await import('../../../stores/cart.svelte');      

    if (cart.items.length === 0) {
      window.location.href = '/shop';
      return;
    }

    try {
      // 1. Fetch Client Secret from our Edge API
      const res = await fetch('/api/checkout/create-intent', {        
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart.items }),
      });

      const { clientSecret, error } = await res.json();
      if (error) throw new Error(error);

      // 2. Initialize Stripe
      // @ts-ignore - Stripe Elements external typing
      stripe = window.Stripe(publicKey);

      // Kept explicit hex values here because Stripe's external iframe is notoriously 
      // strict about dynamic CSS variable parsing during initial load.
      const appearance = {
        theme: 'night',
        variables: {
          fontFamily:
            'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          colorPrimary: 'var(--color-brand)',
          colorBackground: 'var(--color-base)',
          colorText: 'var(--color-content)',
          colorDanger: 'var(--color-brand-alert)',
          spacingUnit: '4px',
          borderRadius: '0px',
        },
      };

      elements = stripe.elements({ clientSecret, appearance });        

      // Mount Address Element
      const addressElement = elements.create('address', {
        mode: 'shipping',
        allowedCountries: ['AE', 'SA', 'US', 'GB'],
      });
      addressElement.mount('#address-element');

      // Mount Payment Element
      const paymentElement = elements.create('payment', {
        layout: 'accordion',
      });
      paymentElement.mount('#payment-element');

      isLoading = false;
    } catch (e: any) {
      errorMessage = e.message || 'Failed to initialize payment gateway.';
      isLoading = false;
    }
  });

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!stripe || !elements) return;

    isProcessing = true;
    errorMessage = '';

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,      
      },
    });

    if (error) {
      errorMessage = error.message;
      isProcessing = false;
    }
  }
</script>

<div
  class="relative min-h-[400px] border border-outline bg-surface p-6 sm:p-8 transition-colors duration-300"
>
  <h2
    class="mb-8 border-b border-outline pb-4 font-mono text-sm font-bold tracking-widest text-content uppercase"
  >
    Secure Payment Gateway
  </h2>

  {#if isLoading}
    <div
      class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-base/80 backdrop-blur-sm"
    >
      <div
        class="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-brand/20 border-t-brand"
      ></div>
      <p
        class="animate-pulse font-mono text-[10px] tracking-widest text-brand uppercase"
      >
        Establishing encrypted link...
      </p>
    </div>
  {/if}

  {#if errorMessage}
    <div
      class="mb-6 border border-brand-alert/30 bg-brand-alert/10 p-4 font-mono text-xs tracking-widest text-brand-alert uppercase"
    >
      {errorMessage}
    </div>
  {/if}

  <form
    onsubmit={handleSubmit}
    id="payment-form"
    class="space-y-8 {isLoading
      ? 'opacity-0'
      : 'opacity-100 transition-opacity duration-500'}"
  >
    <div>
      <h3
        class="mb-4 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
      >
        1. Logistics Destination
      </h3>
      <div id="address-element" class="min-h-[200px]"></div>
    </div>

    <div>
      <h3
        class="mb-4 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
      >
        2. Financial Authorization
      </h3>
      <div id="payment-element" class="min-h-[200px]"></div>
    </div>

    <button
      type="submit"
      disabled={isProcessing || isLoading}
      class="w-full bg-brand px-4 py-4 text-xs font-bold tracking-widest text-brand-dark uppercase shadow-[0_0_15px_var(--color-brand)] transition-colors hover:opacity-80 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
    >
      {isProcessing ? 'Processing Transaction...' : 'Authorize Payload'}
    </button>
  </form>
</div>
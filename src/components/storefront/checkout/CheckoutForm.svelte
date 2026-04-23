<script lang="ts">
  import { onMount } from 'svelte';

  // Make sure STRIPE_PUBLIC_KEY is provided in your astro build config
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
        body: JSON.stringify({ items: cart.items })
      });
      
      const { clientSecret, error } = await res.json();
      if (error) throw new Error(error);

      // 2. Initialize Stripe
      // @ts-ignore
      stripe = window.Stripe(publicKey);
      
      const appearance = {
        theme: 'night',
        variables: {
          fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          colorPrimary: '#36f4a4',
          colorBackground: '#1A1D23',
          colorText: '#ffffff',
          colorDanger: '#fb7185',
          spacingUnit: '4px',
          borderRadius: '0px'
        }
      };

      elements = stripe.elements({ clientSecret, appearance });

      // Mount Address Element
      const addressElement = elements.create('address', {
        mode: 'shipping',
        allowedCountries: ['AE', 'SA', 'US', 'GB'],
      });
      addressElement.mount('#address-element');

      // Mount Payment Element
      const paymentElement = elements.create('payment', { layout: 'accordion' });
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

<div class="bg-[#111318] border border-white/10 p-6 sm:p-8 relative min-h-[400px]">
  <h2 class="text-sm font-bold text-white uppercase tracking-widest font-mono border-b border-white/10 pb-4 mb-8">Secure Payment Gateway</h2>

  {#if isLoading}
    <div class="absolute inset-0 flex flex-col items-center justify-center bg-[#111318]/80 backdrop-blur-sm z-10">
      <div class="w-8 h-8 border-2 border-[#36f4a4]/20 border-t-[#36f4a4] rounded-full animate-spin mb-4"></div>
      <p class="text-[10px] text-[#36f4a4] font-mono uppercase tracking-widest animate-pulse">Establishing encrypted link...</p>
    </div>
  {/if}

  {#if errorMessage}
    <div class="mb-6 bg-rose-500/10 border border-rose-500/30 p-4 text-rose-400 text-xs font-mono uppercase tracking-widest">
      {errorMessage}
    </div>
  {/if}

  <form onsubmit={handleSubmit} id="payment-form" class="space-y-8 {isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}">
    
    <div>
      <h3 class="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-4">1. Logistics Destination</h3>
      <div id="address-element" class="min-h-[200px]"></div>
    </div>

    <div>
      <h3 class="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-4">2. Financial Authorization</h3>
      <div id="payment-element" class="min-h-[200px]"></div>
    </div>

    <button 
      type="submit" 
      disabled={isProcessing || isLoading}
      class="w-full bg-[#36f4a4] text-[#003822] px-4 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(54,244,164,0.15)]"
    >
      {isProcessing ? 'Processing Transaction...' : 'Authorize Payload'}
    </button>
  </form>
</div>
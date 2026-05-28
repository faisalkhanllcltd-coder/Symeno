<script lang="ts">
  import Turnstile from '../../security/Turnstile.svelte';

  let email = $state('');
  // THE FIX: Explicit state container for the token
  let turnstileToken = $state('');
  let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
  let message = $state('');

  async function executeSubscription(e: Event) {
    e.preventDefault();
    if (!email) return;

    // Direct memory validation instead of fragile DOM extraction
    if (!turnstileToken) {
      status = 'error';
      message = 'Security token missing. Are you a bot?';
      return;
    }

    status = 'loading';
    message = '';

    try {
      const res = await fetch('/api/marketing/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          source: 'footer_module',
          'cf-turnstile-response': turnstileToken 
        }),
      });

      if (res.ok) {
        status = 'success';
        message = 'Signal acquired. You are on the grid.';
        email = '';
        if ((window as any).turnstile) (window as any).turnstile.reset();
      } else {
        const err = await res.json();
        status = 'error';
        message = err.error || 'Transmission rejected.';
        if ((window as any).turnstile) (window as any).turnstile.reset();
      }
    } catch {
      status = 'error';
      message = 'Network anomaly detected.';
      if ((window as any).turnstile) (window as any).turnstile.reset();
    }
  }
</script>

<div class="w-full max-w-md">
  <h3 class="mb-2 font-mono text-xs font-bold tracking-widest text-content uppercase">
    Secure Comm Channel
  </h3>
  <p class="mb-4 font-mono text-[10px] text-content-muted">
    Get early access to new arrivals, exclusive deals, and restocks before they sell out.
  </p>

  <form onsubmit={executeSubscription} data-secured="true" class="flex flex-col gap-3">
    
    <div class="relative flex w-full">
      <input
        type="email"
        bind:value={email}
        disabled={status === 'loading' || status === 'success'}
        placeholder="operator@domain.com"
        required
        class="w-full border border-outline bg-base px-4 py-3 font-mono text-sm text-content transition-colors focus:border-brand/50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      />
      <button
        type="submit"
        disabled={status === 'loading' || status === 'success'}
        class="absolute top-1 right-1 bottom-1 border border-transparent bg-surface px-6 text-[10px] font-bold tracking-widest text-brand uppercase transition-colors hover:border-brand/30 hover:bg-brand/20 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      >
        {#if status === 'loading'}
          SYNC...
        {:else}
          Subscribe
        {/if}
      </button>
    </div>

    <Turnstile bind:token={turnstileToken} />

  </form>

  {#if message}
    <p
      class="animate-fade-in mt-3 font-mono text-[10px] tracking-widest uppercase {status === 'success' ? 'text-brand' : 'text-brand-alert'}"
    >
      > {message}
    </p>
  {/if}
</div>
<script lang="ts">
  let email = $state('');
  let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
  let message = $state('');

  async function executeSubscription(e: Event) {
    e.preventDefault();
    if (!email) return;

    status = 'loading';
    message = '';

    try {
      const res = await fetch('/api/marketing/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer_module' }),
      });

      if (res.ok) {
        status = 'success';
        message = 'Signal acquired. You are on the grid.';
        email = '';
      } else {
        const err = await res.json();
        status = 'error';
        message = err.error || 'Transmission rejected.';
      }
    } catch {
      status = 'error';
      message = 'Network anomaly detected.';
    }
  }
</script>

<div class="w-full max-w-md">
  <h3
    class="mb-2 font-mono text-xs font-bold tracking-widest text-white uppercase"
  >
    Secure Comm Channel
  </h3>
  <p class="mb-4 font-mono text-[10px] text-white/50">
    Intercept logistics updates, wholesale price drops, and operational
    intelligence.
  </p>

  <form onsubmit={executeSubscription} class="relative flex">
    <input
      type="email"
      bind:value={email}
      disabled={status === 'loading' || status === 'success'}
      placeholder="operator@domain.com"
      required
      class="w-full border border-white/10 bg-[#111318] px-4 py-3 font-mono text-sm text-white transition-colors focus:border-[#36f4a4]/50 focus:outline-none disabled:opacity-50"
    />
    <button
      type="submit"
      disabled={status === 'loading' || status === 'success'}
      class="absolute top-1 right-1 bottom-1 border border-transparent bg-white/5 px-6 text-[10px] font-bold tracking-widest text-[#36f4a4] uppercase transition-colors hover:border-[#36f4a4]/30 hover:bg-[#36f4a4]/20 disabled:opacity-50"
    >
      {#if status === 'loading'}
        SYNC...
      {:else}
        Subscribe
      {/if}
    </button>
  </form>

  {#if message}
    <p
      class="animate-fade-in mt-3 font-mono text-[10px] tracking-widest uppercase {status ===
      'success'
        ? 'text-[#36f4a4]'
        : 'text-rose-400'}"
    >
      > {message}
    </p>
  {/if}
</div>

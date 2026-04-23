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
        body: JSON.stringify({ email, source: 'footer_module' })
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
  <h3 class="text-xs font-bold text-white uppercase tracking-widest font-mono mb-2">Secure Comm Channel</h3>
  <p class="text-[10px] text-white/50 font-mono mb-4">Intercept logistics updates, wholesale price drops, and operational intelligence.</p>
  
  <form onsubmit={executeSubscription} class="relative flex">
    <input 
      type="email" 
      bind:value={email} 
      disabled={status === 'loading' || status === 'success'}
      placeholder="operator@domain.com" 
      required
      class="w-full bg-[#111318] border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono transition-colors disabled:opacity-50" 
    />
    <button 
      type="submit" 
      disabled={status === 'loading' || status === 'success'}
      class="absolute right-1 top-1 bottom-1 bg-white/5 hover:bg-[#36f4a4]/20 text-[#36f4a4] px-6 text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50 border border-transparent hover:border-[#36f4a4]/30"
    >
      {#if status === 'loading'}
        SYNC...
      {:else}
        Subscribe
      {/if}
    </button>
  </form>

  {#if message}
    <p class="mt-3 text-[10px] font-mono uppercase tracking-widest animate-fade-in {status === 'success' ? 'text-[#36f4a4]' : 'text-rose-400'}">
      > {message}
    </p>
  {/if}
</div>
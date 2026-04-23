<script lang="ts">
  let { productId, onSuccess } = $props<{ productId: string, onSuccess: () => void }>();
  
  let rating = $state(5);
  let title = $state('');
  let comment = $state('');
  let isSubmitting = $state(false);
  let errorMsg = $state('');

  async function submit(e: Event) {
    e.preventDefault();
    isSubmitting = true;
    errorMsg = '';
    
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, rating, title, comment })
      });
      
      if (res.ok) {
        onSuccess();
      } else if (res.status === 401) {
        window.location.href = '/auth/login?redirect=' + window.location.pathname;
      } else {
        const err = await res.json();
        errorMsg = err.error;
      }
    } finally {
      isSubmitting = false;
    }
  }
</script>

<form onsubmit={submit} class="bg-[#111318] border border-white/10 p-6 space-y-4">
  <h3 class="text-xs font-bold uppercase tracking-widest text-white font-mono border-b border-white/10 pb-4">Submit Evaluation</h3>
  
  {#if errorMsg}
    <div class="text-[10px] text-rose-400 font-mono uppercase p-2 bg-rose-500/10 border border-rose-500/30">{errorMsg}</div>
  {/if}

  <div>
    <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Rating</label>
    <div class="flex gap-2">
      {#each [1,2,3,4,5] as star}
        <button type="button" onclick={() => rating = star} class="text-2xl focus:outline-none transition-colors {star <= rating ? 'text-amber-400' : 'text-white/20'}">★</button>
      {/each}
    </div>
  </div>

  <div>
    <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Summary Title</label>
    <input type="text" bind:value={title} required class="w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
  </div>

  <div>
    <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Detailed Feedback</label>
    <textarea bind:value={comment} required rows="4" class="w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono"></textarea>
  </div>

  <button type="submit" disabled={isSubmitting} class="w-full bg-[#36f4a4] text-[#003822] px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 mt-4">
    {isSubmitting ? 'Transmitting...' : 'Submit to Moderation'}
  </button>
</form>
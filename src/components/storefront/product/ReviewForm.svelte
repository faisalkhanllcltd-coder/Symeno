<script lang="ts">
  let { productId, onSuccess } = $props<{
    productId: string;
    onSuccess: () => void;
  }>();

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
        body: JSON.stringify({ 
          product_id: productId, 
          rating, 
          title, 
          comment
        }),
      });

      if (res.ok) {
        onSuccess();
      } else if (res.status === 401) {
        window.location.href =
          '/auth/login?redirect=' + window.location.pathname;
      } else {
        const err = await res.json();
        errorMsg = err.error;
      }
    } finally {
      isSubmitting = false;
    }
  }
</script>

<form
  onsubmit={submit}
  class="space-y-4 border border-outline bg-surface p-6 transition-colors duration-300"
>
  <h3
    class="border-b border-outline pb-4 font-mono text-xs font-bold tracking-widest text-content uppercase"      
  >
    Submit Evaluation
  </h3>

  {#if errorMsg}
    <div
      class="border border-brand-alert/30 bg-brand-alert/10 p-2 font-mono text-[10px] text-brand-alert uppercase"        
    >
      {errorMsg}
    </div>
  {/if}

  <div>
    <label
      class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
      >Rating</label
    >
    <div class="flex gap-2">
      {#each [1, 2, 3, 4, 5] as star}
        <button
          type="button"
          onclick={() => (rating = star)}
          class="text-2xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm px-1 {star <= rating
            ? 'text-amber-400'
            : 'text-outline hover:text-content-muted'}">★</button
        >
      {/each}
    </div>
  </div>

  <div>
    <label
      class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
      >Summary Title</label
    >
    <input
      type="text"
      bind:value={title}
      required
      class="w-full border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand focus:outline-none transition-colors"
    />
  </div>

  <div>
    <label
      class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
      >Detailed Feedback</label
    >
    <textarea
      bind:value={comment}
      required
      rows="4"
      class="w-full border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand focus:outline-none transition-colors"
    ></textarea>
  </div>

  <button
    type="submit"
    disabled={isSubmitting}
    class="mt-4 w-full bg-brand px-4 py-3 text-xs font-bold tracking-widest text-brand-dark uppercase transition-colors hover:opacity-80 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
  >
    {isSubmitting ? 'Transmitting...' : 'Submit to Moderation'}
  </button>
</form>

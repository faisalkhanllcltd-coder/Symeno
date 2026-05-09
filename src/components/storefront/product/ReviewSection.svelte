<script lang="ts">
  import ReviewForm from './ReviewForm.svelte';

  let { productId, initialReviews = [] } = $props<{     
    productId: string;
    initialReviews?: any[];
  }>();
  
  let reviews = $derived(initialReviews);
  let showForm = $state(false);
  let submitted = $state(false);

  const renderStars = (rating: number) =>
    '★'.repeat(rating) + '☆'.repeat(5 - rating);        
</script>

<div class="mx-auto max-w-4xl py-16 transition-colors duration-300">
  <div
    class="mb-8 flex items-end justify-between border-b border-outline pb-4"
  >
    <div>
      <h2
        class="font-mono text-xl font-bold tracking-widest text-content uppercase"
      >
        Field Reports
      </h2>
      <p class="mt-1 font-mono text-[10px] text-content-muted">
        {reviews.length} Verified Reviews
      </p>
    </div>
    {#if !showForm && !submitted}
      <button
        onclick={() => (showForm = true)}
        class="border border-brand/30 px-6 py-2 font-mono text-[10px] tracking-widest text-brand uppercase transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >Write Review</button
      >
    {/if}
  </div>

  {#if showForm}
    <div class="animate-fade-in mb-12">
      <ReviewForm
        {productId}
        onSuccess={() => {
          showForm = false;
          submitted = true;
        }}
      />
    </div>
  {/if}

  {#if submitted}
    <div
      class="animate-fade-in mb-12 border border-brand/30 bg-brand/10 p-4 text-center"
    >
      <p class="font-mono text-[10px] tracking-widest text-brand uppercase">
        Report submitted. Awaiting Operations Center approval.
      </p>
    </div>
  {/if}

  <div class="space-y-6">
    {#each reviews as review}
      <div class="border border-outline bg-surface p-6 shadow-sm">
        <div class="mb-4 flex items-start justify-between">
          <div>
            <div class="mb-1 flex items-center gap-3">  
              <span class="text-sm tracking-widest text-amber-400"
                >{renderStars(review.rating)}</span     
              >
              {#if review.is_verified_buyer}
                <span
                  class="flex items-center gap-1 border border-brand/30 bg-brand/10 px-2 py-0.5 text-[9px] tracking-widest text-brand uppercase"
                >
                  <svg
                    class="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    ><path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    /></svg
                  >
                  Verified Payload
                </span>
              {/if}
            </div>
            <h4 class="mt-2 text-sm font-bold text-content">{review.title}</h4>
          </div>
          <span class="font-mono text-[10px] text-content-muted"
            >{new Date(review.created_at).toLocaleDateString()}</span
          >
        </div>
        <p class="font-mono text-xs leading-relaxed text-content-muted">
          {review.comment}
        </p>
        <div class="mt-4 flex items-center gap-2 border-t border-outline pt-4">
          <div
            class="flex h-6 w-6 items-center justify-center rounded-full bg-base border border-outline text-[10px] font-bold text-content-muted uppercase"
          >
            {review.first_name?.charAt(0) || 'U'}       
          </div>
          <span class="font-mono text-[10px] text-content-muted"
            >{review.first_name || 'Anonymous Operator'}
            {review.last_name?.charAt(0) || ''}.</span  
          >
        </div>
      </div>
    {:else}
      <div class="text-center py-12">
        <p
          class="text-[10px] font-mono text-content-muted uppercase tracking-widest"
        >
          No field reports available for this asset.    
        </p>
      </div>
    {/each}
  </div>
</div>

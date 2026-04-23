<script lang="ts">
  import ReviewForm from './ReviewForm.svelte';
  
  let { productId, initialReviews = [] } = $props<{ productId: string, initialReviews: any[] }>();
  let reviews = $state(initialReviews);
  let showForm = $state(false);
  let submitted = $state(false);

  const renderStars = (rating: number) => '★'.repeat(rating) + '☆'.repeat(5 - rating);
</script>

<div class="max-w-4xl mx-auto py-16">
  <div class="flex justify-between items-end border-b border-white/10 pb-4 mb-8">
    <div>
      <h2 class="text-xl font-bold uppercase tracking-widest text-white font-mono">Field Reports</h2>
      <p class="text-[10px] text-white/50 font-mono mt-1">{reviews.length} Verified Reviews</p>
    </div>
    {#if !showForm && !submitted}
      <button onclick={() => showForm = true} class="border border-[#36f4a4]/30 text-[#36f4a4] hover:bg-[#36f4a4]/10 px-6 py-2 text-[10px] font-mono uppercase tracking-widest transition-colors">Write Review</button>
    {/if}
  </div>

  {#if showForm}
    <div class="mb-12 animate-fade-in">
      <ReviewForm {productId} onSuccess={() => { showForm = false; submitted = true; }} />
    </div>
  {/if}

  {#if submitted}
    <div class="mb-12 bg-[#36f4a4]/10 border border-[#36f4a4]/30 p-4 text-center animate-fade-in">
      <p class="text-[10px] font-mono text-[#36f4a4] uppercase tracking-widest">Report submitted. Awaiting Operations Center approval.</p>
    </div>
  {/if}

  <div class="space-y-6">
    {#each reviews as review}
      <div class="bg-white/[0.02] border border-white/5 p-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <div class="flex items-center gap-3 mb-1">
              <span class="text-amber-400 text-sm tracking-widest">{renderStars(review.rating)}</span>
              {#if review.is_verified_buyer}
                <span class="text-[9px] px-2 py-0.5 border border-[#36f4a4]/30 text-[#36f4a4] bg-[#36f4a4]/10 uppercase tracking-widest flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Verified Payload
                </span>
              {/if}
            </div>
            <h4 class="text-sm font-bold text-white mt-2">{review.title}</h4>
          </div>
          <span class="text-[10px] font-mono text-white/40">{new Date(review.created_at).toLocaleDateString()}</span>
        </div>
        <p class="text-xs text-white/70 font-mono leading-relaxed">{review.comment}</p>
        <div class="mt-4 pt-4 border-t border-white/5 flex gap-2 items-center">
          <div class="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white/50 font-bold uppercase">{review.first_name?.charAt(0) || 'U'}</div>
          <span class="text-[10px] font-mono text-white/50">{review.first_name || 'Anonymous Operator'} {review.last_name?.charAt(0) || ''}.</span>
        </div>
      </div>
    {:else}
      <div class="text-center py-12">
        <p class="text-[10px] font-mono text-white/30 uppercase tracking-widest">No field reports available for this asset.</p>
      </div>
    {/each}
  </div>
</div>
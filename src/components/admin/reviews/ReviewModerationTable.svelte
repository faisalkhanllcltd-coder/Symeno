<script lang="ts">
  let { reviews = [] } = $props<{ reviews: any[] }>();
  let isProcessing = $state(false);

  async function updateStatus(id: string, status: 'APPROVED' | 'REJECTED') {
    isProcessing = true;
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        const index = reviews.findIndex(r => r.id === id);
        if (index !== -1) reviews[index].status = status;
      }
    } finally {
      isProcessing = false;
    }
  }

  const renderStars = (rating: number) => '★'.repeat(rating) + '☆'.repeat(5 - rating);
</script>

<div class="bg-[#111318] border border-white/10 overflow-x-auto">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-[#0a0b0e] border-b border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/40">
        <th class="p-4 font-normal">Rating / Product</th>
        <th class="p-4 font-normal">Customer Review</th>
        <th class="p-4 font-normal text-center">Status</th>
        <th class="p-4 font-normal text-right">Moderation</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/[0.04]">
      {#each reviews as review}
        <tr class="hover:bg-white/[0.02] transition-colors">
          <td class="p-4">
            <div class="text-amber-400 text-sm tracking-widest">{renderStars(review.rating)}</div>
            <div class="text-[10px] font-mono text-white/50 mt-1">{review.product_title}</div>
          </td>
          <td class="p-4 max-w-md">
            <div class="text-xs font-bold text-white mb-1">{review.title || 'No Title'}</div>
            <div class="text-[10px] font-mono text-white/70 line-clamp-2">{review.comment}</div>
            <div class="text-[9px] font-mono text-white/30 mt-1">{review.customer_email || 'Guest'}</div>
          </td>
          <td class="p-4 text-center">
            {#if review.status === 'APPROVED'}
              <span class="text-[9px] px-2 py-1 uppercase tracking-widest border border-[#36f4a4]/30 text-[#36f4a4] bg-[#36f4a4]/10">Approved</span>
            {:else if review.status === 'REJECTED'}
              <span class="text-[9px] px-2 py-1 uppercase tracking-widest border border-rose-500/30 text-rose-400 bg-rose-500/10">Rejected</span>
            {:else}
              <span class="text-[9px] px-2 py-1 uppercase tracking-widest border border-amber-500/30 text-amber-400 bg-amber-500/10">Pending</span>
            {/if}
          </td>
          <td class="p-4 text-right">
            {#if review.status === 'PENDING'}
              <div class="flex justify-end gap-2">
                <button onclick={() => updateStatus(review.id, 'APPROVED')} disabled={isProcessing} class="text-[10px] font-mono uppercase tracking-widest border border-[#36f4a4]/30 px-2 py-1 text-[#36f4a4] hover:bg-[#36f4a4]/10 transition-colors">Approve</button>
                <button onclick={() => updateStatus(review.id, 'REJECTED')} disabled={isProcessing} class="text-[10px] font-mono uppercase tracking-widest border border-rose-500/30 px-2 py-1 text-rose-400 hover:bg-rose-500/10 transition-colors">Reject</button>
              </div>
            {:else}
              <span class="text-[9px] font-mono text-white/30 uppercase">Moderated</span>
            {/if}
          </td>
        </tr>
      {:else}
        <tr><td colspan="4" class="p-8 text-center text-xs font-mono text-white/30 uppercase">No reviews in queue.</td></tr>
      {/each}
    </tbody>
  </table>
</div>
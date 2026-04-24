<script lang="ts">
  let { reviews = [] } = $props<{ reviews: any[] }>();
  let isProcessing = $state(false);

  async function updateStatus(id: string, status: 'APPROVED' | 'REJECTED') {
    isProcessing = true;
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        const index = reviews.findIndex((r) => r.id === id);
        if (index !== -1) reviews[index].status = status;
      }
    } finally {
      isProcessing = false;
    }
  }

  const renderStars = (rating: number) =>
    '★'.repeat(rating) + '☆'.repeat(5 - rating);
</script>

<div class="overflow-x-auto border border-white/10 bg-[#111318]">
  <table class="w-full border-collapse text-left">
    <thead>
      <tr
        class="border-b border-white/10 bg-[#0a0b0e] font-mono text-[10px] tracking-widest text-white/40 uppercase"
      >
        <th class="p-4 font-normal">Rating / Product</th>
        <th class="p-4 font-normal">Customer Review</th>
        <th class="p-4 text-center font-normal">Status</th>
        <th class="p-4 text-right font-normal">Moderation</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/[0.04]">
      {#each reviews as review}
        <tr class="transition-colors hover:bg-white/[0.02]">
          <td class="p-4">
            <div class="text-sm tracking-widest text-amber-400">
              {renderStars(review.rating)}
            </div>
            <div class="mt-1 font-mono text-[10px] text-white/50">
              {review.product_title}
            </div>
          </td>
          <td class="max-w-md p-4">
            <div class="mb-1 text-xs font-bold text-white">
              {review.title || 'No Title'}
            </div>
            <div class="line-clamp-2 font-mono text-[10px] text-white/70">
              {review.comment}
            </div>
            <div class="mt-1 font-mono text-[9px] text-white/30">
              {review.customer_email || 'Guest'}
            </div>
          </td>
          <td class="p-4 text-center">
            {#if review.status === 'APPROVED'}
              <span
                class="border border-[#36f4a4]/30 bg-[#36f4a4]/10 px-2 py-1 text-[9px] tracking-widest text-[#36f4a4] uppercase"
                >Approved</span
              >
            {:else if review.status === 'REJECTED'}
              <span
                class="border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[9px] tracking-widest text-rose-400 uppercase"
                >Rejected</span
              >
            {:else}
              <span
                class="border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[9px] tracking-widest text-amber-400 uppercase"
                >Pending</span
              >
            {/if}
          </td>
          <td class="p-4 text-right">
            {#if review.status === 'PENDING'}
              <div class="flex justify-end gap-2">
                <button
                  onclick={() => updateStatus(review.id, 'APPROVED')}
                  disabled={isProcessing}
                  class="border border-[#36f4a4]/30 px-2 py-1 font-mono text-[10px] tracking-widest text-[#36f4a4] uppercase transition-colors hover:bg-[#36f4a4]/10"
                  >Approve</button
                >
                <button
                  onclick={() => updateStatus(review.id, 'REJECTED')}
                  disabled={isProcessing}
                  class="border border-rose-500/30 px-2 py-1 font-mono text-[10px] tracking-widest text-rose-400 uppercase transition-colors hover:bg-rose-500/10"
                  >Reject</button
                >
              </div>
            {:else}
              <span class="font-mono text-[9px] text-white/30 uppercase"
                >Moderated</span
              >
            {/if}
          </td>
        </tr>
      {:else}
        <tr
          ><td
            colspan="4"
            class="p-8 text-center text-xs font-mono text-white/30 uppercase"
            >No reviews in queue.</td
          ></tr
        >
      {/each}
    </tbody>
  </table>
</div>

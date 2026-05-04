<script lang="ts">
  // 1. Do not destructure. Keep the props object intact for reactivity.
  let props = $props<{
    productId: string;
    initialState?: boolean;
  }>();

  // 2. Initialize local state using the prop fallback
  let isSaved = $state(props.initialState ?? false);
  let isProcessing = $state(false);

  // 3. Keep edge-synced if the parent explicitly updates the prop later
  $effect(() => {
    if (props.initialState !== undefined) {
      isSaved = props.initialState;
    }
  });

  async function toggleWishlist(e: Event) {
    e.preventDefault();
    e.stopPropagation(); // Prevent triggering product card link

    if (isProcessing) return;

    // Optimistic UI Update
    isSaved = !isSaved;
    isProcessing = true;

    try {
      const res = await fetch('/api/account/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: props.productId,
          action: isSaved ? 'add' : 'remove',
        }),
      });

      if (!res.ok) {
        // Revert on failure
        isSaved = !isSaved;
        if (res.status === 401) window.location.href = '/auth/login';
      }
    } catch {
      isSaved = !isSaved; // Revert on network error
    } finally {
      isProcessing = false;
    }
  }
</script>

<button
  onclick={toggleWishlist}
  class="absolute top-3 right-3 rounded-full border p-2 backdrop-blur-md transition-all {isSaved
    ? 'border-brand/50 bg-brand/20'
    : 'border-outline bg-base/50 hover:border-content-muted'} group z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
  aria-label="Toggle Wishlist"
>
  <svg
    class="h-4 w-4 transition-colors {isSaved
      ? 'fill-brand text-brand'
      : 'fill-transparent text-content-muted group-hover:text-content'}"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="2"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
</button>
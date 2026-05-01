// src/stores/wishlist.svelte.ts
const STORAGE_KEY = 'symeno_wishlist_cache';

function createWishlistStore() {
  // FIX 1: Bypass TS complaining about the Svelte 5 global macro, but explicitly type the array
  // @ts-ignore - Svelte 5 rune macro
  let items: string[] = $state([]);
  let initialized = false;
  let isAuthenticated = false;

  async function init(isLoggedIn: boolean) {
    if (typeof window === 'undefined' || initialized) return;
    isAuthenticated = isLoggedIn;
    initialized = true;

    if (isAuthenticated) {
      try {
        const res = await fetch('/api/account/wishlist');
        if (res.ok) {
          // Force TS to accept the parsed JSON as 'any' to access '.items'
          const data = (await res.json()) as any;
          items = data.items || [];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
          return;
        }
      } catch (err) {
        console.error('[WISHLIST_SYNC_FAIL]', err);
      }
    }

    // Fallback: Load from localStorage for guests or if API fails
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) items = JSON.parse(stored);
    } catch (e) { }
  }

  async function toggle(productId: string) {
    // 1. Snapshot previous state for rollback
    const originalState = [...items];

    // 2. Optimistic UI Update (Instant)
    const isAdding = !items.includes(productId);
    if (isAdding) {
      items = [...items, productId];
    } else {
      // FIX 2: Explicitly type 'id' as string to satisfy strict TS
      items = items.filter((id: string) => id !== productId);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    // 3. Background Network Sync (If logged in)
    if (isAuthenticated) {
      try {
        const res = await fetch('/api/account/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, action: isAdding ? 'add' : 'remove' }),
        });

        if (!res.ok) throw new Error('API Sync Failed');
      } catch (err) {
        // 4. Rollback on failure to prevent data drift
        console.warn('[WISHLIST_ROLLBACK] Reverting optimistic update.');
        items = originalState;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      }
    }
  }

  return {
    get items() {
      return items;
    },
    init,
    toggle,
  };
}

export const wishlist = createWishlistStore();
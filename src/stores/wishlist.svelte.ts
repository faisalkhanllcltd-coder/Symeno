const STORAGE_KEY = 'symeno_wishlist_cache';

export function createWishlistStore() {
  let items = $state<string[]>([]);
  let initialized = false;

  function load() {
    if (typeof window === 'undefined' || initialized) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) items = JSON.parse(stored);
    } catch (e) {}
    initialized = true;
  }

  return {
    get items() {
      load();
      return items;
    },
    toggle: (productId: string) => {
      load();
      if (items.includes(productId)) {
        items = items.filter((id) => id !== productId);
      } else {
        items = [...items, productId];
      }
      if (typeof window !== 'undefined')
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    },
    has: (productId: string) => {
      load();
      return items.includes(productId);
    },
  };
}
export const wishlist = createWishlistStore();

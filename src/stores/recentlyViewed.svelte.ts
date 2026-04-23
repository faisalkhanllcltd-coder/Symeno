// src/stores/recentlyViewed.svelte.ts
const STORAGE_KEY = 'symeno_recent_items';
const MAX_ITEMS = 10;

export interface RecentItem {
  id: string;
  slug: string;
  title: string;
  price: number;
  image_url: string;
}

export function createRecentStore() {
  // Use state to trigger UI updates, initialize empty for SSR safety
  let items = $state<RecentItem[]>([]);
  let initialized = false;

  function load() {
    if (typeof window === 'undefined' || initialized) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) items = JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load recent items');
    }
    initialized = true;
  }

  function add(item: RecentItem) {
    if (typeof window === 'undefined') return;
    load();
    // Remove if exists to push to front
    const filtered = items.filter(i => i.id !== item.id);
    filtered.unshift(item);
    if (filtered.length > MAX_ITEMS) filtered.pop();
    
    items = filtered;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  return {
    get items() { 
      load(); 
      return items; 
    },
    add
  };
}

export const recentStore = createRecentStore();
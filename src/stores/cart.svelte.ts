import { logger } from '../lib/logger';

export interface CartItem {
  id: string; // Composite key: productId + variantId
  productId: string;
  variantId?: string;
  quantity: number;
}

function createCartStore() {
  // 1. Initialize Svelte 5 Reactive State
  let items = $state<CartItem[]>([]);
  let isOpen = $state(false);

  // 2. Hydrate from LocalStorage (Client-side primary fallback)
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('symeno_cart');
    if (stored) {
      try {
        items = JSON.parse(stored);
      } catch (e) {
        logger.error('Cart payload corrupted. Purging local state.');
        localStorage.removeItem('symeno_cart');
      }
    }
  }

  // Private sync function: Updates Local Storage AND fires background Edge sync
  let syncTimeout: ReturnType<typeof setTimeout>;
  function sync() {
    if (typeof window !== 'undefined') {
      // Immediate local hydration
      localStorage.setItem('symeno_cart', JSON.stringify(items));

      // INFRASTRUCTURE UPGRADE: Debounced Edge KV Hydration (Non-blocking)
      clearTimeout(syncTimeout);
      syncTimeout = setTimeout(() => {
        // Pings the API endpoint to store cart in Cloudflare KV via sessionId
        fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items })
        }).catch(err => logger.warn('[EDGE_SYNC_WARNING] Cart failed to sync with KV. Local fallback active.', err));
      }, 1000);
    }
  }

  return {
    // 3. Expose Reactive Getters
    get items() { return items; },
    get isOpen() { return isOpen; },

    get totalItems() {
      return items.reduce((total, item) => total + item.quantity, 0);
    },

    // 4. Expose Controlled Mutators
    toggleCart() {
      isOpen = !isOpen;
    },

    openCart() {
      isOpen = true;
    },

    closeCart() {
      isOpen = false;
    },

    addItem(productId: string, variantId?: string, quantity: number = 1) {
      const id = variantId ? `${productId}_${variantId}` : productId;
      const existingItem = items.find(i => i.id === id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        items.push({ id, productId, variantId, quantity });
      }

      sync();
    },

    updateQuantity(id: string, quantity: number) {
      const item = items.find(i => i.id === id);
      if (item) {
        item.quantity = Math.max(1, quantity);
        sync();
      }
    },

    removeItem(id: string) {
      items = items.filter(i => i.id !== id);
      sync();
    },

    clearCart() {
      items = [];
      sync();
    }
  };
}

// Export globally reactive singleton
export const cart = createCartStore();
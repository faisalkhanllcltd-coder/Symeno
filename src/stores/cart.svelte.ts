import { logger } from '../lib/logger';

export interface CartItem {
  id: string; // Composite key: productId + variantId
  productId: string;
  variantId?: string;
  qty: number;
  brand: string;
  name: string;
  price: number;
  was: number;
  stock: number;
  image: string;
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
          body: JSON.stringify({ items }),
        }).catch((err) =>
          logger.warn(
            '[EDGE_SYNC_WARNING] Cart failed to sync with KV. Local fallback active.',
            err
          )
        );
      }, 1000);
    }
  }

  return {
    // 3. Expose Reactive Getters
    get items() {
      return items;
    },
    get isOpen() {
      return isOpen;
    },

    get totalItems() {
      return items.reduce((total, item) => total + item.qty, 0);
    },

    get subtotal() {
      return items.reduce((total, item) => total + item.price * item.qty, 0);
    },

    get savings() {
      return items.reduce((total, item) => total + (item.was - item.price) * item.qty, 0);
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

    addItem(
      product: { id: string; productId: string; brand: string; name: string; price: number; was: number; stock: number; image: string },
      quantity: number = 1
    ) {
      const existingItem = items.find((i) => i.id === product.id);

      if (existingItem) {
        existingItem.qty += quantity;
      } else {
        items.push({
          id: product.id,
          productId: product.productId,
          qty: quantity,
          brand: product.brand,
          name: product.name,
          price: product.price,
          was: product.was,
          stock: product.stock,
          image: product.image,
        });
      }

      sync();
    },

    updateQuantity(id: string, qty: number) {
      const item = items.find((i) => i.id === id);
      if (item) {
        item.qty = Math.max(1, qty);
        sync();
      }
    },

    removeItem(id: string) {
      items = items.filter((i) => i.id !== id);
      sync();
    },

    clearCart() {
      items = [];
      sync();
    },
  };
}

// Export globally reactive singleton
export const cart = createCartStore();

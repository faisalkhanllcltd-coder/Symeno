export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  variantId?: string;
}

function createCartStore() {
  let items = $state<CartItem[]>([]);
  let isOpen = $state(false);
  let isInitialized = false;

  if (typeof window !== 'undefined') {
    queueMicrotask(() => {
      const stored = localStorage.getItem('symeno_cart');
      if (stored) {
        try {
          items = JSON.parse(stored);
        } catch (e) {
          console.error('[CART_STORE] Payload corrupted. Purging state.');
          localStorage.removeItem('symeno_cart');
        }
      }
      isInitialized = true;
    });
  }

  let syncTimeout: ReturnType<typeof setTimeout>;

  function sync() {
    if (typeof window !== 'undefined' && isInitialized) {
      localStorage.setItem('symeno_cart', JSON.stringify(items));

      clearTimeout(syncTimeout);
      syncTimeout = setTimeout(() => {
        fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
        }).catch(() => console.warn('[EDGE_SYNC_WARNING] Cart sync failed. Local fallback active.'));
      }, 1000);
    }
  }

  return {
    get items() { return items; },
    get isOpen() { return isOpen; },

    get totalItems() { return items.reduce((total: number, item: CartItem) => total + item.qty, 0); },
    get subtotal() { return items.reduce((total: number, item: CartItem) => total + item.price * item.qty, 0); },

    toggleCart() { isOpen = !isOpen; },
    openCart() { isOpen = true; },
    closeCart() { isOpen = false; },

    addItem(product: any, quantity: number = 1) {
      const id = product.id || product.slug;

      const existingItem = items.find((i: CartItem) => i.id === id);

      if (existingItem) {
        existingItem.qty += quantity;
      } else {
        items.push({
          id: id,
          slug: product.slug || id,
          name: product.name || 'Unknown Item',
          price: product.price || 0,
          image: product.image || product.image_url || ((product.images && product.images.length > 0) ? product.images[0] : '/images/system/fallback.webp'),
          qty: quantity,
        });
      }

      sync();
      isOpen = true;
    },

    updateQuantity(id: string, qty: number) {
      const item = items.find((i: CartItem) => i.id === id);
      if (item) {
        item.qty = Math.max(1, qty);
        sync();
      }
    },

    removeItem(id: string) {
      items = items.filter((i: CartItem) => i.id !== id);
      sync();
    },

    clearCart() {
      items = [];
      sync();
    },
  };
}

export const cart = createCartStore();
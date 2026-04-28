export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

class UIStore {
  isMobileMenuOpen = $state(false);
  isSearchOpen = $state(false);
  toasts = $state<Toast[]>([]);
  // Enforce dark as the initial unhydrated state to prevent SSR mismatch
  theme = $state<'light' | 'dark'>('dark');

  constructor() {
    // Sync the Svelte store with the DOM state initialized by Astro's FOUC script
    if (typeof window !== 'undefined') {
      this.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      window.addEventListener('theme-changed', ((e: CustomEvent<{ theme: 'light' | 'dark' }>) => {
        this.theme = e.detail.theme;
      }) as EventListener);
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  addToast(message: string, type: ToastType = 'info', duration: number = 4000) {
    const id = crypto.randomUUID();
    this.toasts.push({ id, message, type, duration });
    if (duration > 0) {
      setTimeout(() => this.removeToast(id), duration);
    }
  }

  removeToast(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }
}

export const ui = new UIStore();
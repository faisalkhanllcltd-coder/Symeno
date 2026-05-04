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
    if (typeof window !== 'undefined') {
      this.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

      window.addEventListener('theme-changed', (e: Event) => {
        const customEvent = e as CustomEvent<{ theme: 'light' | 'dark' }>;
        this.theme = customEvent.detail.theme;
      });
    }
  }

  // Arrow functions permanently bind 'this', preventing context loss
  toggleMobileMenu = () => {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  };

  toggleSearch = () => {
    this.isSearchOpen = !this.isSearchOpen;
  };

  addToast = (message: string, type: ToastType = 'info', duration: number = 4000) => {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15);

    this.toasts.push({ id, message, type, duration });

    if (duration > 0) {
      setTimeout(() => this.removeToast(id), duration);
    }
  };

  removeToast = (id: string) => {
    // Explicitly typed (t: Toast) to satisfy strict TS configs
    this.toasts = this.toasts.filter((t: Toast) => t.id !== id);
  };
}

export const ui = new UIStore();
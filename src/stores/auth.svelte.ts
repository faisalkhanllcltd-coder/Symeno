interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'customer';
}

class AuthStore {
  // @ts-ignore - Svelte 5 rune macro
  user: User | null = $state(null);
  // @ts-ignore - Svelte 5 rune macro
  isLoading: boolean = $state(true);

  get isAuthenticated() {
    return this.user !== null;
  }

  get isAdmin() {
    return this.user?.role === 'admin';
  }

  // Verifies a secure HttpOnly cookie with the Astro SSR backend
  async checkSession() {
    this.isLoading = true;
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        this.user = await res.json();
      } else {
        this.user = null;
      }
    } catch (err) {
      this.user = null;
    } finally {
      this.isLoading = false;
    }
  }

  // FIXED: Executing a secure POST fetch to clear the HttpOnly cookie and eliminate CSRF vulnerability.
  async logout() {
    this.user = null;
    if (typeof window !== 'undefined') {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/auth/login';
      } catch (e) {
        console.error('Logout failed', e);
        // Fallback to home if the network is interrupted
        window.location.href = '/';
      }
    }
  }
}

export const auth = new AuthStore();
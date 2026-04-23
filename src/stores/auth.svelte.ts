interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'CUSTOMER';
}

class AuthStore {
  user = $state<User | null>(null);
  isLoading = $state(true);

  get isAuthenticated() {
    return this.user !== null;
  }

  get isAdmin() {
    return this.user?.role === 'ADMIN';
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

  logout() {
    this.user = null;
    if (typeof window !== 'undefined') {
      // Force a hard redirect to let the server clear the HttpOnly cookie
      window.location.href = '/api/auth/logout';
    }
  }
}

export const auth = new AuthStore();

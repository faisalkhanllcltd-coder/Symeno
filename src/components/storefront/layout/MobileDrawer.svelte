<script lang="ts">
  import { onMount } from 'svelte';
  import { ui } from '../../../stores/ui.svelte.ts';

  function closeMenu() {
    ui.isMobileMenuOpen = false;
  }

  onMount(() => {
    const handleOpen = () => (ui.isMobileMenuOpen = true);
    window.addEventListener('open-mobile-nav', handleOpen);
    return () => window.removeEventListener('open-mobile-nav', handleOpen);
  });
</script>

<div
  class="fixed inset-0 z-[60] bg-base/80 backdrop-blur-md transition-opacity duration-300 md:hidden {ui.isMobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}"
  onclick={closeMenu}
  role="presentation"
></div>

<div
  class="fixed inset-y-0 left-0 z-[70] flex w-full max-w-[320px] transform flex-col border-r border-outline/40 bg-base/95 backdrop-blur-2xl shadow-2xl transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden {ui.isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}"
>
  <div class="flex h-16 shrink-0 items-center justify-between border-b border-outline/40 px-6">
    <span class="text-[20px] font-bold tracking-tight text-content">
      Menu<span class="text-brand">.</span>
    </span>
    <button
      onclick={closeMenu}
      aria-label="Close menu"
      class="text-content-muted transition-colors hover:bg-surface/50 hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-full flex h-10 w-10 items-center justify-center -mr-2"
    >
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>

  <div class="flex-1 space-y-2 overflow-y-auto px-6 py-8">
    <div class="flex flex-col space-y-1">
      <a
        href="/"
        onclick={closeMenu}
        class="flex min-h-[48px] items-center justify-between border-b border-outline/40 text-[15px] font-medium text-content focus-visible:outline-none focus-visible:text-brand"
      >
        Home
      </a>
      <a
        href="/shop"
        onclick={closeMenu}
        class="group flex min-h-[48px] items-center justify-between border-b border-outline/40 text-[15px] font-medium text-content focus-visible:outline-none focus-visible:text-brand"
      >
        Shop <span class="text-content-muted transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
      </a>
      <a
        href="/brands"
        onclick={closeMenu}
        class="group flex min-h-[48px] items-center justify-between border-b border-outline/40 text-[15px] font-medium text-content focus-visible:outline-none focus-visible:text-brand"
      >
        Brands <span class="text-content-muted transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
      </a>
      <a
        href="/deals"
        onclick={closeMenu}
        class="group flex min-h-[48px] items-center justify-between border-b border-outline/40 text-[15px] font-medium text-brand-alert focus-visible:outline-none focus-visible:text-brand"
      >
        Deals <span class="text-brand-alert/50 transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
      </a>
      <a
        href="/new-arrivals"
        onclick={closeMenu}
        class="group flex min-h-[48px] items-center justify-between border-b border-outline/40 text-[15px] font-medium text-content focus-visible:outline-none focus-visible:text-brand"
      >
        New Arrivals <span class="text-content-muted transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
      </a>
    </div>
  </div>

  <div class="shrink-0 space-y-4 border-t border-outline/40 bg-surface/30 p-6">
    <a
      href="/account"
      onclick={closeMenu}
      class="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-lg border border-outline/60 bg-base px-4 py-3 font-mono text-[11px] font-bold tracking-widest text-content uppercase shadow-sm transition-all hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      My Account
    </a>
  </div>
</div>
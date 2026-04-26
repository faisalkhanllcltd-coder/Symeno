<script lang="ts">
  import { onMount } from 'svelte';
  import { ui } from '../../../stores/ui.svelte.ts';

  let openSection = $state<'shop' | 'brands' | null>('shop');        

  function toggleSection(section: 'shop' | 'brands') {
    openSection = openSection === section ? null : section;
  }

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
  class="fixed inset-0 z-60 bg-base/60 backdrop-blur-sm transition-opacity duration-300 md:hidden {ui.isMobileMenuOpen
    ? 'opacity-100'
    : 'pointer-events-none opacity-0'}"
  onclick={closeMenu}
  role="presentation"
></div>

<div
  class="fixed inset-y-0 left-0 z-70 flex w-full max-w-[300px] transform flex-col border-r border-outline bg-base shadow-2xl transition-transform duration-300 ease-in-out md:hidden {ui.isMobileMenuOpen      
    ? 'translate-x-0'
    : '-translate-x-full'}"
>
  <div
    class="flex h-16 shrink-0 items-center justify-between border-b border-outline bg-base px-6"
  >
    <span class="text-lg font-bold tracking-tighter text-content uppercase"
      >Menu<span class="text-brand">.</span></span
    >
    <button
      onclick={closeMenu}
      aria-label="Close menu"
      class="text-content-muted transition-colors hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm flex min-h-[44px] min-w-[44px] items-center justify-center"
    >
      <svg
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 18L18 6M6 6l12 12"
        /></svg
      >
    </button>
  </div>

  <div class="flex-1 space-y-6 overflow-y-auto px-6 py-8">
    <div class="flex flex-col space-y-2 border-b border-outline pb-6">
      <a
        href="/deals"
        onclick={closeMenu}
        class="flex min-h-[44px] items-center justify-between text-sm font-bold tracking-widest text-brand-alert uppercase focus-visible:outline-none focus-visible:underline"
        >Live Arbitrage Deals <span class="text-lg">&rarr;</span></a 
      >
      <a
        href="/new-arrivals"
        onclick={closeMenu}
        class="flex min-h-[44px] items-center justify-between text-sm font-bold tracking-widest text-content uppercase focus-visible:outline-none focus-visible:text-brand"
        >New Deployments <span class="text-lg">&rarr;</span></a      
      >
    </div>

    <div class="border-b border-outline pb-2">
      <button
        onclick={() => toggleSection('shop')}
        class="flex w-full min-h-[44px] items-center justify-between py-2 text-sm font-bold tracking-widest text-content uppercase focus-visible:outline-none focus-visible:text-brand rounded-sm"
      >
        Hardware Matrix <svg
          class="h-4 w-4 transition-transform duration-200 {openSection === 'shop' ? 'rotate-180' : ''}"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {#if openSection === 'shop'}
        <ul class="ml-2 animate-[slide-down_0.2s_ease-out] space-y-2 border-l-2 border-brand py-2 pl-4">
          <li><a href="/shop/audio" onclick={closeMenu} class="flex min-h-[44px] items-center font-mono text-sm text-content-muted hover:text-content focus-visible:text-brand">Audio &amp; Acoustics</a></li>
          <li><a href="/shop/displays" onclick={closeMenu} class="flex min-h-[44px] items-center font-mono text-sm text-content-muted hover:text-content focus-visible:text-brand">Displays &amp; Monitors</a></li>
          <li><a href="/shop/peripherals" onclick={closeMenu} class="flex min-h-[44px] items-center font-mono text-sm text-content-muted hover:text-content focus-visible:text-brand">Peripherals &amp; Input</a></li>
          <li><a href="/shop" onclick={closeMenu} class="mt-2 flex min-h-[44px] items-center font-mono text-sm font-bold text-content focus-visible:text-brand">View All Inventory &rarr;</a></li>
        </ul>
      {/if}
    </div>

    <div class="border-b border-outline pb-2">
      <button
        onclick={() => toggleSection('brands')}
        class="flex w-full min-h-[44px] items-center justify-between py-2 text-sm font-bold tracking-widest text-content uppercase focus-visible:outline-none focus-visible:text-brand rounded-sm"
      >
        Authorized Brands <svg
          class="h-4 w-4 transition-transform duration-200 {openSection === 'brands' ? 'rotate-180' : ''}"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {#if openSection === 'brands'}
        <ul class="ml-2 animate-[slide-down_0.2s_ease-out] space-y-2 border-l-2 border-brand py-2 pl-4">
          {#each ['Apple', 'Logitech', 'Sony', 'Keychron'] as brand} 
            <li><a href={`/brands/${brand.toLowerCase()}`} onclick={closeMenu} class="flex min-h-[44px] items-center font-mono text-sm text-content-muted hover:text-content focus-visible:text-brand">{brand}</a></li>
          {/each}
          <li><a href="/brands" onclick={closeMenu} class="mt-2 flex min-h-[44px] items-center font-mono text-sm font-bold text-content focus-visible:text-brand">View Brand Directory &rarr;</a></li>
        </ul>
      {/if}
    </div>
  </div>

  <div class="shrink-0 space-y-4 border-t border-outline bg-surface p-6">
    <a
      href="/account"
      onclick={closeMenu}
      class="flex w-full min-h-[44px] items-center justify-center gap-2 border border-outline bg-base px-4 py-3 text-xs font-bold tracking-widest text-content uppercase transition-colors hover:border-brand focus-visible:outline-none focus-visible:border-brand"
    >
      My Account
    </a>
  </div>
</div>

<style>
  @keyframes slide-down {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
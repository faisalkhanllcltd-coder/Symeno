<script lang="ts">
  import { onMount } from 'svelte';
  import { isMobileNavOpen } from '../../../stores/ui';

  let openSection: 'shop' | 'brands' | null = 'shop';

  function toggleSection(section: 'shop' | 'brands') {
    openSection = openSection === section ? null : section;
  }

  function closeMenu() {
    isMobileNavOpen.set(false);
  }

  onMount(() => {
    const handleOpen = () => isMobileNavOpen.set(true);
    window.addEventListener('open-mobile-nav', handleOpen);
    return () => window.removeEventListener('open-mobile-nav', handleOpen);
  });
</script>

<div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 md:hidden { $isMobileNavOpen ? 'opacity-100' : 'opacity-0 pointer-events-none' }" on:click={closeMenu} role="presentation"></div>

<div class="fixed inset-y-0 left-0 w-full max-w-[300px] bg-white border-r border-gray-200 z-[101] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out md:hidden { $isMobileNavOpen ? 'translate-x-0' : '-translate-x-full' }">
  <div class="h-16 flex items-center justify-between px-6 border-b border-gray-200 bg-white shrink-0">
    <span class="text-lg font-bold tracking-tighter text-black uppercase">Menu<span class="text-[#10b981]">.</span></span>
    <button on:click={closeMenu} aria-label="Close menu" class="text-gray-400 hover:text-black transition-colors focus:outline-none">
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
    </button>
  </div>

  <div class="flex-1 overflow-y-auto px-6 py-8 space-y-6">
    <div class="flex flex-col space-y-4 pb-6 border-b border-gray-200">
      <a href="/sale" on:click={closeMenu} class="text-sm font-bold uppercase tracking-widest text-red-600 flex items-center justify-between">Live Arbitrage Deals <span class="text-lg">&rarr;</span></a>
      <a href="/new-arrivals" on:click={closeMenu} class="text-sm font-bold uppercase tracking-widest text-gray-900 flex items-center justify-between">New Deployments <span class="text-lg">&rarr;</span></a>
    </div>

    <div class="border-b border-gray-200 pb-2">
      <button on:click={() => toggleSection('shop')} class="w-full flex justify-between items-center py-2 text-sm font-bold uppercase tracking-widest text-gray-900 focus:outline-none">
        Hardware Matrix <svg class="w-4 h-4 transition-transform duration-200 {openSection === 'shop' ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {#if openSection === 'shop'}
        <ul class="py-4 space-y-4 pl-4 border-l-2 border-[#10b981] ml-2 animate-[slide-down_0.2s_ease-out]">
          <li><a href="/shop/audio" on:click={closeMenu} class="text-sm font-mono text-gray-600 hover:text-black block">Audio & Acoustics</a></li>
          <li><a href="/shop/displays" on:click={closeMenu} class="text-sm font-mono text-gray-600 hover:text-black block">Displays & Monitors</a></li>
          <li><a href="/shop/peripherals" on:click={closeMenu} class="text-sm font-mono text-gray-600 hover:text-black block">Peripherals & Input</a></li>
          <li><a href="/shop" on:click={closeMenu} class="text-sm font-mono font-bold text-black block mt-2">View All Inventory &rarr;</a></li>
        </ul>
      {/if}
    </div>

    <div class="border-b border-gray-200 pb-2">
      <button on:click={() => toggleSection('brands')} class="w-full flex justify-between items-center py-2 text-sm font-bold uppercase tracking-widest text-gray-900 focus:outline-none">
        Authorized Brands <svg class="w-4 h-4 transition-transform duration-200 {openSection === 'brands' ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {#if openSection === 'brands'}
        <ul class="py-4 space-y-4 pl-4 border-l-2 border-[#10b981] ml-2 animate-[slide-down_0.2s_ease-out]">
          {#each ['Apple', 'Logitech', 'Sony', 'Keychron'] as brand}
            <li><a href={`/brands/${brand.toLowerCase()}`} on:click={closeMenu} class="text-sm font-mono text-gray-600 hover:text-black block">{brand}</a></li>
          {/each}
          <li><a href="/brands" on:click={closeMenu} class="text-sm font-mono font-bold text-black block mt-2">View Brand Directory &rarr;</a></li>
        </ul>
      {/if}
    </div>
  </div>

  <div class="p-6 border-t border-gray-200 bg-gray-50 shrink-0 space-y-4">
    <a href="/account" on:click={closeMenu} class="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-black px-4 py-3 text-xs font-bold uppercase tracking-widest hover:border-black transition-colors">
      My Account
    </a>
  </div>
</div>

<style>
  @keyframes slide-down { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
</style>
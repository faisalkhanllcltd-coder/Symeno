<script lang="ts">
  import { onMount } from 'svelte';
  import { ui } from '../../../stores/ui.svelte.ts';

  let query = $state('');
  let results = $state<any[]>([]);
  let isSearching = $state(false);
  
  let searchTimeout: ReturnType<typeof setTimeout> | undefined;
  
  // FIX: Svelte 5 reactive DOM binding
  let inputRef = $state<HTMLInputElement>();

  $effect(() => {
    if (ui.isSearchOpen && inputRef) {
      setTimeout(() => inputRef?.focus(), 50);
    }
  });

  onMount(() => {
    const handleOpen = () => (ui.isSearchOpen = true);
    window.addEventListener('open-search', handleOpen);
    return () => window.removeEventListener('open-search', handleOpen);
  });

  function closeSearch() {
    ui.isSearchOpen = false;
    query = '';
    results = [];
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && ui.isSearchOpen) {
      closeSearch();
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      ui.isSearchOpen = true;
    }
  }

  function handleInput() {
    if (searchTimeout) clearTimeout(searchTimeout);
    
    if (query.length < 2) {
      results = [];
      return;
    }
    
    isSearching = true;
    searchTimeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/catalog/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          results = await res.json();
        }
      } finally {
        isSearching = false;
      }
    }, 300);
  }
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if ui.isSearchOpen}
  <div
    class="fixed inset-0 z-[100] bg-base/60 backdrop-blur-md transition-opacity duration-300"
    onclick={closeSearch}
    role="presentation"
  ></div>

  <div class="fixed top-4 left-1/2 z-[101] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 md:top-24 md:w-full md:px-4 animate-[palette-drop_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards]">
    <div class="flex max-h-[85vh] flex-col overflow-hidden rounded-xl border border-outline/40 bg-surface/90 backdrop-blur-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] supports-[backdrop-filter]:bg-surface/70">

      <div class="relative flex items-center border-b border-outline/30 bg-transparent px-4 py-4">
        <svg class="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          bind:this={inputRef}
          type="text"
          bind:value={query}
          oninput={handleInput}
          placeholder="Search hardware, brands, or SKUs..."
          class="w-full bg-transparent pl-4 pr-20 text-[15px] font-medium tracking-wide text-content placeholder:text-content-muted focus:outline-none"        
        />

        {#if isSearching}
          <div class="absolute right-16 h-4 w-4 animate-spin rounded-full border-2 border-brand/20 border-t-brand"></div>
        {/if}
        
        <button onclick={closeSearch} class="absolute right-3 flex min-h-[32px] min-w-[32px] items-center justify-center rounded-md border border-outline/50 bg-base/50 text-content-muted transition-colors hover:border-brand/50 hover:bg-surface hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
          <span class="hidden font-mono text-[9px] font-bold tracking-widest uppercase md:inline-block">ESC</span>
          <svg class="h-4 w-4 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>        
        </button>
      </div>

      <div class="overflow-y-auto">
        {#if query.length >= 2}
          <div class="p-3">
            {#if results.length > 0}
              <ul class="space-y-1.5">
                {#each results as product}
                  <li>
                    <a
                      href={`/shop/product/${product.slug}`}
                      onclick={closeSearch}
                      class="group flex items-center gap-4 rounded-lg p-3 transition-all duration-200 hover:bg-base/80 focus-visible:bg-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"      
                    >
                      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-outline/30 bg-gradient-to-br from-surface to-base">
                        <svg class="h-5 w-5 text-content-muted/40 transition-colors group-hover:text-brand/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div class="min-w-0 flex-1">
                        <h4 class="truncate text-[14px] font-semibold text-content transition-colors group-hover:text-brand">
                          {product.title}
                        </h4>
                        <span class="font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase">{product.brand}</span>
                      </div>
                      <div class="text-right">
                        <span class="font-mono text-[13px] font-bold text-brand-alert">${product.base_price.toFixed(2)}</span>
                      </div>
                    </a>
                  </li>
                {/each}
              </ul>
              <div class="mt-3 border-t border-outline/30 pt-3 text-center">
                <a
                  href={`/shop?q=${encodeURIComponent(query)}`}      
                  onclick={closeSearch}
                  class="group inline-flex items-center gap-1 rounded-sm px-4 py-2 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >View All {results.length} Results <span class="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span></a
                >
              </div>
            {:else if !isSearching}
              <div class="p-12 text-center">
                <svg class="mx-auto mb-3 h-8 w-8 text-content-muted/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="font-mono text-[11px] font-bold tracking-widest text-content-muted uppercase">
                  No signals found matching "{query}".
                </p>
              </div>
            {/if}
          </div>
        {:else}
          <div class="p-6">
            <p class="mb-4 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase">Trending Nodes</p>
            <div class="flex flex-wrap gap-2.5">
              <button onclick={() => { query = 'Sony XM5'; handleInput(); }} class="rounded-full border border-outline/50 bg-surface/50 px-4 py-2 font-mono text-[11px] font-bold tracking-widest text-content-muted transition-colors hover:border-brand/50 hover:bg-base hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">Sony XM5</button>
              <button onclick={() => { query = 'Apple Audio'; handleInput(); }} class="rounded-full border border-outline/50 bg-surface/50 px-4 py-2 font-mono text-[11px] font-bold tracking-widest text-content-muted transition-colors hover:border-brand/50 hover:bg-base hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">Apple Audio</button>
              <button onclick={() => { query = 'Displays'; handleInput(); }} class="rounded-full border border-outline/50 bg-surface/50 px-4 py-2 font-mono text-[11px] font-bold tracking-widest text-content-muted transition-colors hover:border-brand/50 hover:bg-base hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">OLED Displays</button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes palette-drop {
    from { 
      opacity: 0; 
      transform: translateY(-20px) translateX(-50%); 
      filter: blur(4px);
    }
    to { 
      opacity: 1; 
      transform: translateY(0) translateX(-50%); 
      filter: blur(0px);
    }    
  }
</style>
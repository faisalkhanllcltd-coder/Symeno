<script lang="ts">
  import { onMount } from 'svelte';
  import { ui } from '../../../stores/ui.svelte.ts';

  let query = $state('');
  let results = $state<any[]>([]);
  let isSearching = $state(false);
  let searchTimeout: ReturnType<typeof setTimeout>;
  let inputRef: HTMLInputElement;

  $effect(() => {
    if (ui.isSearchOpen && inputRef) {
      setTimeout(() => inputRef.focus(), 50);
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
    clearTimeout(searchTimeout);
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
    class="fixed inset-0 z-[100] bg-base/80 backdrop-blur-sm transition-opacity duration-300"
    onclick={closeSearch}
    role="presentation"
  ></div>

  <div class="animate-[fade-in_0.15s_ease-out] fixed top-4 left-1/2 z-[101] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 md:top-24 md:w-full md:px-4">
    <div class="flex max-h-[85vh] flex-col overflow-hidden rounded-md border border-outline bg-surface shadow-2xl">

      <div class="relative flex items-center border-b border-outline bg-base px-4 py-4">
        <svg class="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          bind:this={inputRef}
          type="text"
          bind:value={query}
          oninput={handleInput}
          placeholder="Search hardware..."
          class="w-full bg-transparent pl-4 pr-20 font-mono text-sm text-content placeholder:text-content-muted focus:outline-none"        
        />

        {#if isSearching}
          <div class="absolute right-14 h-4 w-4 animate-spin rounded-full border-2 border-brand/20 border-t-brand"></div>
        {/if}
        
        <button onclick={closeSearch} class="absolute right-2 flex min-h-[36px] min-w-[36px] items-center justify-center rounded-sm text-content-muted hover:bg-outline/50 hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
          <span class="hidden font-mono text-[10px] tracking-widest uppercase md:inline-block">ESC</span>
          <svg class="h-5 w-5 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>        
        </button>
      </div>

      <div class="overflow-y-auto">
        {#if query.length >= 2}
          <div class="p-2">
            {#if results.length > 0}
              <ul class="space-y-1">
                {#each results as product}
                  <li>
                    <a
                      href={`/shop/product/${product.slug}`}
                      onclick={closeSearch}
                      class="group flex items-center gap-4 rounded-sm p-3 transition-colors hover:bg-base focus-visible:bg-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"      
                    >
                      <div class="flex h-10 w-10 shrink-0 items-center justify-center border border-outline bg-base">
                        <span class="font-mono text-[8px] text-content-muted">IMG</span>
                      </div>
                      <div class="min-w-0 flex-1">
                        <h4 class="truncate text-xs font-bold text-content transition-colors group-hover:text-brand">
                          {product.title}
                        </h4>
                        <span class="font-mono text-[10px] text-content-muted uppercase">{product.brand}</span>
                      </div>
                      <div class="text-right">
                        <span class="font-mono text-xs font-bold text-brand">${product.base_price.toFixed(2)}</span>
                      </div>
                    </a>
                  </li>
                {/each}
              </ul>
              <div class="mt-2 border-t border-outline/50 p-2 text-center">
                <a
                  href={`/shop?q=${encodeURIComponent(query)}`}      
                  onclick={closeSearch}
                  class="inline-block rounded-sm px-4 py-2 font-mono text-[10px] tracking-widest text-content-muted uppercase transition-colors hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >View All Results &rarr;</a
                >
              </div>
            {:else if !isSearching}
              <div class="p-8 text-center">
                <p class="font-mono text-xs tracking-widest text-content-muted uppercase">
                  No signals found.
                </p>
              </div>
            {/if}
          </div>
        {:else}
          <div class="p-6">
            <p class="mb-3 font-mono text-[10px] tracking-widest text-content-muted uppercase">Trending Nodes</p>
            <div class="flex flex-wrap gap-2">
              <button onclick={() => { query = 'Sony XM5'; handleInput(); }} class="rounded-sm border border-outline bg-base px-3 py-1.5 font-mono text-xs text-content-muted transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">Sony XM5</button>
              <button onclick={() => { query = 'Apple Audio'; handleInput(); }} class="rounded-sm border border-outline bg-base px-3 py-1.5 font-mono text-xs text-content-muted transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">Apple Audio</button>
              <button onclick={() => { query = 'Displays'; handleInput(); }} class="rounded-sm border border-outline bg-base px-3 py-1.5 font-mono text-xs text-content-muted transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">OLED Displays</button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(-10px) translateX(-50%); }
    to { opacity: 1; transform: translateY(0) translateX(-50%); }    
  }
</style>
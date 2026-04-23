<script lang="ts">
  let query = $state('');
  let results = $state<any[]>([]);
  let isSearching = $state(false);
  let showDropdown = $state(false);
  let searchTimeout: ReturnType<typeof setTimeout>;

  function handleInput() {
    clearTimeout(searchTimeout);
    
    if (query.length < 2) {
      results = [];
      showDropdown = false;
      return;
    }

    isSearching = true;
    showDropdown = true;

    // 300ms Debounce to prevent D1 API spam
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

  function closeSearch() {
    setTimeout(() => { showDropdown = false; }, 200);
  }
</script>

<div class="relative w-full max-w-2xl mx-auto group z-50">
  <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-[#36f4a4] transition-colors">
    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  </div>
  
  <input 
    type="text" 
    bind:value={query}
    oninput={handleInput}
    onblur={closeSearch}
    onfocus={() => { if (query.length >= 2) showDropdown = true; }}
    placeholder="Search hardware, brands, or SKUs..." 
    class="w-full bg-[#111318] border border-white/10 text-white pl-12 pr-4 py-4 text-sm font-mono focus:outline-none focus:border-[#36f4a4]/50 transition-colors rounded-none placeholder:text-white/20"
  />

  {#if isSearching}
    <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
      <div class="w-4 h-4 border-2 border-[#36f4a4]/20 border-t-[#36f4a4] rounded-full animate-spin"></div>
    </div>
  {/if}

  {#if showDropdown && query.length >= 2}
    <div class="absolute top-full left-0 right-0 mt-2 bg-[#1A1D23] border border-white/10 shadow-2xl overflow-hidden animate-fade-in z-50 max-h-[60vh] overflow-y-auto">
      {#if results.length > 0}
        <ul class="divide-y divide-white/5">
          {#each results as product}
            <li>
              <a href={`/shop/product/${product.slug}`} class="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors group/item">
                <div class="w-12 h-12 bg-[#111318] border border-white/5 flex items-center justify-center shrink-0">
                  <span class="text-[8px] font-mono text-white/30">IMG</span>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-xs font-bold text-white group-hover/item:text-[#36f4a4] transition-colors truncate">{product.title}</h4>
                  <div class="flex gap-3 mt-1 text-[10px] font-mono">
                    <span class="text-white/40 uppercase">{product.brand}</span>
                    <span class="text-[#36f4a4]">${product.base_price.toFixed(2)}</span>
                  </div>
                </div>
              </a>
            </li>
          {/each}
        </ul>
        <div class="p-3 bg-[#111318] border-t border-white/10 text-center">
          <a href={`/shop?q=${encodeURIComponent(query)}`} class="text-[10px] font-mono uppercase tracking-widest text-white/50 hover:text-white transition-colors">View All Results &rarr;</a>
        </div>
      {:else if !isSearching}
        <div class="p-8 text-center">
          <p class="text-xs font-mono text-white/50 uppercase tracking-widest">No signals found in the matrix.</p>
        </div>
      {/if}
    </div>
  {/if}
</div>
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
        const res = await fetch(
          `/api/catalog/search?q=${encodeURIComponent(query)}`
        );
        if (res.ok) {
          results = await res.json();
        }
      } finally {
        isSearching = false;
      }
    }, 300);
  }

  function closeSearch() {
    setTimeout(() => {
      showDropdown = false;
    }, 200);
  }
</script>

<div class="group relative z-50 mx-auto w-full max-w-2xl">
  <div
    class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-white/40 transition-colors group-focus-within:text-[#36f4a4]"
  >
    <svg
      class="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  </div>

  <input
    type="text"
    bind:value={query}
    oninput={handleInput}
    onblur={closeSearch}
    onfocus={() => {
      if (query.length >= 2) showDropdown = true;
    }}
    placeholder="Search hardware, brands, or SKUs..."
    class="w-full rounded-none border border-white/10 bg-[#111318] py-4 pr-4 pl-12 font-mono text-sm text-white transition-colors placeholder:text-white/20 focus:border-[#36f4a4]/50 focus:outline-none"
  />

  {#if isSearching}
    <div
      class="pointer-events-none absolute inset-y-0 right-4 flex items-center"
    >
      <div
        class="h-4 w-4 animate-spin rounded-full border-2 border-[#36f4a4]/20 border-t-[#36f4a4]"
      ></div>
    </div>
  {/if}

  {#if showDropdown && query.length >= 2}
    <div
      class="animate-fade-in absolute top-full right-0 left-0 z-50 mt-2 max-h-[60vh] overflow-hidden overflow-y-auto border border-white/10 bg-[#1A1D23] shadow-2xl"
    >
      {#if results.length > 0}
        <ul class="divide-y divide-white/5">
          {#each results as product}
            <li>
              <a
                href={`/shop/product/${product.slug}`}
                class="group/item flex items-center gap-4 p-4 transition-colors hover:bg-white/5"
              >
                <div
                  class="flex h-12 w-12 shrink-0 items-center justify-center border border-white/5 bg-[#111318]"
                >
                  <span class="font-mono text-[8px] text-white/30">IMG</span>
                </div>
                <div class="min-w-0 flex-1">
                  <h4
                    class="truncate text-xs font-bold text-white transition-colors group-hover/item:text-[#36f4a4]"
                  >
                    {product.title}
                  </h4>
                  <div class="mt-1 flex gap-3 font-mono text-[10px]">
                    <span class="text-white/40 uppercase">{product.brand}</span>
                    <span class="text-[#36f4a4]"
                      >${product.base_price.toFixed(2)}</span
                    >
                  </div>
                </div>
              </a>
            </li>
          {/each}
        </ul>
        <div class="border-t border-white/10 bg-[#111318] p-3 text-center">
          <a
            href={`/shop?q=${encodeURIComponent(query)}`}
            class="font-mono text-[10px] tracking-widest text-white/50 uppercase transition-colors hover:text-white"
            >View All Results &rarr;</a
          >
        </div>
      {:else if !isSearching}
        <div class="p-8 text-center">
          <p class="font-mono text-xs tracking-widest text-white/50 uppercase">
            No signals found in the matrix.
          </p>
        </div>
      {/if}
    </div>
  {/if}
</div>

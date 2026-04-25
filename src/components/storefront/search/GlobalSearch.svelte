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
    class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-content-muted transition-colors group-focus-within:text-brand"
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
    class="w-full rounded-none border border-outline bg-base py-4 pr-4 pl-12 font-mono text-sm text-content transition-colors placeholder:text-content-muted/50 focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
  />

  {#if isSearching}
    <div
      class="pointer-events-none absolute inset-y-0 right-4 flex items-center"
    >
      <div
        class="h-4 w-4 animate-spin rounded-full border-2 border-brand/20 border-t-brand"
      ></div>
    </div>
  {/if}

  {#if showDropdown && query.length >= 2}
    <div
      class="animate-fade-in absolute top-full right-0 left-0 z-50 mt-2 max-h-[60vh] overflow-hidden overflow-y-auto border border-outline bg-surface shadow-2xl"
    >
      {#if results.length > 0}
        <ul class="divide-y divide-outline/50">
          {#each results as product}
            <li>
              <a
                href={`/shop/product/${product.slug}`}
                class="group/item flex items-center gap-4 p-4 transition-colors hover:bg-base/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
              >
                <div
                  class="flex h-12 w-12 shrink-0 items-center justify-center border border-outline bg-base"
                >
                  <span class="font-mono text-[8px] text-content-muted">IMG</span>
                </div>
                <div class="min-w-0 flex-1">
                  <h4
                    class="truncate text-xs font-bold text-content transition-colors group-hover/item:text-brand"
                  >
                    {product.title}
                  </h4>
                  <div class="mt-1 flex gap-3 font-mono text-[10px]">
                    <span class="text-content-muted uppercase">{product.brand}</span>
                    <span class="text-brand"
                      >${product.base_price.toFixed(2)}</span
                    >
                  </div>
                </div>
              </a>
            </li>
          {/each}
        </ul>
        <div class="border-t border-outline bg-base p-3 text-center">
          <a
            href={`/shop?q=${encodeURIComponent(query)}`}
            class="font-mono text-[10px] tracking-widest text-content-muted uppercase transition-colors hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
            >View All Results &rarr;</a
          >
        </div>
      {:else if !isSearching}
        <div class="p-8 text-center">
          <p class="font-mono text-xs tracking-widest text-content-muted uppercase">
            No signals found in the matrix.
          </p>
        </div>
      {/if}
    </div>
  {/if}
</div>

<script lang="ts">
  // These props allow Astro to pass the live edge database feeds down for SSR hydration
  interface Props {
    activeBrand?: string;
    activeCategory?: string;
    activeSort?: string;
    currentQuery?: string;
    realCategories?: { name: string; slug: string; count: number }[];
    realBrands?: { name: string; slug: string; count: number }[];
  }

  let {
    activeBrand = '',
    activeCategory = '',
    activeSort = 'newest',
    currentQuery = '',
    realCategories = [],
    realBrands = [],
  } = $props<Props>();

  const sortOptions = [
    { value: 'newest', label: 'Newest Arrivals' },    
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
  ];
</script>

<form
  action="/shop"
  method="GET"
  class="sticky top-24 space-y-8 border border-outline bg-surface p-6 transition-colors duration-300"
>
  <div class="flex items-center justify-between border-b border-outline pb-4">
    <h3
      class="font-mono text-xs font-bold tracking-widest text-content uppercase"
    >
      Filter Matrix
    </h3>
    <a
      href="/shop"
      class="font-mono text-[9px] tracking-widest text-content-muted uppercase transition-colors hover:text-content focus-visible:outline-none focus-visible:text-brand"   
      >Reset</a
    >
  </div>

  {#if currentQuery}
    <input type="hidden" name="q" value={currentQuery} />
  {/if}

  <div class="space-y-4">
    <h4 class="font-mono text-[10px] tracking-widest text-content-muted uppercase">
      Sort Protocol
    </h4>
    <select
      name="sort"
      class="w-full cursor-pointer appearance-none rounded-none border border-outline bg-base p-3 font-mono text-xs text-content focus:border-brand focus:outline-none transition-colors"
      onchange={(e) => e.currentTarget.form?.submit()}
    >
      {#each sortOptions as option}
        <option value={option.value} selected={activeSort === option.value}
          >{option.label}</option
        >
      {/each}
    </select>
  </div>

  <!-- DYNAMIC CATEGORY FILTER -->
  {#if realCategories.length > 0}
    <div class="space-y-4">
      <h4 class="font-mono text-[10px] tracking-widest text-content-muted uppercase">
        Categories
      </h4>
      <div class="custom-scrollbar max-h-60 space-y-2 overflow-y-auto pr-2">
        <label class="group flex cursor-pointer items-center gap-3">
          <input
            type="radio"
            name="category"
            value=""
            checked={activeCategory === ''}
            class="hidden"
            onchange={(e) => e.currentTarget.form?.submit()}
          />
          <div
            class="h-4 w-4 border {activeCategory === ''      
              ? 'border-brand bg-brand/20'        
              : 'border-outline bg-base group-hover:border-content-muted'} flex items-center justify-center transition-colors"
          >
            {#if activeCategory === ''}
              <div class="h-2 w-2 bg-brand"></div>
            {/if}
          </div>
          <span
            class="font-mono text-xs {activeCategory === ''  
              ? 'text-content'
              : 'text-content-muted group-hover:text-content'} uppercase transition-colors"
            >All Categories</span
          >
        </label>

        {#each realCategories as cat}
          <label class="group flex cursor-pointer items-center gap-3">
            <input
              type="radio"
              name="category"
              value={cat.slug}
              checked={activeCategory === cat.slug}
              class="hidden"
              onchange={(e) => e.currentTarget.form?.submit()}
            />
            <div
              class="h-4 w-4 border {activeCategory === cat.slug
                ? 'border-brand bg-brand/20'      
                : 'border-outline bg-base group-hover:border-content-muted'} flex items-center justify-center transition-colors"
            >
              {#if activeCategory === cat.slug}   
                <div class="h-2 w-2 bg-brand"></div>  
              {/if}
            </div>
            <span
              class="font-mono text-xs {activeCategory === cat.slug
                ? 'text-content'
                : 'text-content-muted group-hover:text-content'} uppercase transition-colors flex gap-1"
              >
              <span class="truncate max-w-[140px]">{cat.name}</span>
              <span class="opacity-40">({cat.count})</span>
            </span>
          </label>
        {/each}
      </div>
    </div>
  {/if}

  <!-- DYNAMIC BRAND FILTER -->
  {#if realBrands.length > 0}
    <div class="space-y-4">
      <h4 class="font-mono text-[10px] tracking-widest text-content-muted uppercase">
        Brand Authority
      </h4>
      <div class="custom-scrollbar max-h-60 space-y-2 overflow-y-auto pr-2">
        <label class="group flex cursor-pointer items-center gap-3">
          <input
            type="radio"
            name="brand"
            value=""
            checked={activeBrand === ''}
            class="hidden"
            onchange={(e) => e.currentTarget.form?.submit()}
          />
          <div
            class="h-4 w-4 border {activeBrand === ''      
              ? 'border-brand bg-brand/20'        
              : 'border-outline bg-base group-hover:border-content-muted'} flex items-center justify-center transition-colors"
          >
            {#if activeBrand === ''}
              <div class="h-2 w-2 bg-brand"></div>
            {/if}
          </div>
          <span
            class="font-mono text-xs {activeBrand === ''  
              ? 'text-content'
              : 'text-content-muted group-hover:text-content'} uppercase transition-colors"
            >All Brands</span
          >
        </label>

        {#each realBrands as brand}
          <label class="group flex cursor-pointer items-center gap-3">
            <input
              type="radio"
              name="brand"
              value={brand.slug}
              checked={activeBrand === brand.slug}
              class="hidden"
              onchange={(e) => e.currentTarget.form?.submit()}
            />
            <div
              class="h-4 w-4 border {activeBrand === brand.slug
                ? 'border-brand bg-brand/20'      
                : 'border-outline bg-base group-hover:border-content-muted'} flex items-center justify-center transition-colors"
            >
              {#if activeBrand === brand.slug}   
                <div class="h-2 w-2 bg-brand"></div>  
              {/if}
            </div>
            <span
              class="font-mono text-xs {activeBrand === brand.slug
                ? 'text-content'
                : 'text-content-muted group-hover:text-content'} uppercase transition-colors flex gap-1"
              >
              <span class="truncate max-w-[140px]">{brand.name}</span> 
              <span class="opacity-40">({brand.count})</span>
            </span>
          </label>
        {/each}
      </div>
    </div>
  {/if}

  <noscript>
    <button
      type="submit"
      class="w-full bg-brand px-4 py-3 text-[10px] font-bold tracking-widest text-brand-dark uppercase hover:opacity-80"
      >Apply Filters</button
    >
  </noscript>
</form>

<style>
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: var(--color-base);
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--color-outline);
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: var(--color-brand);
  }
</style>
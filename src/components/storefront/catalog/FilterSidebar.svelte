<script lang="ts">
  // These props allow Astro to pass the current URL parameters down for SSR hydration
  let { activeBrand = '', activeSort = 'newest', currentQuery = '' } = $props<{ activeBrand?: string, activeSort?: string, currentQuery?: string }>();
  
  const brands = ['Apple', 'Sony', 'Samsung', 'LG', 'Logitech', 'Bose'];
  const sortOptions = [
    { value: 'newest', label: 'Newest Arrivals' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' }
  ];
</script>

<form action="/shop" method="GET" class="space-y-8 bg-[#111318] border border-white/10 p-6 sticky top-24">
  <div class="flex justify-between items-center border-b border-white/10 pb-4">
    <h3 class="text-xs font-bold text-white uppercase tracking-widest font-mono">Filter Matrix</h3>
    <a href="/shop" class="text-[9px] font-mono text-white/40 hover:text-white uppercase tracking-widest transition-colors">Reset</a>
  </div>

  {#if currentQuery}
    <input type="hidden" name="q" value={currentQuery} />
  {/if}

  <div class="space-y-4">
    <h4 class="text-[10px] font-mono text-white/50 uppercase tracking-widest">Sort Protocol</h4>
    <select name="sort" class="w-full bg-[#1A1D23] border border-white/10 text-white text-xs font-mono p-3 focus:outline-none focus:border-[#36f4a4]/50 cursor-pointer appearance-none rounded-none" onchange="this.form.submit()">
      {#each sortOptions as option}
        <option value={option.value} selected={activeSort === option.value}>{option.label}</option>
      {/each}
    </select>
  </div>

  <div class="space-y-4">
    <h4 class="text-[10px] font-mono text-white/50 uppercase tracking-widest">Brand Authority</h4>
    <div class="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
      <label class="flex items-center gap-3 cursor-pointer group">
        <input type="radio" name="brand" value="" checked={activeBrand === ''} class="hidden" onchange="this.form.submit()" />
        <div class="w-4 h-4 border {activeBrand === '' ? 'border-[#36f4a4] bg-[#36f4a4]/20' : 'border-white/20 bg-[#1A1D23] group-hover:border-white/50'} flex items-center justify-center transition-colors">
          {#if activeBrand === ''}
            <div class="w-2 h-2 bg-[#36f4a4]"></div>
          {/if}
        </div>
        <span class="text-xs font-mono {activeBrand === '' ? 'text-white' : 'text-white/60 group-hover:text-white'} transition-colors uppercase">All Brands</span>
      </label>

      {#each brands as brand}
        <label class="flex items-center gap-3 cursor-pointer group">
          <input type="radio" name="brand" value={brand.toLowerCase()} checked={activeBrand === brand.toLowerCase()} class="hidden" onchange="this.form.submit()" />
          <div class="w-4 h-4 border {activeBrand === brand.toLowerCase() ? 'border-[#36f4a4] bg-[#36f4a4]/20' : 'border-white/20 bg-[#1A1D23] group-hover:border-white/50'} flex items-center justify-center transition-colors">
            {#if activeBrand === brand.toLowerCase()}
              <div class="w-2 h-2 bg-[#36f4a4]"></div>
            {/if}
          </div>
          <span class="text-xs font-mono {activeBrand === brand.toLowerCase() ? 'text-white' : 'text-white/60 group-hover:text-white'} transition-colors uppercase">{brand}</span>
        </label>
      {/each}
    </div>
  </div>

  <noscript>
    <button type="submit" class="w-full bg-[#36f4a4] text-black px-4 py-3 text-[10px] font-bold uppercase tracking-widest">Apply Filters</button>
  </noscript>
</form>

<style>
  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: #111318; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(54,244,164,0.5); }
</style>
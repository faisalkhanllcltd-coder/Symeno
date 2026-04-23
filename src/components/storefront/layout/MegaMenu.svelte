<script lang="ts">
  let activeMenu: 'shop' | 'brands' | null = null;
  let timeout: ReturnType<typeof setTimeout>;

  function handleEnter(menu: 'shop' | 'brands') {
    clearTimeout(timeout);
    activeMenu = menu;
  }

  function handleLeave() {
    timeout = setTimeout(() => {
      activeMenu = null;
    }, 150);
  }
</script>

<nav class="flex h-full" on:mouseleave={handleLeave}>
  <ul class="flex items-center space-x-8 text-xs font-bold uppercase tracking-widest text-gray-900 h-full">
    
    <li class="h-full flex items-center border-b-2 transition-colors {activeMenu === 'shop' ? 'border-[#10b981] text-[#10b981]' : 'border-transparent'}">
      <button class="h-full flex items-center gap-1 focus:outline-none" on:mouseenter={() => handleEnter('shop')}>
        Shop
        <svg class="w-3 h-3 transition-transform duration-200 {activeMenu === 'shop' ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
      </button>
    </li>

    <li class="h-full flex items-center border-b-2 transition-colors {activeMenu === 'brands' ? 'border-[#10b981] text-[#10b981]' : 'border-transparent'}">
      <button class="h-full flex items-center gap-1 focus:outline-none" on:mouseenter={() => handleEnter('brands')}>
        Brands
        <svg class="w-3 h-3 transition-transform duration-200 {activeMenu === 'brands' ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
      </button>
    </li>

    <li class="h-full flex items-center">
      <a href="/sale" class="text-red-600 hover:text-red-700 transition-colors" on:mouseenter={handleLeave}>Deals</a>
    </li>
    <li class="h-full flex items-center">
      <a href="/new-arrivals" class="hover:text-[#10b981] transition-colors" on:mouseenter={handleLeave}>New In</a>
    </li>
  </ul>
</nav>

{#if activeMenu}
  <div role="region" aria-label="Mega Menu" class="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-40" on:mouseenter={() => clearTimeout(timeout)} on:mouseleave={handleLeave}>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {#if activeMenu === 'shop'}
        <div class="grid grid-cols-4 gap-12 animate-[fade-in_0.2s_ease-out]">
          <div class="col-span-1">
            <h3 class="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-4">Hardware Matrix</h3>
            <ul class="space-y-3 text-sm font-bold text-gray-900">
              <li><a href="/shop/audio" class="hover:text-[#10b981] transition-colors">Audio & Acoustics</a></li>
              <li><a href="/shop/displays" class="hover:text-[#10b981] transition-colors">Displays & Monitors</a></li>
              <li><a href="/shop/peripherals" class="hover:text-[#10b981] transition-colors">Peripherals & Input</a></li>
              <li><a href="/shop/components" class="hover:text-[#10b981] transition-colors">Core Components</a></li>
            </ul>
          </div>
          <div class="col-span-1">
            <h3 class="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-4">Operations</h3>
            <ul class="space-y-3 text-sm font-bold text-gray-900">
              <li><a href="/shop" class="hover:text-[#10b981] transition-colors">Shop All Inventory &rarr;</a></li>
              <li><a href="/new-arrivals" class="hover:text-[#10b981] transition-colors">Latest Deployments</a></li>
              <li><a href="/sale" class="text-red-600 hover:text-red-700 transition-colors">Live Arbitrage Deals</a></li>
            </ul>
          </div>
          <div class="col-span-2 bg-[#F9FAFB] border border-gray-200 p-6 flex gap-6 group hover:border-black transition-colors">
            <div class="w-32 h-32 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-mono shrink-0">IMG</div>
            <div class="flex flex-col justify-center">
              <span class="inline-block bg-black text-[#36f4a4] text-[9px] font-bold uppercase tracking-widest px-2 py-1 w-max mb-2">Deal of the Week</span>
              <h4 class="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#10b981] transition-colors">Sony WH-1000XM5</h4>
              <div class="flex items-baseline gap-2 font-mono mb-4">
                <span class="text-sm font-bold text-red-600">$249.00</span>
                <span class="text-[10px] text-gray-400 line-through">$399.00</span>
              </div>
              <a href="/shop/product/sony-xm5" class="text-xs font-bold uppercase tracking-widest text-black border-b border-black w-max pb-0.5">Secure Unit &rarr;</a>
            </div>
          </div>
        </div>
      {:else if activeMenu === 'brands'}
        <div class="animate-[fade-in_0.2s_ease-out]">
          <div class="flex justify-between items-end mb-6 border-b border-gray-200 pb-2">
            <h3 class="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Authorized Suppliers</h3>
            <a href="/brands" class="text-[10px] font-mono text-black hover:text-[#10b981] uppercase tracking-widest transition-colors">View All Directory &rarr;</a>
          </div>
          <div class="grid grid-cols-4 md:grid-cols-6 gap-6">
            {#each ['Apple', 'Dell', 'Keychron', 'LG', 'Logitech', 'Razer', 'Samsung', 'Sony'] as brand}
              <a href={`/brands/${brand.toLowerCase()}`} class="text-sm font-bold text-gray-900 hover:text-[#10b981] transition-colors py-2 border border-transparent hover:border-gray-200 text-center bg-gray-50 hover:bg-white">{brand}</a>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  @keyframes fade-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
</style>
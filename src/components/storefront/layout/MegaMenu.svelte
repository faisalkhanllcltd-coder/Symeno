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
  <ul
    class="flex h-full items-center space-x-8 text-xs font-bold tracking-widest text-gray-900 uppercase"
  >
    <li
      class="flex h-full items-center border-b-2 transition-colors {activeMenu ===
      'shop'
        ? 'border-[#10b981] text-[#10b981]'
        : 'border-transparent'}"
    >
      <button
        class="flex h-full items-center gap-1 focus:outline-none"
        on:mouseenter={() => handleEnter('shop')}
      >
        Shop
        <svg
          class="h-3 w-3 transition-transform duration-200 {activeMenu ===
          'shop'
            ? 'rotate-180'
            : ''}"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          /></svg
        >
      </button>
    </li>

    <li
      class="flex h-full items-center border-b-2 transition-colors {activeMenu ===
      'brands'
        ? 'border-[#10b981] text-[#10b981]'
        : 'border-transparent'}"
    >
      <button
        class="flex h-full items-center gap-1 focus:outline-none"
        on:mouseenter={() => handleEnter('brands')}
      >
        Brands
        <svg
          class="h-3 w-3 transition-transform duration-200 {activeMenu ===
          'brands'
            ? 'rotate-180'
            : ''}"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          /></svg
        >
      </button>
    </li>

    <li class="flex h-full items-center">
      <a
        href="/sale"
        class="text-red-600 transition-colors hover:text-red-700"
        on:mouseenter={handleLeave}>Deals</a
      >
    </li>
    <li class="flex h-full items-center">
      <a
        href="/new-arrivals"
        class="transition-colors hover:text-[#10b981]"
        on:mouseenter={handleLeave}>New In</a
      >
    </li>
  </ul>
</nav>

{#if activeMenu}
  <div
    role="region"
    aria-label="Mega Menu"
    class="absolute top-full left-0 z-40 w-full border-b border-gray-200 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
    on:mouseenter={() => clearTimeout(timeout)}
    on:mouseleave={handleLeave}
  >
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {#if activeMenu === 'shop'}
        <div class="grid animate-[fade-in_0.2s_ease-out] grid-cols-4 gap-12">
          <div class="col-span-1">
            <h3
              class="mb-4 font-mono text-[10px] tracking-widest text-gray-400 uppercase"
            >
              Hardware Matrix
            </h3>
            <ul class="space-y-3 text-sm font-bold text-gray-900">
              <li>
                <a
                  href="/shop/audio"
                  class="transition-colors hover:text-[#10b981]"
                  >Audio & Acoustics</a
                >
              </li>
              <li>
                <a
                  href="/shop/displays"
                  class="transition-colors hover:text-[#10b981]"
                  >Displays & Monitors</a
                >
              </li>
              <li>
                <a
                  href="/shop/peripherals"
                  class="transition-colors hover:text-[#10b981]"
                  >Peripherals & Input</a
                >
              </li>
              <li>
                <a
                  href="/shop/components"
                  class="transition-colors hover:text-[#10b981]"
                  >Core Components</a
                >
              </li>
            </ul>
          </div>
          <div class="col-span-1">
            <h3
              class="mb-4 font-mono text-[10px] tracking-widest text-gray-400 uppercase"
            >
              Operations
            </h3>
            <ul class="space-y-3 text-sm font-bold text-gray-900">
              <li>
                <a href="/shop" class="transition-colors hover:text-[#10b981]"
                  >Shop All Inventory &rarr;</a
                >
              </li>
              <li>
                <a
                  href="/new-arrivals"
                  class="transition-colors hover:text-[#10b981]"
                  >Latest Deployments</a
                >
              </li>
              <li>
                <a
                  href="/sale"
                  class="text-red-600 transition-colors hover:text-red-700"
                  >Live Arbitrage Deals</a
                >
              </li>
            </ul>
          </div>
          <div
            class="group col-span-2 flex gap-6 border border-gray-200 bg-[#F9FAFB] p-6 transition-colors hover:border-black"
          >
            <div
              class="flex h-32 w-32 shrink-0 items-center justify-center bg-gray-100 font-mono text-[10px] text-gray-400"
            >
              IMG
            </div>
            <div class="flex flex-col justify-center">
              <span
                class="mb-2 inline-block w-max bg-black px-2 py-1 text-[9px] font-bold tracking-widest text-[#36f4a4] uppercase"
                >Deal of the Week</span
              >
              <h4
                class="mb-1 text-lg font-bold text-gray-900 transition-colors group-hover:text-[#10b981]"
              >
                Sony WH-1000XM5
              </h4>
              <div class="mb-4 flex items-baseline gap-2 font-mono">
                <span class="text-sm font-bold text-red-600">$249.00</span>
                <span class="text-[10px] text-gray-400 line-through"
                  >$399.00</span
                >
              </div>
              <a
                href="/shop/product/sony-xm5"
                class="w-max border-b border-black pb-0.5 text-xs font-bold tracking-widest text-black uppercase"
                >Secure Unit &rarr;</a
              >
            </div>
          </div>
        </div>
      {:else if activeMenu === 'brands'}
        <div class="animate-[fade-in_0.2s_ease-out]">
          <div
            class="mb-6 flex items-end justify-between border-b border-gray-200 pb-2"
          >
            <h3
              class="font-mono text-[10px] tracking-widest text-gray-400 uppercase"
            >
              Authorized Suppliers
            </h3>
            <a
              href="/brands"
              class="font-mono text-[10px] tracking-widest text-black uppercase transition-colors hover:text-[#10b981]"
              >View All Directory &rarr;</a
            >
          </div>
          <div class="grid grid-cols-4 gap-6 md:grid-cols-6">
            {#each ['Apple', 'Dell', 'Keychron', 'LG', 'Logitech', 'Razer', 'Samsung', 'Sony'] as brand}
              <a
                href={`/brands/${brand.toLowerCase()}`}
                class="border border-transparent bg-gray-50 py-2 text-center text-sm font-bold text-gray-900 transition-colors hover:border-gray-200 hover:bg-white hover:text-[#10b981]"
                >{brand}</a
              >
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>

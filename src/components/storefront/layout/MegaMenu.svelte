<script lang="ts">
  let activeMenu = $state<'shop' | 'brands' | null>(null);
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

  // KEYBOARD LOCK: Allow users to dismiss the menu instantly
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && activeMenu) {
      activeMenu = null;
    }
  }
</script>

<svelte:window onkeydown={handleKeyDown} />

<nav class="flex h-full" onmouseleave={handleLeave}>
  <ul
    class="flex h-full items-center space-x-8 text-xs font-bold tracking-widest text-content uppercase"
  >
    <li class="flex h-full items-center">
      <a
        href="/"
        class="transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        onmouseenter={handleLeave}
        onfocus={handleLeave}>Home</a
      >
    </li>

    <li
      class="flex h-full items-center border-b-2 transition-colors {activeMenu ===
      'shop'
        ? 'border-brand text-brand'
        : 'border-transparent'}"
    >
      <button
        class="flex h-full items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        onmouseenter={() => handleEnter('shop')}
        onfocus={() => handleEnter('shop')}
        aria-expanded={activeMenu === 'shop'}
        aria-haspopup="true"
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
        ? 'border-brand text-brand'
        : 'border-transparent'}"
    >
      <button
        class="flex h-full items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        onmouseenter={() => handleEnter('brands')}
        onfocus={() => handleEnter('brands')}
        aria-expanded={activeMenu === 'brands'}
        aria-haspopup="true"
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
        href="/deals"
        class="text-brand-alert transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-alert rounded-sm"
        onmouseenter={handleLeave}
        onfocus={handleLeave}>Deals</a
      >
    </li>
    <li class="flex h-full items-center">
      <a
        href="/new-arrivals"
        class="transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        onmouseenter={handleLeave}
        onfocus={handleLeave}>New In</a
      >
    </li>
  </ul>
</nav>

{#if activeMenu}
  <div
    role="region"
    aria-label="Mega Menu Categories"
    class="absolute top-full left-0 z-40 w-full border-b border-outline bg-base shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
    onmouseenter={() => clearTimeout(timeout)}
    onmouseleave={handleLeave}
  >
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {#if activeMenu === 'shop'}
        <div class="grid animate-[fade-in_0.2s_ease-out] grid-cols-4 gap-12">
          <div class="col-span-1">
            <h3
              class="mb-4 font-mono text-[10px] tracking-widest text-content-muted uppercase"
            >
              Hardware Matrix
            </h3>
            <ul class="space-y-3 text-sm font-bold text-content">
              <li>
                <a
                  href="/shop/audio"
                  class="block transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
                  >Audio & Acoustics</a
                >
              </li>
              <li>
                <a
                  href="/shop/displays"
                  class="block transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
                  >Displays & Monitors</a
                >
              </li>
              <li>
                <a
                  href="/shop/peripherals"
                  class="block transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
                  >Peripherals & Input</a
                >
              </li>
              <li>
                <a
                  href="/shop/components"
                  class="block transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
                  >Core Components</a
                >
              </li>
            </ul>
          </div>
          <div class="col-span-1">
            <h3
              class="mb-4 font-mono text-[10px] tracking-widest text-content-muted uppercase"
            >
              Operations
            </h3>
            <ul class="space-y-3 text-sm font-bold text-content">
              <li>
                <a
                  href="/shop"
                  class="block transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
                  >Shop All Inventory &rarr;</a
                >
              </li>
              <li>
                <a
                  href="/new-arrivals"
                  class="block transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
                  >Latest Deployments</a
                >
              </li>
              <li>
                <a
                  href="/deals"
                  class="block text-brand-alert transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-alert rounded-sm"
                  >Live Arbitrage Deals</a
                >
              </li>
            </ul>
          </div>
          <div
            class="group col-span-2 flex gap-6 border border-outline bg-surface p-6 transition-colors hover:border-content"
          >
            <div
              class="flex h-32 w-32 shrink-0 items-center justify-center bg-base font-mono text-[10px] text-content-muted"
            >
              IMG
            </div>
            <div class="flex flex-col justify-center">
              <span
                class="mb-2 inline-block w-max bg-content px-2 py-1 text-[9px] font-bold tracking-widest text-brand uppercase"
                >Deal of the Week</span
              >
              <h4
                class="mb-1 text-lg font-bold text-content transition-colors group-hover:text-brand"
              >
                Sony WH-1000XM5
              </h4>
              <div class="mb-4 flex items-baseline gap-2 font-mono">
                <span class="text-sm font-bold text-brand-alert">$249.00</span>
                <span class="text-[10px] text-content-muted line-through"
                  >$399.00</span
                >
              </div>
              <a
                href="/shop/product/sony-xm5"
                class="w-max border-b border-content pb-0.5 text-xs font-bold tracking-widest text-content uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
                >Secure Unit &rarr;</a
              >
            </div>
          </div>
        </div>
      {:else if activeMenu === 'brands'}
        <div class="animate-[fade-in_0.2s_ease-out]">
          <div
            class="mb-6 flex items-end justify-between border-b border-outline pb-2"
          >
            <h3
              class="font-mono text-[10px] tracking-widest text-content-muted uppercase"
            >
              Authorized Suppliers
            </h3>
            <a
              href="/brands"
              class="font-mono text-[10px] tracking-widest text-content uppercase transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
              >View All Directory &rarr;</a
            >
          </div>
          <div class="grid grid-cols-4 gap-6 md:grid-cols-6">
            {#each ['Apple', 'Dell', 'Keychron', 'LG', 'Logitech', 'Razer', 'Samsung', 'Sony'] as brand}
              <a
                href={`/brands/${brand.toLowerCase()}`}
                class="block border border-transparent bg-surface py-2 text-center text-sm font-bold text-content transition-colors hover:border-outline hover:bg-base hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
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
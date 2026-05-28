<script>
  import { cart } from '../../stores/cart.svelte.ts';
  import { fade } from 'svelte/transition';

  // UX State Management
  let isCheckingOut = $state(false);
  let activeToast = $state('');
  let toastTimeout;

  function triggerToast(message) {
    activeToast = message;
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      activeToast = '';
    }, 3000);
  }

  function handleUpdateQuantity(id, currentQty, newQty, stock) {
    if (newQty > stock) {
      triggerToast(`Maximum allocated inventory (${stock} units) reached.`);
      return;
    }
    cart.updateQuantity(id, newQty);
  }

  async function handleCheckout() {
    isCheckingOut = true;

    try {
      // Allow Edge KV to complete final sync and transition securely
      await new Promise((resolve) => setTimeout(resolve, 600));
      window.location.href = '/checkout';
    } catch (e) {
      isCheckingOut = false;
      triggerToast('Checkout initialization failed. Please try again.');
    }
  }
</script>

{#if activeToast}
  <div
    transition:fade={{ duration: 150 }}
    class="bg-brand-alert/10 border-brand-alert/30 text-brand-alert fixed right-6 bottom-6 z-50 flex items-center gap-2 border px-4 py-3 font-mono text-[10px] tracking-widest uppercase shadow-[0_0_20px_rgba(239,68,68,0.15)]"
  >
    <svg
      class="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      /></svg
    >
    {activeToast}
  </div>
{/if}

{#if cart.items.length === 0}
  <div
    class="flex flex-col items-center justify-center border border-outline bg-surface py-24 text-center"
  >
    <svg
      class="mb-6 h-16 w-16 text-content-muted/20"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1"
      stroke="currentColor"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
      /></svg
    >
    <h2 class="mb-2 text-2xl font-bold tracking-tight text-content">
      Your cart is empty.
    </h2>
    <p class="mb-8 font-light text-content-muted">
      Your cart is empty. Browse our store to find something you'll love.
    </p>
    <a
      href="/shop"
      class="bg-brand px-8 py-4 text-sm font-bold tracking-widest text-brand-dark uppercase shadow-[0_10px_20px_-10px_var(--color-brand)] transition-all duration-300 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none rounded-sm"
    >
      Browse Catalog
    </a>
  </div>
{:else}
  <div class="grid grid-cols-1 gap-12 lg:grid-cols-12">
    <div class="space-y-6 lg:col-span-8">
      <div
        class="hidden grid-cols-12 gap-4 border-b border-outline pb-4 font-mono text-xs tracking-widest text-content-muted uppercase md:grid"
      >
        <div class="col-span-6">Product</div>
        <div class="col-span-3 text-center">Quantity</div>
        <div class="col-span-3 text-right">Total</div>
      </div>

      {#each cart.items as item (item.id)}
        <div
          class="group grid grid-cols-1 items-center gap-4 border-b border-outline/50 py-4 md:grid-cols-12"
        >
          <div class="col-span-1 flex gap-4 md:col-span-6">
            <div
              class="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden border border-outline bg-surface"
            >
              <span class="font-mono text-[10px] text-content-muted/20"
                >{item.image || 'Image'}</span
              >
            </div>
            <div class="flex flex-col justify-center">
              <span
                class="mb-1 font-mono text-[10px] tracking-widest text-content-muted uppercase"
                >{item.brand}</span
              >
              <a
                href={`/shop/product/${item.productId}`}
                class="line-clamp-2 text-sm leading-snug font-medium text-content transition-colors hover:text-brand focus-visible:ring-1 focus-visible:ring-brand focus-visible:outline-none rounded-sm"
                >{item.name}</a
              >
              <button
                onclick={() => cart.removeItem(item.id)}
                class="mt-2 w-fit text-left font-mono text-xs tracking-wider text-brand-alert/80 uppercase transition-colors hover:text-brand-alert focus-visible:underline focus-visible:outline-none rounded-sm"
                >Remove</button
              >
            </div>
          </div>

          <div
            class="col-span-1 mt-2 flex items-center md:col-span-3 md:mt-0 md:justify-center"
          >
            <div
              class="flex items-center border border-outline bg-base"
            >
              <button
                onclick={() =>
                  handleUpdateQuantity(
                    item.id,
                    item.qty,
                    item.qty - 1,
                    item.stock
                  )}
                class="px-3 py-1.5 text-content-muted transition-colors hover:text-brand focus-visible:bg-surface focus-visible:outline-none disabled:opacity-30 rounded-sm"
                disabled={item.qty <= 1}>-</button
              >
              <span class="w-8 text-center font-mono text-sm text-content"
                >{item.qty}</span
              >
              <button
                onclick={() =>
                  handleUpdateQuantity(
                    item.id,
                    item.qty,
                    item.qty + 1,
                    item.stock
                  )}
                class="px-3 py-1.5 text-content-muted transition-colors hover:text-brand focus-visible:bg-surface focus-visible:outline-none disabled:opacity-30 rounded-sm"
                disabled={item.qty >= item.stock}>+</button
              >
            </div>
            {#if item.qty >= item.stock}
              <span
                class="ml-3 font-mono text-[10px] tracking-widest text-brand-alert uppercase md:hidden"
                >Max Stock</span
              >
            {/if}
          </div>

          <div
            class="col-span-1 mt-2 flex items-center justify-between md:col-span-3 md:mt-0 md:justify-end"
          >
            <span
              class="font-mono text-xs text-content-muted uppercase md:hidden"
              >Total:</span
            >
            <div class="text-right">
              <span
                class="block font-mono text-lg font-bold tracking-tight text-brand"
                >${(item.price * item.qty).toFixed(2)}</span
              >
              <span
                class="mt-0.5 block font-mono text-[10px] text-content-muted uppercase line-through"
                >Retail: ${(item.was * item.qty).toFixed(2)}</span
              >
            </div>
          </div>
        </div>
      {/each}
    </div>

    <div class="lg:col-span-4">
      <div
        class="sticky top-28 border border-outline bg-surface p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] md:p-8"
      >
        <h2 class="mb-6 text-lg font-bold tracking-tight text-content">
          Order Summary
        </h2>

        <div class="mb-6 space-y-4 border-b border-outline pb-6 text-sm">
          <div class="flex justify-between text-content-muted">
            <span>Subtotal</span>
            <span class="font-mono text-content">${cart.subtotal.toFixed(2)}</span
            >
          </div>
          <div class="flex justify-between text-content-muted">
            <span>Priority Shipping</span>
            <span
              class="font-mono text-xs font-bold tracking-wider text-brand uppercase"
              >Free</span
            >
          </div>
          <div class="flex justify-between font-bold text-brand">
            <span>Total Savings</span>
            <span class="font-mono">-${cart.savings.toFixed(2)}</span>
          </div>
        </div>

        <div class="mb-8 flex items-end justify-between">
          <span class="text-base font-medium text-content">Total</span>
          <span class="font-mono text-3xl font-bold tracking-tighter text-content"
            >${cart.subtotal.toFixed(2)}</span
          >
        </div>

        <button
          onclick={handleCheckout}
          disabled={isCheckingOut}
          class="block flex w-full items-center justify-center gap-2 bg-brand py-4 text-center text-sm font-bold tracking-widest text-brand-dark uppercase shadow-[0_10px_20px_-10px_var(--color-brand)] transition-all duration-300 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-content focus-visible:outline-none disabled:cursor-wait disabled:opacity-70 rounded-sm"
        >
          {#if isCheckingOut}
            <svg
              class="mr-2 -ml-1 h-4 w-4 animate-spin text-brand-dark"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Securing...
          {:else}
            Proceed to Checkout
          {/if}
        </button>

        <p
          class="mt-6 text-center font-mono text-[10px] tracking-[0.1em] text-content-muted uppercase"
        >
          No applicable tax (Wyoming LLC)
        </p>
      </div>
    </div>
  </div>
{/if}

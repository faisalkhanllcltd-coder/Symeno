<script lang="ts">
  import { onMount } from 'svelte';

  // We lazily load the cart store so it only runs on the client
  let cartItems = $state<any[]>([]);
  let isLoaded = $state(false);

  let subtotal = $derived(
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );
  let shipping = $derived(subtotal > 150 ? 0 : 15);
  let total = $derived(subtotal + shipping);

  onMount(async () => {
    const { cart } = await import('../../../stores/cart.svelte');
    cartItems = cart.items;
    isLoaded = true;
  });
</script>

<div class="sticky top-24 border border-outline bg-base p-6 sm:p-8">
  <h2
    class="mb-6 border-b border-outline pb-4 font-mono text-sm font-bold tracking-widest text-content uppercase"
  >
    Acquisition Summary
  </h2>

  {#if !isLoaded}
    <div class="animate-pulse font-mono text-[10px] text-content-muted">
      Synchronizing cart telemetry...
    </div>
  {:else if cartItems.length === 0}
    <div
      class="py-8 text-center font-mono text-[10px] tracking-widest text-content-muted uppercase"
    >
      Cart is empty.
    </div>
  {:else}
    <div class="mb-6 max-h-[40vh] space-y-4 overflow-y-auto pr-2">
      {#each cartItems as item}
        <div class="group flex items-start gap-4">
          <div
            class="flex h-16 w-16 shrink-0 items-center justify-center border border-outline bg-surface"
          >
            <span class="font-mono text-[8px] text-content-muted">IMG</span>
          </div>
          <div class="min-w-0 flex-1 pt-1">
            <h4 class="truncate text-xs font-bold text-content">{item.title}</h4>
            <div class="mt-1 flex items-center justify-between">
              <span class="font-mono text-[10px] text-content-muted"
                >Qty: {item.quantity}</span
              >
              <span class="font-mono text-[10px] text-brand"
                >${(item.price * item.quantity).toFixed(2)}</span
              >
            </div>
          </div>
        </div>
      {/each}
    </div>

    <div
      class="space-y-3 border-t border-outline pt-6 font-mono text-[10px] tracking-widest uppercase"
    >
      <div class="flex justify-between text-content-muted">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div class="flex justify-between text-content-muted">
        <span>Secure Shipping</span>
        <span
          >{shipping === 0 ? 'COMPLIMENTARY' : `$${shipping.toFixed(2)}`}</span
        >
      </div>
    </div>

    <div
      class="mt-6 flex items-end justify-between border-t border-outline pt-6"
    >
      <span
        class="font-mono text-xs font-bold tracking-widest text-content uppercase"
        >Total Due</span
      >
      <div class="text-right">
        <span class="font-mono text-2xl font-bold text-brand"
          >${total.toFixed(2)}</span
        >
        <p class="mt-1 font-mono text-[9px] text-content-muted">Includes VAT</p>
      </div>
    </div>
  {/if}
</div>

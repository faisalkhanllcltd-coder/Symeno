<script lang="ts">
  import { onMount } from 'svelte';

  // We lazily load the cart store so it only runs on the client
  let cartItems = $state<any[]>([]);
  let isLoaded = $state(false);

  let subtotal = $derived(cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0));
  let shipping = $derived(subtotal > 150 ? 0 : 15);
  let total = $derived(subtotal + shipping);

  onMount(async () => {
    const { cart } = await import('../../../stores/cart.svelte');
    cartItems = cart.items;
    isLoaded = true;
  });
</script>

<div class="bg-[#111318] border border-white/10 p-6 sm:p-8 sticky top-24">
  <h2 class="text-sm font-bold text-white uppercase tracking-widest font-mono border-b border-white/10 pb-4 mb-6">Acquisition Summary</h2>
  
  {#if !isLoaded}
    <div class="text-[10px] text-white/50 font-mono animate-pulse">Synchronizing cart telemetry...</div>
  {:else if cartItems.length === 0}
    <div class="text-[10px] text-white/50 font-mono uppercase tracking-widest text-center py-8">Cart is empty.</div>
  {:else}
    <div class="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
      {#each cartItems as item}
        <div class="flex items-start gap-4 group">
          <div class="w-16 h-16 bg-[#1A1D23] border border-white/5 flex items-center justify-center shrink-0">
            <span class="text-[8px] text-white/30 font-mono">IMG</span>
          </div>
          <div class="flex-1 min-w-0 pt-1">
            <h4 class="text-xs font-bold text-white truncate">{item.title}</h4>
            <div class="flex justify-between items-center mt-1">
              <span class="text-[10px] font-mono text-white/50">Qty: {item.quantity}</span>
              <span class="text-[10px] font-mono text-[#36f4a4]">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
        </div>
      {/each}
    </div>

    <div class="space-y-3 pt-6 border-t border-white/10 text-[10px] font-mono uppercase tracking-widest">
      <div class="flex justify-between text-white/50">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div class="flex justify-between text-white/50">
        <span>Secure Shipping</span>
        <span>{shipping === 0 ? 'COMPLIMENTARY' : `$${shipping.toFixed(2)}`}</span>
      </div>
    </div>

    <div class="flex justify-between items-end pt-6 mt-6 border-t border-white/10">
      <span class="text-xs font-bold text-white uppercase tracking-widest font-mono">Total Due</span>
      <div class="text-right">
        <span class="text-2xl font-bold text-[#36f4a4] font-mono">${total.toFixed(2)}</span>
        <p class="text-[9px] text-white/30 mt-1 font-mono">Includes VAT</p>
      </div>
    </div>
  {/if}
</div>
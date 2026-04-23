<script lang="ts">
  import { cart } from '../../../stores/cart.svelte';
</script>

<button 
  onclick={() => cart.toggleCart()} 
  class="relative p-2 text-content-muted hover:text-brand transition-colors focus:outline-none group"
  aria-label="Open Cart"
>
  <svg class="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
  
  {#if cart.totalItems > 0}
    <span class="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-brand-dark bg-brand rounded-full transform translate-x-1/4 -translate-y-1/4 font-mono shadow-[0_0_10px_rgba(54,244,164,0.3)]">
      {cart.totalItems}
    </span>
  {/if}
</button>
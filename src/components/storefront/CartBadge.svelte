<script lang="ts">
  import { cart } from '../../stores/cart.svelte.ts';
</script>

<a href="/cart" class="text-content-muted hover:text-brand transition-colors relative group hover:scale-110 duration-300">
  <span class="sr-only">Cart</span>
  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
  </svg>
  
  {#if cart.itemCount > 0}
    <span class="absolute -top-1.5 -right-2 bg-brand text-brand-dark text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center font-mono shadow-[0_0_10px_rgba(54,244,164,0.4)]">
      {cart.itemCount}
    </span>
  {/if}
</a>
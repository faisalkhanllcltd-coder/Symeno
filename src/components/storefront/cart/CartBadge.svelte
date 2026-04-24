<script lang="ts">
  import { cart } from '../../../stores/cart.svelte';
</script>

<button
  onclick={() => cart.toggleCart()}
  class="text-content-muted hover:text-brand group relative p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
  aria-label="Open Cart"
>
  <svg
    class="h-6 w-6 transition-transform group-hover:scale-110"        
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>

  {#if cart.totalItems > 0}
    <span
      class="text-brand-dark bg-brand absolute top-0 right-0 inline-flex translate-x-1/4 -translate-y-1/4 transform items-center justify-center rounded-full px-1.5 py-0.5 font-mono text-[10px] leading-none font-bold shadow-[0_0_10px_var(--color-brand)]"
    >
      {cart.totalItems}
    </span>
  {/if}
</button>
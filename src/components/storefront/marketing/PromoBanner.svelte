<script lang="ts">
  let isVisible = $state(true);
</script>

{#if isVisible}
  <div
    class="animate-fade-in relative z-50 flex items-center justify-between bg-brand px-4 py-2 text-brand-dark"
  >
    <div class="flex flex-1 items-center justify-center gap-3">
      <span
        class="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-dark shadow-[0_0_8px_rgba(0,56,34,0.5)]"
      ></span>
      <span
        class="truncate text-[10px] font-bold tracking-widest uppercase sm:text-xs"
      >
        Global Operations Active: Free logistics on UAE drops over $500 AED
      </span>
    </div>
    <button
      onclick={() => (isVisible = false)}
      class="ml-4 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark rounded-sm"
      aria-label="Dismiss"
    >
      <svg
        class="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
{/if}

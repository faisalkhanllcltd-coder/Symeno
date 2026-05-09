<script lang="ts">
  // Accept live edge data. We support both plain strings or database row objects.
  let { brands = [] } = $props<{ brands: string[] | { name: string }[] }>();

  // Normalize the payload dynamically so the marquee never breaks
  let displayBrands = $derived(
    brands.map((b) => (typeof b === 'string' ? b : b.name))
  );
</script>

{#if displayBrands.length > 0}
  <div class="flex w-full overflow-hidden border-y border-outline bg-base py-4">
    <div class="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap">
      {/* Tripled to ensure a seamless infinite scroll effect */}
      {#each [...displayBrands, ...displayBrands, ...displayBrands] as brand}
        <span
          class="mx-8 cursor-default font-mono text-sm font-bold tracking-[0.2em] text-content-muted uppercase transition-colors hover:text-content"
        >
          {brand}
        </span>
      {/each}
    </div>
  </div>
{/if}

<style>
  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-33.33%);
    }
  }
</style>
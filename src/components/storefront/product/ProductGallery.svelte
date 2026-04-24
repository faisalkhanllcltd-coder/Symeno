<script lang="ts">
  let { images = [], alt = 'Product Image' } = $props<{
    images?: string[];
    alt?: string;
  }>();

  let activeIndex = $state(0);
</script>

<div class="flex flex-col gap-4 md:flex-row-reverse">   
  <div
    class="group relative flex aspect-square flex-1 items-center justify-center overflow-hidden border border-outline bg-base transition-colors duration-300"
  >
    {#if images.length > 0}
      <img
        src={images[activeIndex]}
        {alt}
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    {:else}
      <span class="font-mono text-xs tracking-widest text-content-muted uppercase"
        >Image Unavailable</span
      >
    {/if}
  </div>

  {#if images.length > 1}
    <div
      class="no-scrollbar flex shrink-0 gap-4 overflow-x-auto md:w-24 md:flex-col"
    >
      {#each images as img, i}
        <button
          onclick={() => (activeIndex = i)}
          class="h-20 w-20 shrink-0 border bg-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand md:h-24 md:w-full {activeIndex ===
          i
            ? 'border-brand'
            : 'border-outline hover:border-content-muted'}" 
        >
          <img
            src={img}
            {alt}
            class="h-full w-full object-cover opacity-80 transition-opacity hover:opacity-100"
          />
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>

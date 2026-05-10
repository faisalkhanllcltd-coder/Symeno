<script lang="ts">
  let { 
    images = [], 
    name = 'Product Image',
    activeImage = ''
  } = $props<{
    images: string[];
    name: string;
    activeImage?: string;
  }>();

  let activeIndex = $state(0);

  $effect(() => {
    if (activeImage) {
      const idx = images.indexOf(activeImage);
      if (idx !== -1) activeIndex = idx;
    }
  });

  function setIndex(index: number) {
    activeIndex = index;
  }
</script>

<div class="flex flex-col-reverse lg:flex-row gap-4 w-full h-full">
  {#if images.length > 1}
    <div class="custom-scrollbar flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:w-20 shrink-0 pb-2 lg:pb-0 lg:pr-2 lg:max-h-[600px]">
      {#each images as img, i}
        <button
          onclick={() => setIndex(i)}
          class="bg-surface relative aspect-square w-16 lg:w-full shrink-0 overflow-hidden rounded-xl border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand
          {activeIndex === i ? 'border-brand ring-2 ring-brand/20' : 'border-transparent hover:border-outline opacity-70 hover:opacity-100'}"
          aria-label={`Select view ${i + 1}`}
        >
          <img src={img} alt={`${name} - Thumbnail ${i + 1}`} class="h-full w-full object-contain p-1.5" loading="lazy" />
        </button>
      {/each}
    </div>
  {/if}

  <div class="bg-surface border-outline/50 relative aspect-square w-full flex-1 overflow-hidden rounded-xl border shadow-sm p-4 sm:p-8 flex items-center justify-center">
    {#if images.length > 0}
      <img
        src={images[activeIndex]}
        alt={`${name} - View ${activeIndex + 1}`}
        class="h-full w-full object-contain transition-opacity duration-300 drop-shadow-sm"
        loading="eager"
        decoding="sync"
      />
    {:else}
      <div class="flex h-full w-full items-center justify-center">
        <span class="text-content-muted font-mono text-xs tracking-widest uppercase">No Image Available</span>
      </div>
    {/if}
  </div>
</div>

<style>
  .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--color-outline); border-radius: 4px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--color-brand); }
</style>
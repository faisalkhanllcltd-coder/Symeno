<script lang="ts">
  let { 
    images = [], 
    title = 'Product Image',
    activeImage = ''
  } = $props<{
    images: string[];
    title: string;
    activeImage?: string;
  }>();

  let activeIndex = $state(0);

  // If a parent component changes the activeImage (e.g., color variant changed), update index
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

<div class="flex flex-col gap-4 sticky top-24">
  <!-- Main Display -->
  <div class="bg-base border-outline relative aspect-square w-full overflow-hidden rounded-xl border">
    {#if images.length > 0}
      <img
        src={images[activeIndex]}
        alt={`${title} - View ${activeIndex + 1}`}
        class="h-full w-full object-cover transition-opacity duration-500"
        loading="eager"
        decoding="sync"
      />
    {:else}
      <div class="flex h-full w-full items-center justify-center">
        <span class="text-content-muted font-mono text-xs tracking-widest uppercase">No Image Available</span>
      </div>
    {/if}
    
    {#if images.length > 1}
      <div class="absolute bottom-4 right-4 bg-surface/80 border-outline rounded border px-2 py-1 backdrop-blur-md">
        <span class="text-content font-mono text-[10px] font-bold">{activeIndex + 1} / {images.length}</span>
      </div>
    {/if}
  </div>

  <!-- Thumbnails -->
  {#if images.length > 1}
    <div class="custom-scrollbar flex w-full gap-3 overflow-x-auto pb-2">
      {#each images as img, i}
        <button
          onclick={() => setIndex(i)}
          class="bg-base border-outline relative aspect-square w-20 shrink-0 overflow-hidden rounded-md border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand
          {activeIndex === i ? 'ring-brand ring-2 ring-offset-1 ring-offset-surface' : 'hover:opacity-80'}"
          aria-label={`Select view ${i + 1}`}
        >
          <img src={img} alt="" class="h-full w-full object-cover" loading="lazy" />
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .custom-scrollbar::-webkit-scrollbar { height: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: var(--color-base); }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--color-outline); border-radius: 4px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--color-brand); }
</style>

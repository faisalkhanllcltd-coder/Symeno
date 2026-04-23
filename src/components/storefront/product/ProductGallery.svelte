<script lang="ts">
  export let images: string[] = [];
  export let alt: string = "Product Image";
  
  let activeIndex = 0;
</script>

<div class="flex flex-col md:flex-row-reverse gap-4">
  <div class="flex-1 bg-[#F9FAFB] border border-gray-200 aspect-square flex items-center justify-center relative overflow-hidden group">
    {#if images.length > 0}
      <img src={images[activeIndex]} {alt} class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
    {:else}
      <span class="text-xs font-mono text-gray-400 uppercase tracking-widest">Image Unavailable</span>
    {/if}
  </div>

  {#if images.length > 1}
    <div class="flex md:flex-col gap-4 overflow-x-auto md:w-24 shrink-0 no-scrollbar">
      {#each images as img, i}
        <button 
          on:click={() => activeIndex = i}
          class="w-20 h-20 md:w-full md:h-24 bg-[#F9FAFB] border transition-colors focus:outline-none shrink-0 {activeIndex === i ? 'border-black' : 'border-gray-200 hover:border-gray-400'}"
        >
          <img src={img} {alt} class="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>

<script lang="ts">
  export let type: 'card' | 'text' | 'image' = 'text';
  export let count: number = 1;
</script>

<div class="space-y-4 w-full">
  {#each Array(count) as _}
    {#if type === 'card'}
      <div class="w-full h-32 bg-gray-100 animate-pulse border border-gray-200"></div>
    {:else if type === 'image'}
      <div class="w-full aspect-square bg-gray-100 animate-pulse border border-gray-200"></div>
    {:else}
      <div class="space-y-2">
        <div class="h-4 bg-gray-100 animate-pulse w-3/4"></div>
        <div class="h-4 bg-gray-100 animate-pulse w-1/2"></div>
      </div>
    {/if}
  {/each}
</div>

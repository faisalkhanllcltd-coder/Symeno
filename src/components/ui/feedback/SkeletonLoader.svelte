<script lang="ts">
  let { type = 'text', count = 1 } = $props<{
    type?: 'card' | 'text' | 'image';
    count?: number;
  }>();
</script>

<div class="w-full space-y-4">
  {#each Array(count) as _}
    {#if type === 'card'}
      <div
        class="h-32 w-full animate-pulse border border-outline bg-surface"
      ></div>
    {:else if type === 'image'}
      <div
        class="aspect-square w-full animate-pulse border border-outline bg-surface"
      ></div>
    {:else}
      <div class="space-y-2">
        <div class="h-4 w-3/4 animate-pulse bg-surface border border-outline"></div>
        <div class="h-4 w-1/2 animate-pulse bg-surface border border-outline"></div>
      </div>
    {/if}
  {/each}
</div>

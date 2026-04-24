<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    title = 'No Data Found',
    message = 'There are no records matching your criteria.',
    actionLabel = '',
    icon,
    onclick,
  } = $props<{
    title?: string;
    message?: string;
    actionLabel?: string;
    icon?: Snippet;
    onclick?: () => void;
  }>();
</script>

<div
  class="flex flex-col items-center justify-center border border-outline bg-surface p-12 text-center transition-colors duration-300"      
>
  <div
    class="mb-6 flex h-16 w-16 items-center justify-center border border-outline bg-base"
  >
    {#if icon}
      {@render icon()}
    {:else}
      <svg
        class="h-6 w-6 text-content-muted opacity-50"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
        /></svg
      >
    {/if}
  </div>
  <h3
    class="mb-2 font-mono text-sm font-bold tracking-widest text-content uppercase"
  >
    {title}
  </h3>
  <p class="mb-6 max-w-sm font-mono text-xs text-content-muted">{message}</p>

  {#if actionLabel}
    <button
      {onclick}
      class="border border-brand/30 bg-brand/5 px-4 py-2 font-mono text-[10px] tracking-widest text-brand uppercase transition-colors hover:border-brand hover:text-brand-dark hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
    >
      {actionLabel}
    </button>
  {/if}
</div>

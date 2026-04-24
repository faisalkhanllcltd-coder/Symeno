<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    title = '',
    subtitle = '',
    class: className = '',
    header,
    footer,
    children
  }: {
    title?: string;
    subtitle?: string;
    class?: string;
    header?: Snippet;
    footer?: Snippet;
    children?: Snippet;
  } = $props();
</script>

<div class="flex flex-col border border-outline bg-surface {className}">
  {#if title || subtitle || header}
    <div class="flex items-center justify-between border-b border-outline bg-base/50 p-4">
      <div>
        {#if title}
          <h3 class="font-mono text-xs font-bold tracking-widest text-content uppercase">{title}</h3>
        {/if}
        {#if subtitle}
          <p class="mt-1 font-mono text-[10px] text-content-muted">{subtitle}</p>
        {/if}
      </div>
      {#if header}
        {@render header()}
      {/if}
    </div>
  {/if}

  <div class="flex-1 p-4">
    {#if children}
      {@render children()}
    {/if}
  </div>

  {#if footer}
    <div class="border-t border-outline bg-base/50 p-4">
      {@render footer()}
    </div>
  {/if}
</div>
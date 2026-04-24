<script lang="ts">
  let { initials, size = 'md', fallbackImage = '' } = $props<{
    initials: string;
    size?: 'sm' | 'md' | 'lg';
    fallbackImage?: string;
  }>();

  const sizes = {
    sm: 'w-6 h-6 text-[9px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-16 h-16 text-lg',
  };
</script>

<div
  class="{sizes[
    size
  ]} flex shrink-0 items-center justify-center overflow-hidden border border-outline bg-base font-mono font-bold text-content uppercase transition-colors"
>
  {#if fallbackImage}
    <img
      src={fallbackImage}
      alt={initials}
      class="h-full w-full object-cover"
    />
  {:else}
    {initials.substring(0, 2)}
  {/if}
</div>

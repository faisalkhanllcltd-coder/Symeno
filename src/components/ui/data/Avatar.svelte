<script lang="ts">
  export let initials: string;
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let fallbackImage: string = '';

  const sizes = {
    sm: 'w-6 h-6 text-[9px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-16 h-16 text-lg'
  };
</script>

<div class="{sizes[size]} bg-[#111318] border border-gray-200 flex items-center justify-center text-gray-900 font-bold font-mono uppercase shrink-0 overflow-hidden">
  {#if fallbackImage}
    <img src={fallbackImage} alt={initials} class="w-full h-full object-cover" />
  {:else}
    {initials.substring(0, 2)}
  {/if}
</div>

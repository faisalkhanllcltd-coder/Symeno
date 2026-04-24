<script lang="ts">
  const brands = [
    'SONY',
    'LOGITECH',
    'LG',
    'KEYCHRON',
    'SAMSUNG',
    'APPLE',
    'RAZER',
    'DELL',
  ];
</script>

<div class="flex w-full overflow-hidden border-y border-gray-800 bg-black py-4">
  <div class="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap">
    {#each [...brands, ...brands, ...brands] as brand}
      <span
        class="mx-8 cursor-default font-mono text-sm font-bold tracking-[0.2em] text-gray-500 uppercase transition-colors hover:text-white"
        >{brand}</span
      >
    {/each}
  </div>
</div>

<style>
  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-33.33%);
    }
  }
</style>

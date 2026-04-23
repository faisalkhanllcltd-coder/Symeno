<script lang="ts">
  const brands = ['SONY', 'LOGITECH', 'LG', 'KEYCHRON', 'SAMSUNG', 'APPLE', 'RAZER', 'DELL'];
</script>

<div class="w-full overflow-hidden bg-black py-4 border-y border-gray-800 flex">
  <div class="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap">
    {#each [...brands, ...brands, ...brands] as brand}
      <span class="mx-8 text-sm font-bold text-gray-500 uppercase tracking-[0.2em] font-mono hover:text-white transition-colors cursor-default">{brand}</span>
    {/each}
  </div>
</div>

<style>
  @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
</style>

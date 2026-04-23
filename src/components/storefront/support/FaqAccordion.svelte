<script lang="ts">
  export let items: { question: string, answer: string }[] = [];
  let openIndex: number | null = null;

  function toggle(index: number) {
    openIndex = openIndex === index ? null : index;
  }
</script>

<div class="border-t border-gray-200">
  {#each items as item, i}
    <div class="border-b border-gray-200">
      <button 
        on:click={() => toggle(i)}
        class="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
      >
        <span class="text-sm font-bold uppercase tracking-widest text-gray-900 group-hover:text-[#10b981] transition-colors">{item.question}</span>
        <span class="text-gray-400 transform transition-transform duration-200 {openIndex === i ? 'rotate-180' : ''}">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
        </span>
      </button>
      {#if openIndex === i}
        <div class="pb-8 animate-[fade-in_0.2s_ease-out]">
          <p class="text-sm text-gray-600 font-light leading-relaxed max-w-2xl">{item.answer}</p>
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  @keyframes fade-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
</style>

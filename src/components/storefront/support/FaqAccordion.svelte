<script lang="ts">
  let { items = [] } = $props<{
    items: { question: string; answer: string }[];
  }>();
  let openIndex = $state<number | null>(null);

  function toggle(index: number) {
    openIndex = openIndex === index ? null : index;
  }
</script>

<div class="border-t border-outline">
  {#each items as item, i}
    <div class="border-b border-outline">
      <button
        onclick={() => toggle(i)}
        class="group flex w-full items-center justify-between py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      >
        <span
          class="text-sm font-bold tracking-widest text-content uppercase transition-colors group-hover:text-brand"
          >{item.question}</span
        >
        <span
          class="transform text-content-muted transition-transform duration-200 {openIndex ===
          i
            ? 'rotate-180'
            : ''}"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            /></svg
          >
        </span>
      </button>
      {#if openIndex === i}
        <div class="animate-[fade-in_0.2s_ease-out] pb-8">
          <p class="max-w-2xl text-sm leading-relaxed font-light text-content-muted">
            {item.answer}
          </p>
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>

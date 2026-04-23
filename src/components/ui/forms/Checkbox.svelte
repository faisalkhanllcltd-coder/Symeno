<script lang="ts">
  export let id: string;
  export let checked: boolean = false;
  export let label: string;
  export let required: boolean = false;
</script>

<div class="flex items-start">
  <div class="flex items-center h-5">
    <input 
      {id} 
      type="checkbox" 
      bind:checked
      {required}
      class="w-4 h-4 bg-[#1A1D23] border border-white/20 rounded-none checked:bg-[#36f4a4] checked:border-[#36f4a4] focus:ring-1 focus:ring-[#36f4a4]/50 focus:ring-offset-0 focus:outline-none transition-colors cursor-pointer appearance-none flex items-center justify-center relative before:content-[''] before:absolute before:w-2 before:h-2 before:bg-black before:scale-0 checked:before:scale-100 before:transition-transform" 
    />
  </div>
  <div class="ml-3 text-sm">
    <label for={id} class="font-medium text-white/80 cursor-pointer select-none">
      {label} {#if required}<span class="text-rose-500">*</span>{/if}
    </label>
    {#if $$slots.description}
      <p class="text-gray-500 text-xs mt-1"><slot name="description" /></p>
    {/if}
  </div>
</div>

<script lang="ts">
  export let id: string;
  export let label: string = '';
  export let value: string = '';
  export let options: { value: string, label: string }[] = [];
  export let required: boolean = false;
  export let error: string = '';
</script>

<div class="flex flex-col gap-1.5 w-full">
  {#if label}
    <label for={id} class="text-[10px] font-mono text-white/50 uppercase tracking-widest">
      {label} {#if required}<span class="text-rose-500">*</span>{/if}
    </label>
  {/if}
  
  <div class="relative">
    <select
      {id}
      bind:value
      {required}
      class="w-full bg-[#1A1D23] border {error ? 'border-rose-500' : 'border-white/10'} text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 transition-colors rounded-none appearance-none cursor-pointer"
    >
      <option value="" disabled selected>Select an option...</option>
      {#each options as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
    
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white/40">
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
  
  {#if error}
    <span class="text-[10px] font-mono text-rose-500 mt-0.5 uppercase tracking-wide">{error}</span>
  {/if}
</div>

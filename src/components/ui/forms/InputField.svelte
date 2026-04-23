<script lang="ts">
  export let id: string;
  export let label: string = '';
  export let type: string = 'text';
  export let value: string = '';
  export let error: string = '';
  export let required: boolean = false;
  export let placeholder: string = '';
  export let readonly: boolean = false;
</script>

<div class="flex flex-col gap-1.5 w-full">
  {#if label}
    <label for={id} class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
      {label} {#if required}<span class="text-rose-500">*</span>{/if}
    </label>
  {/if}
  
  <input
    {id}
    {type}
    bind:value
    {required}
    {placeholder}
    {readonly}
    class="w-full bg-white border {error ? 'border-rose-500' : 'border-gray-300'} {readonly ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'text-gray-900'} px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors rounded-none placeholder:text-gray-400"
  />
  
  {#if error}
    <span class="text-[10px] font-mono text-rose-500 mt-0.5 uppercase tracking-wide">{error}</span>
  {/if}
</div>

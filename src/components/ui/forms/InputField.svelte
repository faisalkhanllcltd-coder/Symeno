<script lang="ts">
  let {
    id,
    label = '',
    type = 'text',
    value = $bindable(''),
    error = '',
    required = false,
    placeholder = '',
    readonly = false,
    class: className = ''
  }: {
    id: string;
    label?: string;
    type?: string;
    value?: string;
    error?: string;
    required?: boolean;
    placeholder?: string;
    readonly?: boolean;
    class?: string;
  } = $props();
</script>

<div class="flex w-full flex-col gap-1.5 {className}">
  {#if label}
    <label for={id} class="font-mono text-[10px] tracking-widest text-content-muted uppercase">
      {label}
      {#if required}<span class="text-brand-alert">*</span>{/if}
    </label>
  {/if}

  <input
    {id}
    {type}
    bind:value
    {required}
    {placeholder}
    {readonly}
    class="w-full border bg-surface {error ? 'border-brand-alert' : 'border-outline'} {readonly ? 'cursor-not-allowed opacity-50 text-content-muted' : 'text-content'} rounded-none px-3 py-2 text-sm transition-colors placeholder:text-content-muted/50 focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none"
  />

  {#if error}
    <span class="mt-0.5 font-mono text-[10px] tracking-wide text-brand-alert uppercase">{error}</span>
  {/if}
</div>

<style>
  /* HARDENING: Override browser native autofill backgrounds to respect CSS Variables */
  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus, 
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 1000px var(--theme-surface) inset !important;
    -webkit-text-fill-color: var(--theme-content) !important;
  }
</style>
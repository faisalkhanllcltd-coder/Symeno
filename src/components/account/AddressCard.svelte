<script lang="ts">
  let { address, onEdit, onDelete, onMakeDefault } = $props<{
    address: any;
    onEdit: () => void;
    onDelete: () => void;
    onMakeDefault: () => void;
  }>();
  let isUAE = $derived(address.country === 'United Arab Emirates');
</script>

<div
  class="flex h-full flex-col border bg-surface transition-colors duration-300 {address.is_default
    ? 'border-brand/30 bg-brand/5'
    : 'border-outline hover:border-content-muted'}"        
>
  <div class="flex items-center justify-between border-b border-outline p-4">
    <div class="flex items-center gap-2">
      <h4
        class="font-mono text-xs font-bold tracking-widest text-content uppercase"
      >
        {address.label}
      </h4>
      {#if address.is_default}
        <span
          class="border border-brand/30 bg-brand/20 px-2 py-0.5 font-mono text-[9px] tracking-widest text-brand uppercase"
          >Default</span
        >
      {/if}
    </div>
    <div class="flex gap-2">
      <button
        onclick={onEdit}
        class="font-mono text-[10px] text-content-muted uppercase transition-colors hover:text-brand focus-visible:outline-none focus-visible:text-brand"
        >Edit</button
      >
      {#if !address.is_default}
        <button
          onclick={onDelete}
          class="font-mono text-[10px] text-content-muted uppercase transition-colors hover:text-brand-alert focus-visible:outline-none focus-visible:text-brand-alert"
          >Delete</button
        >
      {/if}
    </div>
  </div>

  <div class="flex-1 space-y-1 p-4 font-mono text-xs text-content-muted">
    <p class="mb-2 font-bold text-content">{address.full_name}</p>
    {#if address.line2}<p>{address.line2}</p>{/if}      
    <p>{address.line1}</p>
    <p>
      {address.city}, {address.state}
      {!isUAE && address.landmark ? address.landmark : ''}
    </p>
    <p>{address.country}</p>
    {#if isUAE && address.landmark}
      <p class="mt-2 text-[10px] text-content opacity-80">   
        Landmark: {address.landmark}
      </p>
    {/if}
    <p class="pt-2 text-[10px] text-content-muted opacity-60">{address.phone}</p>
  </div>

  {#if !address.is_default}
    <div class="mt-auto border-t border-outline p-4">  
      <button
        onclick={onMakeDefault}
        class="w-full border border-outline px-4 py-2 font-mono text-[10px] tracking-widest text-content-muted uppercase transition-colors hover:border-brand/50 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      >
        Set as Default
      </button>
    </div>
  {/if}
</div>

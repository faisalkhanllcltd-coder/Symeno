<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    id,
    checked = $bindable(false),
    label,
    required = false,
    description,
    onchange
  } = $props<{
    id: string;
    checked?: boolean;
    label: string;
    required?: boolean;
    description?: Snippet;
    onchange?: (checked: boolean) => void;
  }>();

  function handleChange() {
    if (onchange) onchange(checked);
  }
</script>

<div class="flex items-start">
  <div class="flex h-5 items-center">
    <input
      {id}
      type="checkbox"
      bind:checked
      onchange={handleChange}
      {required}
      class="relative flex h-4 w-4 cursor-pointer appearance-none items-center justify-center rounded-none border border-outline bg-base transition-colors before:absolute before:h-2 before:w-2 before:scale-0 before:bg-brand-dark before:transition-transform before:content-[''] checked:border-brand checked:bg-brand checked:before:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    />
  </div>
  <div class="ml-3 text-sm">
    <label
      for={id}
      class="cursor-pointer font-medium text-content select-none"
    >
      {label}
      {#if required}<span class="text-brand-alert ml-1">*</span>{/if}
    </label>
    {#if description}
      <p class="mt-1 text-xs text-content-muted">{@render description()}</p>
    {/if}
  </div>
</div>

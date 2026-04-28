<script lang="ts">
  let {
    id,
    label = '',
    value = $bindable(''),
    options = [],
    required = false,
    error = '',
    onchange
  } = $props<{
    id: string;
    label?: string;
    value?: string;
    options?: { value: string; label: string }[];
    required?: boolean;
    error?: string;
    onchange?: (value: string) => void;
  }>();

  function handleChange() {
    if (onchange) onchange(value);
  }
</script>

<div class="flex w-full flex-col gap-1.5">
  {#if label}
    <label
      for={id}
      class="font-mono text-[10px] tracking-widest text-content-muted uppercase"
    >
      {label}
      {#if required}<span class="text-brand-alert ml-1">*</span>{/if}
    </label>
  {/if}

  <div class="relative">
    <select
      {id}
      bind:value
      onchange={handleChange}
      {required}
      class="w-full border bg-surface {error
        ? 'border-brand-alert text-brand-alert'
        : 'border-outline text-content'} cursor-pointer appearance-none rounded-none px-3 py-2 text-sm transition-colors focus:border-brand focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand dark:[color-scheme:dark]"   
    >
      <option value="" disabled>Select an option...</option>
      {#each options as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>

    <div
      class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-content-muted"
    >
      <svg
        class="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  </div>

  {#if error}
    <span
      class="mt-0.5 font-mono text-[10px] tracking-wide text-brand-alert uppercase"
      >{error}</span
    >
  {/if}
</div>

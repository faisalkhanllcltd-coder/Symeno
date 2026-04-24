<script lang="ts">
  let {
    checked = $bindable(false),
    label = '',
    id = 'toggle-' + Math.random().toString(36).substring(2, 9),
    onchange
  } = $props<{
    checked?: boolean;
    label?: string;
    id?: string;
    onchange?: (checked: boolean) => void;
  }>();

  function handleChange() {
    if (onchange) onchange(checked);
  }
</script>

<label for={id} class="group flex cursor-pointer items-center">
  <div class="relative">
    <input
      type="checkbox"
      {id}
      class="sr-only"
      bind:checked
      onchange={handleChange}
    />
    <div
      class="block h-5 w-10 border border-outline bg-base transition-colors duration-300 {checked
        ? 'border-brand bg-brand/20'
        : 'group-hover:border-content-muted'}"
    ></div>
    <div
      class="dot absolute top-1 left-1 h-3 w-3 bg-content-muted transition-transform duration-200 ease-in-out {checked
        ? 'translate-x-5 transform bg-brand'        
        : 'group-hover:bg-content'}"
    ></div>
  </div>
  {#if label}
    <div
      class="ml-3 font-mono text-[10px] tracking-widest uppercase {checked
        ? 'text-content'
        : 'text-content-muted'} transition-colors duration-300 group-hover:text-content"
    >
      {label}
    </div>
  {/if}
</label>

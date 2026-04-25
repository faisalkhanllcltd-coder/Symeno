<script lang="ts">
  let { onFilter } = $props<{ onFilter: (filters: any) => void }>();

  let action = $state('');
  let entity = $state('');

  const actions = ['CREATE', 'UPDATE', 'DELETE', 'REFUND', 'LOGIN', 'EXPORT'];
  const entities = [
    'PRODUCT',
    'ORDER',
    'CUSTOMER',
    'DISCOUNT',
    'SETTINGS',
    'TEAM',
  ];

  function applyFilters() {
    onFilter({ action, entity });
  }

  function resetFilters() {
    action = '';
    entity = '';
    onFilter({ action, entity });
  }
</script>

<div
  class="flex flex-wrap items-end gap-4 border border-outline bg-surface p-4"
>
  <div>
    <label
      class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
      >Action Type</label
    >
    <select
      bind:value={action}
      onchange={applyFilters}
      class="w-48 border border-outline bg-base px-3 py-2 font-mono text-xs text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
    >
      <option value="">All Actions</option>
      {#each actions as a}
        <option value={a}>{a}</option>
      {/each}
    </select>
  </div>
  <div>
    <label
      class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
      >Target Entity</label
    >
    <select
      bind:value={entity}
      onchange={applyFilters}
      class="w-48 border border-outline bg-base px-3 py-2 font-mono text-xs text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
    >
      <option value="">All Entities</option>
      {#each entities as e}
        <option value={e}>{e}</option>
      {/each}
    </select>
  </div>
  <button
    onclick={resetFilters}
    class="h-[34px] border border-outline px-4 py-2 font-mono text-[10px] tracking-widest text-content-muted transition-colors hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
  >
    Reset
  </button>
</div>

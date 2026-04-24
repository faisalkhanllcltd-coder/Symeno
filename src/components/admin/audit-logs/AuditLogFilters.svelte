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
  class="flex flex-wrap items-end gap-4 border border-white/10 bg-[#111318] p-4"
>
  <div>
    <label
      class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-white/50 uppercase"
      >Action Type</label
    >
    <select
      bind:value={action}
      onchange={applyFilters}
      class="w-48 border border-white/10 bg-[#1A1D23] px-3 py-2 font-mono text-xs text-white focus:border-[#36f4a4]/50 focus:outline-none"
    >
      <option value="">All Actions</option>
      {#each actions as a}
        <option value={a}>{a}</option>
      {/each}
    </select>
  </div>
  <div>
    <label
      class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-white/50 uppercase"
      >Target Entity</label
    >
    <select
      bind:value={entity}
      onchange={applyFilters}
      class="w-48 border border-white/10 bg-[#1A1D23] px-3 py-2 font-mono text-xs text-white focus:border-[#36f4a4]/50 focus:outline-none"
    >
      <option value="">All Entities</option>
      {#each entities as e}
        <option value={e}>{e}</option>
      {/each}
    </select>
  </div>
  <button
    onclick={resetFilters}
    class="h-[34px] border border-white/10 px-4 py-2 font-mono text-[10px] tracking-widest text-white/50 transition-colors hover:text-white"
  >
    Reset
  </button>
</div>

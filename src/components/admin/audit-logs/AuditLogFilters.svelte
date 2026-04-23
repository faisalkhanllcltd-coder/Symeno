<script lang="ts">
  let { onFilter } = $props<{ onFilter: (filters: any) => void }>();
  
  let action = $state('');
  let entity = $state('');
  
  const actions = ['CREATE', 'UPDATE', 'DELETE', 'REFUND', 'LOGIN', 'EXPORT'];
  const entities = ['PRODUCT', 'ORDER', 'CUSTOMER', 'DISCOUNT', 'SETTINGS', 'TEAM'];

  function applyFilters() {
    onFilter({ action, entity });
  }

  function resetFilters() {
    action = '';
    entity = '';
    onFilter({ action, entity });
  }
</script>

<div class="bg-[#111318] p-4 border border-white/10 flex flex-wrap gap-4 items-end">
  <div>
    <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Action Type</label>
    <select bind:value={action} onchange={applyFilters} class="w-48 bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-[#36f4a4]/50 font-mono">
      <option value="">All Actions</option>
      {#each actions as a}
        <option value={a}>{a}</option>
      {/each}
    </select>
  </div>
  <div>
    <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Target Entity</label>
    <select bind:value={entity} onchange={applyFilters} class="w-48 bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-[#36f4a4]/50 font-mono">
      <option value="">All Entities</option>
      {#each entities as e}
        <option value={e}>{e}</option>
      {/each}
    </select>
  </div>
  <button onclick={resetFilters} class="border border-white/10 text-white/50 px-4 py-2 text-[10px] font-mono tracking-widest hover:text-white transition-colors h-[34px]">
    Reset
  </button>
</div>
<script lang="ts">
  export let name: string;
  export let email: string;
  export let totalSpent: number;
  export let orderCount: number;
  export let status: 'active' | 'inactive' | 'flagged' = 'active';
  
  import StatusBadge from '../../ui/data/StatusBadge.svelte';
  
  $: statusMap = {
    active: { label: 'Active', type: 'success' },
    inactive: { label: 'Dormant', type: 'neutral' },
    flagged: { label: 'Flagged', type: 'error' }
  };
</script>

<div class="bg-[#111318] border border-white/10 p-5 flex flex-col hover:border-white/30 transition-colors group">
  <div class="flex justify-between items-start mb-4">
    <div class="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold font-mono text-sm uppercase">
      {name.substring(0, 2)}
    </div>
    <StatusBadge status={statusMap[status].type} label={statusMap[status].label} />
  </div>
  
  <div class="flex-1 mb-4">
    <h3 class="text-sm font-bold text-white leading-tight mb-1 truncate">{name}</h3>
    <p class="text-[10px] font-mono text-white/40 truncate">{email}</p>
  </div>
  
  <div class="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
    <div>
      <p class="text-[9px] font-mono uppercase tracking-widest text-white/30 mb-0.5">LTV (Gross)</p>
      <p class="text-xs font-bold text-white font-mono">${totalSpent.toFixed(2)}</p>
    </div>
    <div>
      <p class="text-[9px] font-mono uppercase tracking-widest text-white/30 mb-0.5">Orders</p>
      <p class="text-xs font-bold text-white font-mono">{orderCount}</p>
    </div>
  </div>
</div>

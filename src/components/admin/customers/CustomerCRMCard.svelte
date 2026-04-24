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
    flagged: { label: 'Flagged', type: 'error' },
  };
</script>

<div
  class="group flex flex-col border border-white/10 bg-[#111318] p-5 transition-colors hover:border-white/30"
>
  <div class="mb-4 flex items-start justify-between">
    <div
      class="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/5 font-mono text-sm font-bold text-white uppercase"
    >
      {name.substring(0, 2)}
    </div>
    <StatusBadge
      status={statusMap[status].type}
      label={statusMap[status].label}
    />
  </div>

  <div class="mb-4 flex-1">
    <h3 class="mb-1 truncate text-sm leading-tight font-bold text-white">
      {name}
    </h3>
    <p class="truncate font-mono text-[10px] text-white/40">{email}</p>
  </div>

  <div class="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
    <div>
      <p
        class="mb-0.5 font-mono text-[9px] tracking-widest text-white/30 uppercase"
      >
        LTV (Gross)
      </p>
      <p class="font-mono text-xs font-bold text-white">
        ${totalSpent.toFixed(2)}
      </p>
    </div>
    <div>
      <p
        class="mb-0.5 font-mono text-[9px] tracking-widest text-white/30 uppercase"
      >
        Orders
      </p>
      <p class="font-mono text-xs font-bold text-white">{orderCount}</p>
    </div>
  </div>
</div>

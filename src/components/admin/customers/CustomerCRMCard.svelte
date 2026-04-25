<script lang="ts">
  let {
    name,
    email,
    totalSpent,
    orderCount,
    status = 'active',
  } = $props<{
    name: string;
    email: string;
    totalSpent: number;
    orderCount: number;
    status?: 'active' | 'inactive' | 'flagged';
  }>();

  import StatusBadge from '../../ui/data/StatusBadge.svelte';

  let statusMap = $derived({
    active: { label: 'Active', type: 'success' },
    inactive: { label: 'Dormant', type: 'neutral' },
    flagged: { label: 'Flagged', type: 'error' },
  } as const);
</script>

<div
  class="group flex flex-col border border-outline bg-surface p-5 transition-colors hover:border-outline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
>
  <div class="mb-4 flex items-start justify-between">
    <div
      class="flex h-10 w-10 items-center justify-center border border-outline bg-base font-mono text-sm font-bold text-content uppercase"
    >
      {name.substring(0, 2)}
    </div>
    <StatusBadge
      status={statusMap[status].type}
      label={statusMap[status].label}
    />
  </div>

  <div class="mb-4 flex-1">
    <h3 class="mb-1 truncate text-sm leading-tight font-bold text-content">
      {name}
    </h3>
    <p class="truncate font-mono text-[10px] text-content-muted">{email}</p>
  </div>

  <div class="grid grid-cols-2 gap-4 border-t border-outline pt-4">
    <div>
      <p
        class="mb-0.5 font-mono text-[9px] tracking-widest text-content-muted uppercase"
      >
        LTV (Gross)
      </p>
      <p class="font-mono text-xs font-bold text-content">
        ${totalSpent.toFixed(2)}
      </p>
    </div>
    <div>
      <p
        class="mb-0.5 font-mono text-[9px] tracking-widest text-content-muted uppercase"
      >
        Orders
      </p>
      <p class="font-mono text-xs font-bold text-content">{orderCount}</p>
    </div>
  </div>
</div>

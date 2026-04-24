<script lang="ts">
  let { notification, onMarkRead } = $props<{
    notification: any;
    onMarkRead: (id: string) => void;
  }>();

  // Determine icon based on notification type
  let iconData = $derived(() => {
    switch (notification.type) {
      case 'ORDER_UPDATE':
        return {
          color: 'text-blue-400',
          bg: 'bg-blue-400/10',
          border: 'border-blue-400/30',
          path: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
        };
      case 'PRICE_DROP':
        return {
          color: 'text-brand',
          bg: 'bg-brand/10',
          border: 'border-brand/30',
          path: 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6',      
        };
      case 'BACK_IN_STOCK':
        return {
          color: 'text-brand',
          bg: 'bg-brand/10',
          border: 'border-brand/30',
          path: 'M5 13l4 4L19 7',
        };
      case 'PROMO':
        return {
          color: 'text-purple-400',
          bg: 'bg-purple-400/10',
          border: 'border-purple-400/30',
          path: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
        };
      case 'LOYALTY':
        return {
          color: 'text-amber-400',
          bg: 'bg-amber-400/10',
          border: 'border-amber-400/30',
          path: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        };
      case 'RMA_UPDATE':
        return {
          color: 'text-brand-alert',
          bg: 'bg-brand-alert/10',
          border: 'border-brand-alert/30',
          path: 'M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z',
        };
      default:
        return {
          color: 'text-content-muted',
          bg: 'bg-base',
          border: 'border-outline',
          path: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        };
    }
  });

  function handleAction(e: Event) {
    if (!notification.is_read) {
      onMarkRead(notification.id);
    }
  }
</script>

<div
  class="border-b border-outline p-4 transition-colors {notification.is_read
    ? 'bg-transparent opacity-60'
    : 'bg-base hover:bg-surface'} group flex items-start gap-4"
>
  <div
    class="h-10 w-10 shrink-0 rounded-full border {iconData()
      .border} {iconData().bg} mt-1 flex items-center justify-center"
  >
    <svg
      class="h-5 w-5 {iconData().color}"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d={iconData().path}
      /></svg
    >
  </div>

  <div class="min-w-0 flex-1">
    <div class="mb-1 flex items-start justify-between gap-2">
      <h4 class="text-xs font-bold tracking-widest text-content uppercase">
        {notification.title}
      </h4>
      <span class="font-mono text-[9px] whitespace-nowrap text-content-muted"
        >{new Date(notification.created_at).toLocaleDateString()}</span
      >
    </div>
    <p
      class="mb-2 font-mono text-[10px] leading-relaxed break-words text-content-muted"
    >
      {notification.message}
    </p>

    <div class="mt-2 flex items-center gap-4">
      {#if notification.action_url}
        <a
          href={notification.action_url}
          onclick={handleAction}
          class="flex items-center gap-1 font-mono text-[9px] tracking-widest text-brand uppercase transition-colors hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        >
          Take Action <svg
            class="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            /></svg
          >
        </a>
      {/if}

      {#if !notification.is_read}
        <button
          onclick={() => onMarkRead(notification.id)}   
          class="font-mono text-[9px] tracking-widest text-content-muted uppercase transition-colors hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
          >Mark Read</button
        >
      {/if}
    </div>
  </div>

  {#if !notification.is_read}
    <div
      class="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand shadow-[0_0_8px_var(--color-brand)]"
    ></div>
  {/if}
</div>

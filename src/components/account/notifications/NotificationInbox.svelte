<script lang="ts">
  import NotificationItem from './NotificationItem.svelte';

  let { initialNotifications = [] } = $props<{ initialNotifications?: any[] }>();
  let notifications = $state(initialNotifications);     
  let isProcessing = $state(false);

  let unreadCount = $derived(notifications.filter((n) => !n.is_read).length);

  async function markRead(id: string) {
    if (isProcessing) return;

    // Optimistic Update
    const original = [...notifications];
    if (id === 'ALL') {
      notifications = notifications.map((n) => ({ ...n, is_read: 1 }));
    } else {
      const index = notifications.findIndex((n) => n.id === id);
      if (index !== -1) notifications[index].is_read = 1;
    }

    isProcessing = true;
    try {
      const res = await fetch('/api/account/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          id === 'ALL' ? { action: 'MARK_ALL_READ' } : { id }
        ),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Revert on failure
      notifications = original;
    } finally {
      isProcessing = false;
    }
  }
</script>

<div class="flex h-[600px] flex-col border border-outline bg-surface transition-colors duration-300">
  <div
    class="flex items-center justify-between border-b border-outline bg-base p-4"
  >
    <div class="flex items-center gap-3">
      <h3 class="text-xs font-bold tracking-widest text-content uppercase">
        Inbox Telemetry
      </h3>
      {#if unreadCount > 0}
        <span
          class="border border-brand/30 bg-brand/10 px-2 py-0.5 font-mono text-[9px] text-brand"    
          >{unreadCount} New</span
        >
      {/if}
    </div>
    {#if unreadCount > 0}
      <button
        onclick={() => markRead('ALL')}
        disabled={isProcessing}
        class="font-mono text-[10px] tracking-widest text-content-muted uppercase transition-colors hover:text-content disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        >Mark All Read</button
      >
    {/if}
  </div>

  <div class="flex-1 overflow-y-auto">
    {#if notifications.length > 0}
      {#each notifications as notification}
        <NotificationItem {notification} onMarkRead={markRead} />
      {/each}
    {:else}
      <div
        class="flex h-full flex-col items-center justify-center p-8 text-center text-content-muted opacity-80"
      >
        <svg
          class="mb-4 h-12 w-12 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          /></svg
        >
        <p class="font-mono text-xs tracking-widest uppercase">
          No telemetry intercepted.
        </p>
        <p class="mt-2 font-mono text-[10px]">Your inbox is clear.</p>
      </div>
    {/if}
  </div>
</div>

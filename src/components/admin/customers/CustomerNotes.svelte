<script lang="ts">
  let { customerId, notes = [] } = $props<{
    customerId: string;
    notes?: any[];
  }>();
  let newNote = $state('');
  let isSubmitting = $state(false);

  async function addNote(e: Event) {
    e.preventDefault();
    if (!newNote.trim()) return;
    isSubmitting = true;
    try {
      const res = await fetch(`/api/admin/customers/${customerId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newNote }),
      });
      if (res.ok) {
        notes = [
          {
            note: newNote,
            created_at: new Date().toISOString(),
            author: 'Current Admin',
          },
          ...notes,
        ];
        newNote = '';
      }
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="flex h-full flex-col border border-outline bg-surface">
  <div class="border-b border-outline p-4">
    <h3
      class="font-mono text-[10px] font-bold tracking-widest text-brand uppercase"
    >
      CRM Profile Notes
    </h3>
  </div>

  <div class="min-h-[200px] flex-1 space-y-4 overflow-y-auto p-4">
    {#each notes as note}
      <div class="border-l-2 border-brand bg-base p-3">
        <div
          class="mb-1 flex items-center justify-between font-mono text-[9px] text-content-muted"
        >
          <span>{note.author || 'System'}</span>
          <span>{new Date(note.created_at).toLocaleDateString()}</span>
        </div>
        <p class="text-xs text-content">{note.note}</p>
      </div>
    {:else}
      <p class="text-center text-[10px] font-mono text-content-muted uppercase mt-4">
        No CRM notes available.
      </p>
    {/each}
  </div>

  <form onsubmit={addNote} class="border-t border-outline bg-base p-4">
    <div class="flex gap-2">
      <input
        type="text"
        bind:value={newNote}
        placeholder="Log an interaction..."
        class="flex-1 border border-outline bg-surface px-3 py-2 font-mono text-xs text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        class="bg-brand px-4 py-2 text-[10px] font-bold tracking-widest text-black uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm disabled:opacity-50"
        >Log</button
      >
    </div>
  </form>
</div>

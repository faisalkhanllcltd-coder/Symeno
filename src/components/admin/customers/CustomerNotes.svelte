<script lang="ts">
  let { customerId, notes = [] } = $props<{ customerId: string, notes: any[] }>();
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
        body: JSON.stringify({ note: newNote })
      });
      if (res.ok) {
        notes = [{ note: newNote, created_at: new Date().toISOString(), author: 'Current Admin' }, ...notes];
        newNote = '';
      }
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="bg-[#111318] border border-white/10 flex flex-col h-full">
  <div class="p-4 border-b border-white/10">
    <h3 class="text-[10px] font-bold uppercase tracking-widest text-[#36f4a4] font-mono">CRM Profile Notes</h3>
  </div>
  
  <div class="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px]">
    {#each notes as note}
      <div class="bg-white/5 p-3 border-l-2 border-[#36f4a4]">
        <div class="flex justify-between items-center mb-1 text-[9px] font-mono text-white/40">
          <span>{note.author || 'System'}</span>
          <span>{new Date(note.created_at).toLocaleDateString()}</span>
        </div>
        <p class="text-xs text-white/80">{note.note}</p>
      </div>
    {:else}
      <p class="text-center text-[10px] font-mono text-white/30 uppercase mt-4">No CRM notes available.</p>
    {/each}
  </div>

  <form onsubmit={addNote} class="p-4 border-t border-white/10 bg-white/[0.02]">
    <div class="flex gap-2">
      <input type="text" bind:value={newNote} placeholder="Log an interaction..." class="flex-1 bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
      <button type="submit" disabled={isSubmitting} class="bg-[#36f4a4] text-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 transition-colors focus:outline-none">Log</button>
    </div>
  </form>
</div>
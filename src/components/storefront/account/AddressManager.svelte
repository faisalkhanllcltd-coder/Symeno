<script lang="ts">
  import AddressForm from './AddressForm.svelte';
  import AddressCard from './AddressCard.svelte';

  let { initialAddresses = [] } = $props<{ initialAddresses: any[] }>();
  
  let addresses = $state(initialAddresses);
  let isEditing = $state(false);
  let editTarget = $state<any>(null);
  let isProcessing = $state(false);

  function openForm(address = null) {
    editTarget = address;
    isEditing = true;
  }

  function closeForm() {
    isEditing = false;
    editTarget = null;
  }

  async function handleSave(data: any) {
    isProcessing = true;
    try {
      const isNew = !data.id;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch('/api/account/addresses', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (res.ok) {
        const result = await res.json();
        if (isNew) data.id = result.id;
        
        if (data.is_default) {
          addresses = addresses.map(a => ({ ...a, is_default: false }));
        }
        
        if (isNew) {
          addresses = [data, ...addresses];
        } else {
          addresses = addresses.map(a => a.id === data.id ? data : a);
        }
        
        addresses.sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0));
        closeForm();
      }
    } finally {
      isProcessing = false;
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Permanently delete this logistics node?')) return;
    try {
      const res = await fetch('/api/account/addresses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        addresses = addresses.filter(a => a.id !== id);
      }
    } catch(e) {}
  }

  async function handleMakeDefault(address: any) {
    const updated = { ...address, is_default: true };
    await handleSave(updated);
  }
</script>

<div>
  {#if isEditing}
    <div class="max-w-2xl animate-fade-in">
      <AddressForm address={editTarget} onSave={handleSave} onCancel={closeForm} />
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {#each addresses as address}
        <AddressCard 
          {address} 
          onEdit={() => openForm(address)} 
          onDelete={() => handleDelete(address.id)} 
          onMakeDefault={() => handleMakeDefault(address)}
        />
      {/each}
      
      <button onclick={() => openForm()} class="bg-[#111318] border border-white/10 border-dashed hover:border-[#36f4a4]/50 flex flex-col items-center justify-center p-8 min-h-[250px] group transition-colors focus:outline-none">
        <div class="w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center group-hover:border-[#36f4a4] group-hover:bg-[#36f4a4]/10 transition-colors mb-4">
          <svg class="w-6 h-6 text-white/30 group-hover:text-[#36f4a4] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        </div>
        <span class="text-xs font-bold uppercase tracking-widest text-white/50 group-hover:text-[#36f4a4] font-mono transition-colors">Add Address</span>
      </button>
    </div>
  {/if}
</div>
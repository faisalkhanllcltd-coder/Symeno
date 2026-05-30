<script lang="ts">
  import AddressForm from './AddressForm.svelte';        
  import AddressCard from './AddressCard.svelte';        

  let props = $props<{ initialAddresses?: any[] }>();

  let addresses = $state<any[]>([...(props.initialAddresses ?? [])]);
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
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        if (isNew) data.id = result.id;

        if (data.is_default) {
          addresses = addresses.map((a) => ({ ...a, is_default: false }));
        }

        if (isNew) {
          addresses = [data, ...addresses];
        } else {
          addresses = addresses.map((a) => (a.id === data.id ? data : a));
        }

        addresses.sort(
          (a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0)
        );
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
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        addresses = addresses.filter((a) => a.id !== id);
      }
    } catch (e) {}
  }

  async function handleMakeDefault(address: any) {      
    const updated = { ...address, is_default: true };   
    await handleSave(updated);
  }
</script>

<div>
  {#if isEditing}
    <div class="animate-fade-in max-w-2xl">
      <AddressForm
        address={editTarget}
        onSave={handleSave}
        onCancel={closeForm}
      />
    </div>
  {:else}
    <div
      class="animate-fade-in grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {#each addresses as address}
        <AddressCard
          {address}
          onEdit={() => openForm(address)}
          onDelete={() => handleDelete(address.id)}     
          onMakeDefault={() => handleMakeDefault(address)}
        />
      {/each}

      <button
        onclick={() => openForm()}
        class="group flex min-h-[250px] flex-col items-center justify-center border border-dashed border-outline bg-surface p-8 transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      >
        <div
          class="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-outline transition-colors group-hover:border-brand group-hover:bg-brand/10"
        >
          <svg
            class="h-6 w-6 text-content-muted transition-colors group-hover:text-brand"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            /></svg
          >
        </div>
        <span
          class="font-mono text-xs font-bold tracking-widest text-content-muted uppercase transition-colors group-hover:text-brand"
          >Add Address</span
        >
      </button>
    </div>
  {/if}
</div>

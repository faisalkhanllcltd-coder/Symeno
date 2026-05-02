<script lang="ts">
  let { user } = $props<{
    user: { id: string; first_name: string; last_name: string; email: string; phone?: string; };
  }>();

  let firstName = $state(user?.first_name || '');
  let lastName = $state(user?.last_name || '');
  let phone = $state(user?.phone || '');
  let isSaving = $state(false);
  let notification = $state<{ type: 'success' | 'error', text: string } | null>(null);

  async function handleSave(e: Event) {
    e.preventDefault();
    isSaving = true;
    notification = null;

    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          firstName: firstName.trim(), 
          lastName: lastName.trim(), 
          phone: phone.trim() 
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Identity update failed.');
      }
      
      notification = { type: 'success', text: 'Secure identity updated successfully.' };
    } catch (err: any) {
      notification = { type: 'error', text: err.message };
    } finally {
      isSaving = false;
      setTimeout(() => { notification = null; }, 5000);
    }
  }
</script>

<form onsubmit={handleSave} class="bg-surface border-outline space-y-6 rounded-xl border p-8 shadow-sm">
  <div>
    <h3 class="text-content font-sans text-lg font-bold tracking-tight uppercase">Identity Matrix</h3>
    <p class="text-content-muted mt-1 font-mono text-[10px] tracking-widest uppercase">Update your personal edge data</p>
  </div>

  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div>
      <label for="firstName" class="text-content font-mono text-xs font-bold tracking-widest uppercase">First Name</label>
      <input
        id="firstName"
        type="text"
        bind:value={firstName}
        class="bg-base border-outline text-content focus:border-brand mt-2 w-full rounded-md border p-3 font-mono text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-brand"
        required
      />
    </div>
    <div>
      <label for="lastName" class="text-content font-mono text-xs font-bold tracking-widest uppercase">Last Name</label>
      <input
        id="lastName"
        type="text"
        bind:value={lastName}
        class="bg-base border-outline text-content focus:border-brand mt-2 w-full rounded-md border p-3 font-mono text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-brand"
        required
      />
    </div>
  </div>

  <div>
    <label for="email" class="text-content font-mono text-xs font-bold tracking-widest uppercase">Encrypted Email</label>
    <input
      id="email"
      type="email"
      value={user?.email || ''}
      disabled
      class="bg-base border-outline text-content-muted mt-2 w-full cursor-not-allowed rounded-md border p-3 font-mono text-sm opacity-60"
    />
    <p class="text-content-muted mt-2 font-mono text-[9px] tracking-widest uppercase">Email changes require 2FA verification in Security Settings.</p>
  </div>

  <div>
    <label for="phone" class="text-content font-mono text-xs font-bold tracking-widest uppercase">Phone Number</label>
    <input
      id="phone"
      type="tel"
      bind:value={phone}
      placeholder="+1 (555) 000-0000"
      class="bg-base border-outline text-content focus:border-brand mt-2 w-full rounded-md border p-3 font-mono text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-brand"
    />
  </div>

  {#if notification}
    <div class="border p-3 font-mono text-xs font-bold uppercase rounded {notification.type === 'success' ? 'bg-brand/10 border-brand text-brand' : 'bg-brand-alert/10 border-brand-alert text-brand-alert'}">
      {notification.text}
    </div>
  {/if}

  <div class="border-outline flex items-center justify-end border-t pt-6">
    <button
      type="submit"
      disabled={isSaving}
      class="bg-brand text-brand-dark rounded-md px-8 py-3 font-mono text-xs font-bold tracking-widest uppercase transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      {isSaving ? 'Synchronizing...' : 'Save Changes'}
    </button>
  </div>
</form>

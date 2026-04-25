<script lang="ts">
  let { team = [] } = $props<{ team?: any[] }>();
  let inviteEmail = $state('');
  let inviteRole = $state('staff');

  async function inviteUser(e: Event) {
    e.preventDefault();
    if (!inviteEmail) return;
    await fetch('/api/admin/settings/team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
    });
    alert('Invitation deployed.');
    inviteEmail = '';
  }
</script>

<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
  <div
    class="overflow-hidden border border-outline bg-surface lg:col-span-2"
  >
    <table class="w-full border-collapse text-left">
      <thead>
        <tr
          class="border-b border-outline bg-surface font-mono text-[10px] tracking-widest text-content-muted uppercase"
        >
          <th class="p-4 font-normal">Identity</th>
          <th class="p-4 font-normal">Role</th>
          <th class="p-4 text-right font-normal">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-outline">
        {#each team as member}
          <tr class="hover:bg-white/[0.02]">
            <td class="p-4 font-mono text-xs text-content">{member.email}</td>
            <td class="p-4"
              ><span
                class="border border-outline px-2 py-1 text-[9px] text-content-muted uppercase"
                >{member.role}</span
              ></td
            >
            <td class="p-4 text-right"
              ><button
                class="font-mono text-[10px] text-brand-alert uppercase hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-alert rounded-sm"
                >Revoke</button
              ></td
            >
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <form
    onsubmit={inviteUser}
    class="h-fit space-y-4 border border-brand/30 bg-surface p-6"
  >
    <h3 class="font-mono text-xs font-bold text-brand uppercase">
      Provision Access
    </h3>
    <input
      type="email"
      bind:value={inviteEmail}
      placeholder="operator@symeno.com"
      required
      class="w-full border border-outline bg-base p-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
    />
    <select
      bind:value={inviteRole}
      class="w-full border border-outline bg-base p-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
    >
      <option value="staff">Staff (Support/Fulfillment)</option>
      <option value="admin">Admin (Full Matrix Access)</option>
    </select>
    <button
      type="submit"
      class="w-full bg-brand px-4 py-2 text-[10px] font-bold tracking-widest text-black uppercase transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      >Send Invite</button
    >
  </form>
</div>

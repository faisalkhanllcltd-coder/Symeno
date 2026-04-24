<script lang="ts">
  let { team = [] } = $props<{ team: any[] }>();
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
    class="overflow-hidden border border-white/10 bg-[#111318] lg:col-span-2"
  >
    <table class="w-full border-collapse text-left">
      <thead>
        <tr
          class="border-b border-white/10 bg-[#0a0b0e] font-mono text-[10px] tracking-widest text-white/40 uppercase"
        >
          <th class="p-4 font-normal">Identity</th>
          <th class="p-4 font-normal">Role</th>
          <th class="p-4 text-right font-normal">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/[0.04]">
        {#each team as member}
          <tr class="hover:bg-white/[0.02]">
            <td class="p-4 font-mono text-xs text-white">{member.email}</td>
            <td class="p-4"
              ><span
                class="border border-white/10 px-2 py-1 text-[9px] text-white/70 uppercase"
                >{member.role}</span
              ></td
            >
            <td class="p-4 text-right"
              ><button
                class="font-mono text-[10px] text-rose-400 uppercase hover:underline"
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
    class="h-fit space-y-4 border border-[#36f4a4]/30 bg-[#111318] p-6"
  >
    <h3 class="font-mono text-xs font-bold text-[#36f4a4] uppercase">
      Provision Access
    </h3>
    <input
      type="email"
      bind:value={inviteEmail}
      placeholder="operator@symeno.com"
      required
      class="w-full border border-white/10 bg-[#1A1D23] p-2 font-mono text-sm text-white focus:border-[#36f4a4]/50 focus:outline-none"
    />
    <select
      bind:value={inviteRole}
      class="w-full border border-white/10 bg-[#1A1D23] p-2 font-mono text-sm text-white focus:border-[#36f4a4]/50 focus:outline-none"
    >
      <option value="staff">Staff (Support/Fulfillment)</option>
      <option value="admin">Admin (Full Matrix Access)</option>
    </select>
    <button
      type="submit"
      class="w-full bg-[#36f4a4] px-4 py-2 text-[10px] font-bold tracking-widest text-black uppercase transition-colors hover:bg-white"
      >Send Invite</button
    >
  </form>
</div>

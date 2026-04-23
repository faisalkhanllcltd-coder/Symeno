<script lang="ts">
  let { team = [] } = $props<{ team: any[] }>();
  let inviteEmail = $state('');
  let inviteRole = $state('staff');

  async function inviteUser(e: Event) {
    e.preventDefault();
    if(!inviteEmail) return;
    await fetch('/api/admin/settings/team', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email: inviteEmail, role: inviteRole })
    });
    alert('Invitation deployed.');
    inviteEmail = '';
  }
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div class="lg:col-span-2 bg-[#111318] border border-white/10 overflow-hidden">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-[#0a0b0e] border-b border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/40">
          <th class="p-4 font-normal">Identity</th>
          <th class="p-4 font-normal">Role</th>
          <th class="p-4 font-normal text-right">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/[0.04]">
        {#each team as member}
          <tr class="hover:bg-white/[0.02]">
            <td class="p-4 text-xs font-mono text-white">{member.email}</td>
            <td class="p-4"><span class="text-[9px] px-2 py-1 uppercase border border-white/10 text-white/70">{member.role}</span></td>
            <td class="p-4 text-right"><button class="text-[10px] text-rose-400 font-mono uppercase hover:underline">Revoke</button></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  
  <form onsubmit={inviteUser} class="bg-[#111318] p-6 border border-[#36f4a4]/30 h-fit space-y-4">
    <h3 class="text-xs font-bold text-[#36f4a4] font-mono uppercase">Provision Access</h3>
    <input type="email" bind:value={inviteEmail} placeholder="operator@symeno.com" required class="w-full bg-[#1A1D23] border border-white/10 text-white p-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
    <select bind:value={inviteRole} class="w-full bg-[#1A1D23] border border-white/10 text-white p-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono">
      <option value="staff">Staff (Support/Fulfillment)</option>
      <option value="admin">Admin (Full Matrix Access)</option>
    </select>
    <button type="submit" class="w-full bg-[#36f4a4] text-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors">Send Invite</button>
  </form>
</div>
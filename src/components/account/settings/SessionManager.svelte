<script lang="ts">
  interface AuthSession {
    id: string;
    device: string;
    location: string;
    ip_address: string;
    last_active: string;
    is_current: boolean;
  }

  // 1. Receive the real session data from the Astro edge route
  let props = $props<{ initialSessions?: AuthSession[] }>();

  // 2. Hydrate local state for optimistic UI updates
  let sessions = $state<AuthSession[]>(structuredClone(props.initialSessions || []));
  let isProcessing = $state(false);

  // 3. Maintain edge synchronization if parent data changes
  $effect(() => {
    if (props.initialSessions !== undefined) {
      sessions = props.initialSessions;
    }
  });

  async function revoke(id: string) {
    if (isProcessing) return;
    if (!confirm('Terminate this session link?')) return;

    isProcessing = true;
    
    // Optimistic removal for instant UI feedback
    const previousSessions = [...sessions];
    sessions = sessions.filter((s) => s.id !== id);

    try {
      const res = await fetch('/api/account/sessions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: id }),
      });

      if (!res.ok) {
        throw new Error('Revocation failed at edge');
      }
    } catch (e) {
      console.error('[AUTH_EDGE_ERROR] Session termination failed.', e);
      // Revert UI on failure
      sessions = previousSessions;
      alert('Failed to terminate session. Please try again.');
    } finally {
      isProcessing = false;
    }
  }
</script>

<div class="space-y-4 transition-colors duration-300">
  <h3
    class="mb-4 font-mono text-xs font-bold tracking-widest text-content uppercase"
  >
    Active Auth Sessions
  </h3>
  
  {#if sessions.length === 0}
    <div class="border border-outline bg-surface p-6 text-center">
      <span class="font-mono text-xs tracking-widest text-content-muted uppercase">No active sessions detected.</span>
    </div>
  {:else}
    <div class="divide-y divide-outline border border-outline bg-base">
      {#each sessions as s (s.id)}
        <div
          class="flex flex-col items-start justify-between gap-4 p-4 sm:flex-row sm:items-center transition-colors hover:bg-surface"
        >
          <div>
            <div class="mb-1 flex items-center gap-3">    
              <span class="font-mono text-xs font-bold text-content"
                >{s.device}</span
              >
              {#if s.is_current}
                <span
                  class="border border-brand/30 bg-brand/10 px-2 py-0.5 text-[9px] tracking-widest text-brand uppercase"
                  >Current Node</span
                >
              {/if}
            </div>
            <p class="font-mono text-[10px] text-content-muted">
              {s.location} • IP: {s.ip_address}
            </p>
            <p class="mt-1 font-mono text-[9px] text-content-muted opacity-60">
              Last seen: {new Date(s.last_active).toLocaleString()}
            </p>
          </div>
          {#if !s.is_current}
            <button
              onclick={() => revoke(s.id)}
              disabled={isProcessing}
              class="border border-brand-alert/30 px-4 py-2 font-mono text-[10px] tracking-widest text-brand-alert uppercase transition-colors hover:bg-brand-alert/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-alert rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
              {isProcessing ? 'Terminating...' : 'Revoke'}
            </button>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
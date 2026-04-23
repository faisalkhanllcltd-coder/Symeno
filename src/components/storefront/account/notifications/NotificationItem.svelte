<script lang="ts">
  let { notification, onMarkRead } = $props<{ notification: any, onMarkRead: (id: string) => void }>();

  // Determine icon based on notification type
  let iconData = $derived(() => {
    switch(notification.type) {
      case 'ORDER_UPDATE': return { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30', path: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' };
      case 'PRICE_DROP': return { color: 'text-[#36f4a4]', bg: 'bg-[#36f4a4]/10', border: 'border-[#36f4a4]/30', path: 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6' };
      case 'BACK_IN_STOCK': return { color: 'text-[#36f4a4]', bg: 'bg-[#36f4a4]/10', border: 'border-[#36f4a4]/30', path: 'M5 13l4 4L19 7' };
      case 'PROMO': return { color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30', path: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7' };
      case 'LOYALTY': return { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30', path: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' };
      case 'RMA_UPDATE': return { color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/30', path: 'M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z' };
      default: return { color: 'text-white/50', bg: 'bg-white/5', border: 'border-white/10', path: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' };
    }
  });

  function handleAction(e: Event) {
    if (!notification.is_read) {
       onMarkRead(notification.id);
    }
  }
</script>

<div class="p-4 border-b border-white/10 transition-colors {notification.is_read ? 'opacity-60 bg-transparent' : 'bg-white/[0.02] hover:bg-white/[0.04]'} flex gap-4 items-start group">
  <div class="shrink-0 w-10 h-10 rounded-full border {iconData().border} {iconData().bg} flex items-center justify-center mt-1">
    <svg class="w-5 h-5 {iconData().color}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d={iconData().path} /></svg>
  </div>
  
  <div class="flex-1 min-w-0">
    <div class="flex justify-between items-start mb-1 gap-2">
      <h4 class="text-xs font-bold text-white uppercase tracking-widest">{notification.title}</h4>
      <span class="text-[9px] font-mono text-white/40 whitespace-nowrap">{new Date(notification.created_at).toLocaleDateString()}</span>
    </div>
    <p class="text-[10px] text-white/70 font-mono mb-2 leading-relaxed break-words">{notification.message}</p>
    
    <div class="flex items-center gap-4 mt-2">
      {#if notification.action_url}
        <a href={notification.action_url} onclick={handleAction} class="text-[9px] text-[#36f4a4] hover:text-white uppercase font-mono tracking-widest transition-colors flex items-center gap-1">
          Take Action <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </a>
      {/if}
      
      {#if !notification.is_read}
        <button onclick={() => onMarkRead(notification.id)} class="text-[9px] text-white/40 hover:text-white uppercase font-mono tracking-widest transition-colors">Mark Read</button>
      {/if}
    </div>
  </div>
  
  {#if !notification.is_read}
    <div class="w-2 h-2 rounded-full bg-[#36f4a4] mt-2 shrink-0 shadow-[0_0_8px_rgba(54,244,164,0.5)]"></div>
  {/if}
</div>
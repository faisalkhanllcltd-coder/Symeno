<script lang="ts">
  let { stats = { totalOrders: 0, totalSpent: 0, points: 0 } } = $props<{ 
    stats: { totalOrders: number, totalSpent: number, points: number } 
  }>();
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div class="bg-[#111318] p-5 border border-white/10 flex flex-col justify-between">
    <h3 class="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Total Orders</h3>
    <p class="text-2xl text-white font-mono">{stats.totalOrders}</p>
  </div>
  <div class="bg-[#111318] p-5 border border-white/10 flex flex-col justify-between">
    <h3 class="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Lifetime Spend</h3>
    <p class="text-2xl text-[#36f4a4] font-mono">${stats.totalSpent.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
  </div>
  <div class="bg-[#111318] p-5 border border-[#36f4a4]/20 bg-[#36f4a4]/5 flex flex-col justify-between relative overflow-hidden">
    <div class="absolute -right-4 -top-4 w-16 h-16 bg-[#36f4a4]/10 rounded-full blur-xl"></div>
    <h3 class="text-[10px] font-bold uppercase tracking-widest text-[#36f4a4] font-mono mb-2">Loyalty Points</h3>
    <p class="text-2xl text-white font-mono">{stats.points} <span class="text-[10px] text-white/40 font-sans tracking-normal">pts</span></p>
  </div>
</div>

<script lang='ts'>
  let { products = [] } = $props<{ products: any[] }>();
</script>
<div class='overflow-x-auto bg-[#111318] border border-white/10'>
  <table class='w-full text-left border-collapse'>
    <thead>
      <tr class='border-b border-white/10 bg-[#1A1D23]'>
        <th class='p-4 text-[10px] font-bold uppercase tracking-widest text-white/50'>SKU</th>
        <th class='p-4 text-[10px] font-bold uppercase tracking-widest text-white/50'>Title</th>
        <th class='p-4 text-[10px] font-bold uppercase tracking-widest text-white/50'>Price</th>
        <th class='p-4 text-[10px] font-bold uppercase tracking-widest text-white/50'>Actions</th>
      </tr>
    </thead>
    <tbody class='divide-y divide-white/[0.04]'>
      {#each products as p}
        <tr class='hover:bg-white/[0.02]'>
          <td class='p-4 text-xs font-mono text-white/70'>{p.id.substring(0,8)}</td>
          <td class='p-4 text-xs font-bold text-white'>{p.title}</td>
          <td class='p-4 text-xs font-mono text-[#36f4a4]'>${p.base_price.toFixed(2)}</td>
          <td class='p-4'><a href='/admin/products/edit/{p.id}' class='text-[10px] font-mono text-white/50 hover:text-white uppercase'>Edit</a></td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

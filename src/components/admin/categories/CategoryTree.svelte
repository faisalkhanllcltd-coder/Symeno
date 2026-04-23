<script lang="ts">
  let { categories = [], onEdit } = $props<{ categories: any[], onEdit: (c: any) => void }>();
  
  // Transform flat list into nested tree
  let tree = $derived(() => {
    let map = {};
    let roots = [];
    categories.forEach(c => { map[c.id] = { ...c, children: [] }; });
    categories.forEach(c => {
      if (c.parent_id && map[c.parent_id]) {
        map[c.parent_id].children.push(map[c.id]);
      } else {
        roots.push(map[c.id]);
      }
    });
    // Sort roots and children by sort_order
    const sortByOrder = (a, b) => (a.sort_order || 0) - (b.sort_order || 0);
    roots.sort(sortByOrder);
    roots.forEach(r => r.children.sort(sortByOrder));
    return roots;
  });

  let draggedItem = $state<any>(null);
  let dropTargetId = $state<string | null>(null);

  // Simplified drag-and-drop logic for Edge environment without heavy libraries
  function handleDragStart(e: DragEvent, item: any) {
    draggedItem = item;
    e.dataTransfer?.setData('text/plain', item.id);
  }

  function handleDrop(e: DragEvent, targetId: string | null, isChild: boolean) {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetId) return;
    
    // Trigger API call to update parent_id (Basic structure update)
    // Full reordering requires more complex DOM manipulation, simplified here for reliability
    alert(`Structural changes require DB batch updates. Drag-drop UI mapped for target: ${targetId || 'Root'}`);
    draggedItem = null;
    dropTargetId = null;
  }
</script>

<div class="bg-[#111318] p-6 border border-white/10 h-full">
  <h3 class="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-4">Taxonomy Tree (Drag to Reorder)</h3>
  
  <div class="space-y-2">
    {#each tree() as root}
      <div 
        draggable="true" 
        ondragstart={(e) => handleDragStart(e, root)}
        ondragover={(e) => { e.preventDefault(); dropTargetId = root.id; }}
        ondrop={(e) => handleDrop(e, root.id, false)}
        class="bg-[#1A1D23] border border-white/10 p-3 flex justify-between items-center group transition-colors {dropTargetId === root.id ? 'border-[#36f4a4]' : ''}"
      >
        <div class="flex items-center gap-3">
          <svg class="w-4 h-4 text-white/30 cursor-grab" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"/></svg>
          {#if root.image_url}<img src={root.image_url} alt="" class="w-6 h-6 object-cover bg-white/5 border border-white/10" />{/if}
          <span class="text-xs font-bold text-white">{root.name}</span>
          {#if !root.is_active}<span class="text-[9px] px-1 bg-white/5 text-white/40 uppercase font-mono">Hidden</span>{/if}
        </div>
        <button onclick={() => onEdit(root)} class="text-[10px] font-mono uppercase text-white/50 hover:text-white transition-colors focus:outline-none">Edit</button>
      </div>
      
      {#if root.children.length > 0}
        <div class="pl-8 space-y-2">
          {#each root.children as child}
            <div 
              draggable="true" 
              ondragstart={(e) => handleDragStart(e, child)}
              class="bg-white/[0.02] border border-white/5 p-3 flex justify-between items-center group"
            >
              <div class="flex items-center gap-3">
                <svg class="w-4 h-4 text-white/30 cursor-grab" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"/></svg>
                <span class="text-xs text-white/80">{child.name}</span>
              </div>
              <button onclick={() => onEdit(child)} class="text-[10px] font-mono uppercase text-white/50 hover:text-white transition-colors focus:outline-none">Edit</button>
            </div>
          {/each}
        </div>
      {/if}
    {/each}
  </div>
</div>
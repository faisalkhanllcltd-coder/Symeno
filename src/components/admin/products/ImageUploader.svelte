<script lang="ts">
  let { onUpload } = $props<{ onUpload?: (files: FileList) => void }>();
  let isDragging = $state(false);
  let fileInput: HTMLInputElement;

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      onUpload?.(e.dataTransfer.files);
    }
  }
  
  function handleFileSelect(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      onUpload?.(target.files);
    }
  }
</script>

<div 
  class="relative w-full p-12 border-2 border-dashed rounded-xl transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden group {isDragging ? 'border-brand bg-brand/5' : 'border-outline bg-base hover:border-content-muted'}"
  ondragover={(e) => { e.preventDefault(); isDragging = true; }}
  ondragleave={() => isDragging = false}
  ondrop={handleDrop}
  onclick={() => fileInput.click()}
  role="button"
  tabindex="0"
>
  <input 
    type="file" 
    bind:this={fileInput} 
    onchange={handleFileSelect} 
    class="hidden" 
    accept="image/png, image/jpeg, image/webp" 
    multiple 
  />
  
  <svg class="w-10 h-10 mb-4 text-content-muted group-hover:text-brand transition-colors {isDragging ? 'text-brand scale-110' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
  
  <p class="text-sm font-medium text-content mb-1">Select assets or drag and drop</p>
  <p class="text-[10px] font-mono text-content-muted uppercase tracking-widest">WEBP, PNG, JPG (MAX. 5MB)</p>
</div>

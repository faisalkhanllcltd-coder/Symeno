<script lang="ts">
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import Image from '@tiptap/extension-image';

  let { content = $bindable(''), placeholder = 'Enter description...' } = $props<{ content?: string, placeholder?: string }>();
  
  let element = $state<HTMLElement>();
  let editor = $state<Editor>();

  $effect(() => {
    if (element && !editor) {
      editor = new Editor({
        element: element,
        extensions: [
          StarterKit,
          Image.configure({ inline: true })
        ],
        content: content,
        editorProps: {
          attributes: {
            class: 'prose prose-invert max-w-none focus:outline-none min-h-[200px] p-4 text-sm font-mono',
          },
        },
        onUpdate: ({ editor }) => {
          content = editor.getHTML();
        },
      });
    }

    return () => {
      if (editor) {
        editor.destroy();
        editor = undefined;
      }
    };
  });
</script>

<div class="bg-[#111318] border border-white/10 overflow-hidden flex flex-col group focus-within:border-[#36f4a4]/50 transition-colors">
  {#if editor}
    <div class="bg-[#1A1D23] border-b border-white/10 p-2 flex flex-wrap gap-1">
      <button type="button" onclick={() => editor.chain().focus().toggleBold().run()} class="px-2 py-1 text-[10px] font-mono uppercase tracking-widest {editor.isActive('bold') ? 'bg-[#36f4a4]/20 text-[#36f4a4]' : 'text-white/50 hover:bg-white/10'}">Bold</button>
      <button type="button" onclick={() => editor.chain().focus().toggleItalic().run()} class="px-2 py-1 text-[10px] font-mono uppercase tracking-widest {editor.isActive('italic') ? 'bg-[#36f4a4]/20 text-[#36f4a4]' : 'text-white/50 hover:bg-white/10'}">Italic</button>
      <div class="w-px h-4 bg-white/10 mx-2 self-center"></div>
      <button type="button" onclick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} class="px-2 py-1 text-[10px] font-mono uppercase tracking-widest {editor.isActive('heading', { level: 2 }) ? 'bg-[#36f4a4]/20 text-[#36f4a4]' : 'text-white/50 hover:bg-white/10'}">H2</button>
      <button type="button" onclick={() => editor.chain().focus().toggleBulletList().run()} class="px-2 py-1 text-[10px] font-mono uppercase tracking-widest {editor.isActive('bulletList') ? 'bg-[#36f4a4]/20 text-[#36f4a4]' : 'text-white/50 hover:bg-white/10'}">List</button>
    </div>
  {/if}
  
  <div bind:this={element} class="flex-1 cursor-text"></div>
</div>

<style>
  /* Base Tiptap Styles to ensure clean rendering on the Edge */
  :global(.ProseMirror p.is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    float: left;
    color: #4b5563; /* text-gray-600 */
    pointer-events: none;
    height: 0;
  }
  :global(.ProseMirror img) {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    border: 1px solid rgba(255,255,255,0.1);
  }
</style>
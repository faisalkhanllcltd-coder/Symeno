<script lang="ts">
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import Image from '@tiptap/extension-image';

  let { content = $bindable(''), placeholder = 'Enter description...' } =
    $props<{ content?: string; placeholder?: string }>();

  let element = $state<HTMLElement>();
  let editor = $state<Editor>();

  $effect(() => {
    if (element && !editor) {
      editor = new Editor({
        element: element,
        extensions: [StarterKit, Image.configure({ inline: true })],
        content: content,
        editorProps: {
          attributes: {
            class:
              'prose prose-invert max-w-none focus:outline-none min-h-[200px] p-4 text-sm font-mono text-content',
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

<div
  class="group flex flex-col overflow-hidden border border-outline bg-surface transition-colors focus-within:border-brand/50 focus-within:ring-1 focus-within:ring-brand rounded-sm"
>
  {#if editor}
    <div class="flex flex-wrap gap-1 border-b border-outline bg-base p-2">
      <button
        type="button"
        onclick={() => editor.chain().focus().toggleBold().run()}
        class="px-2 py-1 font-mono text-[10px] tracking-widest uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm {editor.isActive(
          'bold'
        )
          ? 'bg-brand/20 text-brand'
          : 'text-content-muted hover:bg-white/10'}">Bold</button
      >
      <button
        type="button"
        onclick={() => editor.chain().focus().toggleItalic().run()}
        class="px-2 py-1 font-mono text-[10px] tracking-widest uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm {editor.isActive(
          'italic'
        )
          ? 'bg-brand/20 text-brand'
          : 'text-content-muted hover:bg-white/10'}">Italic</button
      >
      <div class="mx-2 h-4 w-px self-center bg-outline"></div>
      <button
        type="button"
        onclick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        class="px-2 py-1 font-mono text-[10px] tracking-widest uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm {editor.isActive(
          'heading',
          { level: 2 }
        )
          ? 'bg-brand/20 text-brand'
          : 'text-content-muted hover:bg-white/10'}">H2</button
      >
      <button
        type="button"
        onclick={() => editor.chain().focus().toggleBulletList().run()}
        class="px-2 py-1 font-mono text-[10px] tracking-widest uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm {editor.isActive(
          'bulletList'
        )
          ? 'bg-brand/20 text-brand'
          : 'text-content-muted hover:bg-white/10'}">List</button
      >
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
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
</style>

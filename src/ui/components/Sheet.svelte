<script lang="ts">
  import type { Snippet } from 'svelte';
  let { open, onclose, title, children }: { open: boolean; onclose: () => void; title: string; children: Snippet } = $props();
</script>

{#if open}
  <div class="overlay" role="presentation" onclick={onclose}></div>
  <div class="sheet panel" role="dialog" aria-modal="true" aria-label={title}>
    <div class="grip"></div>
    <div class="head">
      <h2 class="display">{title}</h2>
      <button class="icon-btn" onclick={onclose} aria-label="Schließen">✕</button>
    </div>
    <div class="body">{@render children()}</div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 40;
    background: rgba(0, 0, 0, 0.6);
    animation: fade 0.2s ease;
  }
  .sheet {
    position: fixed;
    z-index: 41;
    left: 50%;
    bottom: 0;
    width: 100%;
    max-width: 560px;
    max-height: 88dvh;
    overflow: auto;
    transform: translateX(-50%);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    background: var(--bg);
    padding: 10px 16px calc(20px + env(safe-area-inset-bottom));
    animation: up 0.3s var(--ease);
  }
  .grip { width: 40px; height: 4px; border-radius: 4px; background: var(--border); margin: 0 auto 10px; }
  .head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
  .head h2 { font-size: 1.5rem; }
  .body { display: flex; flex-direction: column; gap: 12px; }
  @keyframes fade { from { opacity: 0; } }
  @keyframes up { from { transform: translate(-50%, 100%); } }
</style>

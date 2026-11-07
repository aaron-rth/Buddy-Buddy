<script lang="ts">
  let {
    open,
    title,
    text = '',
    confirmLabel = 'OK',
    onconfirm,
    oncancel,
  }: { open: boolean; title: string; text?: string; confirmLabel?: string; onconfirm: () => void; oncancel: () => void } = $props();
</script>

{#if open}
  <div class="overlay" role="presentation" onclick={oncancel}></div>
  <div class="dialog panel" role="alertdialog" aria-modal="true" aria-label={title}>
    <h2 class="display">{title}</h2>
    {#if text}<p class="muted">{text}</p>{/if}
    <div class="row">
      <button class="btn" onclick={oncancel}>Abbrechen</button>
      <button class="btn btn-primary" onclick={onconfirm}>{confirmLabel}</button>
    </div>
  </div>
{/if}

<style>
  .overlay { position: fixed; inset: 0; z-index: 60; background: rgba(0, 0, 0, 0.65); }
  .dialog {
    position: fixed;
    z-index: 61;
    left: 50%;
    top: 50%;
    width: min(420px, calc(100% - 32px));
    transform: translate(-50%, -50%);
    background: var(--bg);
    display: flex;
    flex-direction: column;
    gap: 14px;
    animation: pop 0.22s var(--ease);
  }
  h2 { font-size: 1.4rem; }
  @keyframes pop { from { opacity: 0; transform: translate(-50%, -46%) scale(0.96); } }
</style>

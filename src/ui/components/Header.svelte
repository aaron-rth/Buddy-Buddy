<script lang="ts">
  let { step = 0, onback }: { step?: number; onback?: () => void } = $props();
</script>

<header>
  {#if onback}
    <button class="icon-btn" onclick={onback} aria-label="Zurück">←</button>
  {:else}
    <span class="spacer"></span>
  {/if}
  {#if step}
    <div class="steps" aria-label="Schritt {step} von 3">
      {#each [1, 2, 3] as s}
        <span class="dot" class:done={s < step} class:active={s === step}></span>
      {/each}
    </div>
  {/if}
  <span class="spacer"></span>
</header>

<style>
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 52px;
    margin-bottom: 8px;
  }
  .spacer { width: 44px; }
  .steps { display: flex; gap: 8px; }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: var(--border);
    transition: all 0.3s var(--ease);
  }
  .dot.done { background: var(--muted); }
  .dot.active { width: 28px; background: var(--primary); }
</style>

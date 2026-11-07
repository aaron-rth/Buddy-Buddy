<script lang="ts">
  import Icon from '../icons/Icon.svelte';
  import { store } from '../../lib/store.svelte';
  import { chime } from '../../lib/sound';
  let { step = 0, onback }: { step?: number; onback?: () => void } = $props();

  function toggleSound() {
    store.prefs.sound = !store.prefs.sound;
    if (store.prefs.sound) chime();
  }
</script>

<header>
  {#if onback}
    <button class="icon-btn" onclick={onback} aria-label="Zurück"><Icon name="back" /></button>
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
  <button
    class="icon-btn sound"
    class:on={store.prefs.sound}
    onclick={toggleSound}
    aria-pressed={store.prefs.sound}
    aria-label={store.prefs.sound ? 'Ton aus' : 'Ton an'}
  >
    <Icon name={store.prefs.sound ? 'sound-on' : 'sound-off'} size={20} />
  </button>
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
  .sound { color: var(--muted); }
  .sound.on { color: var(--primary); }
</style>

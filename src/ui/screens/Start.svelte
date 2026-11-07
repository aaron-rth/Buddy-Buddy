<script lang="ts">
  import { store } from '../../lib/store.svelte';
  import { go } from '../../lib/router.svelte';
  import type { Theme } from '../../themes/types';
  let { theme }: { theme: Theme } = $props();

  const game = $derived(store.game);
  const allSeen = $derived(game ? game.assignments.every((a) => a.seen) : false);
</script>

<main class="screen">
  <div class="content hero">
    <div class="logo">
      <span class="label">{theme.name} · {theme.genre}</span>
      <h1 class="display">Buddy<br />Buddy</h1>
      <p class="tag">Das Live-Spiel im dunklen Haus.</p>
    </div>
  </div>
  <div class="footer">
    {#if game}
      <button class="btn btn-primary" onclick={() => go(allSeen ? 'ready' : 'deal')}>
        {allSeen ? 'Zur laufenden Runde' : 'Verteilung fortsetzen'}
      </button>
      <button class="btn" onclick={() => go('theme')}>Neues Spiel vorbereiten</button>
    {:else}
      <button class="btn btn-primary" onclick={() => go('theme')}>Spiel vorbereiten</button>
    {/if}
    <p class="note">Alles bleibt auf diesem Gerät.</p>
  </div>
</main>

<style>
  .hero { justify-content: center; align-items: center; text-align: center; }
  .logo { display: flex; flex-direction: column; align-items: center; gap: 14px; margin-top: 8vh; }
  h1 {
    font-size: clamp(3.6rem, 19vw, 6rem);
    line-height: 0.92;
    text-shadow: 0 4px 40px color-mix(in srgb, var(--primary) 45%, transparent);
    animation: glow 4s ease-in-out infinite alternate;
  }
  .tag { color: var(--muted); font-size: 1.05rem; }
  .note { text-align: center; font-size: 0.8rem; color: var(--muted); margin-top: 4px; }
  @keyframes glow { to { text-shadow: 0 4px 60px color-mix(in srgb, var(--primary) 70%, transparent); } }
</style>

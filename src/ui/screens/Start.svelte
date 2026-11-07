<script lang="ts">
  import { store } from '../../lib/store.svelte';
  import { go } from '../../lib/router.svelte';
  import type { Theme } from '../../themes/types';
  import Header from '../components/Header.svelte';
  import Sheet from '../components/Sheet.svelte';
  import Confirm from '../components/Confirm.svelte';
  import Icon from '../icons/Icon.svelte';
  let { theme }: { theme: Theme } = $props();

  const game = $derived(store.game);
  const allSeen = $derived(game ? game.assignments.every((a) => a.seen) : false);
  const stats = $derived(
    Object.entries(store.stats)
      .map(([name, s]) => ({ name, ...s }))
      .sort((a, b) => b.wins - a.wins || b.games - a.games || a.name.localeCompare(b.name)),
  );
  let statsOpen = $state(false);
  let confirmReset = $state(false);
</script>

<main class="screen">
  <Header />
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
    {#if stats.length}
      <button class="btn btn-ghost" onclick={() => (statsOpen = true)}><Icon name="trophy" size={20} /> Statistik</button>
    {/if}
    <p class="note">Alles bleibt auf diesem Gerät.</p>
  </div>
</main>

<Sheet open={statsOpen} title="Statistik" onclose={() => (statsOpen = false)}>
  <table>
    <thead>
      <tr><th>Name</th><th>Spiele</th><th>Siege</th><th>{theme.terms.imposter}</th></tr>
    </thead>
    <tbody>
      {#each stats as s, i (s.name)}
        <tr class:top={i === 0 && s.wins > 0}>
          <td>{#if i === 0 && s.wins > 0}<Icon name="trophy" size={16} />{/if} {s.name}</td>
          <td>{s.games}</td>
          <td>{s.wins}</td>
          <td>{s.imposter}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  <button class="btn btn-ghost" onclick={() => (confirmReset = true)}><Icon name="trash" size={18} /> Zurücksetzen</button>
</Sheet>

<Confirm
  open={confirmReset}
  title="Statistik löschen?"
  confirmLabel="Löschen"
  oncancel={() => (confirmReset = false)}
  onconfirm={() => {
    store.stats = {};
    confirmReset = false;
    statsOpen = false;
  }}
/>

<style>
  .hero { justify-content: center; align-items: center; text-align: center; }
  .logo { display: flex; flex-direction: column; align-items: center; gap: 14px; margin-top: 4vh; }
  h1 {
    font-size: clamp(3.6rem, 19vw, 6rem);
    line-height: 0.92;
    text-shadow: 0 4px 40px color-mix(in srgb, var(--primary) 45%, transparent);
    animation: glow 4s ease-in-out infinite alternate;
  }
  .tag { color: var(--muted); font-size: 1.05rem; }
  .note { text-align: center; font-size: 0.8rem; color: var(--muted); margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
  th { text-align: right; font-size: 0.75rem; color: var(--muted); font-weight: 600; padding: 6px 4px; }
  th:first-child, td:first-child { text-align: left; }
  td { text-align: right; padding: 10px 4px; border-top: 1px solid var(--border); }
  td:first-child { font-weight: 600; }
  .top td { color: var(--primary); }
  @keyframes glow { to { text-shadow: 0 4px 60px color-mix(in srgb, var(--primary) 70%, transparent); } }
</style>

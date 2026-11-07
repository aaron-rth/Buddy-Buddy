<script lang="ts">
  import { store } from '../../lib/store.svelte';
  import { go } from '../../lib/router.svelte';
  import { buildRuleCard } from '../../lib/rules';
  import { themedRole } from '../../lib/text';
  import { distribute } from '../../core/distribute';
  import type { Theme } from '../../themes/types';
  import Header from '../components/Header.svelte';
  import HoldButton from '../components/HoldButton.svelte';
  import Sheet from '../components/Sheet.svelte';
  import Confirm from '../components/Confirm.svelte';
  let { theme }: { theme: Theme } = $props();

  const game = $derived(store.game!);
  const card = $derived(buildRuleCard(game, theme));
  let resolve = $state(false);
  let confirmNew = $state(false);
  let error = $state('');

  const TEAM_ORDER = { imposter: 0, neutral: 1, crew: 2 } as const;
  const resolved = $derived(
    game.assignments
      .map((a) => ({ a, r: themedRole(a.roleId, theme, game.config) }))
      .sort((x, y) => TEAM_ORDER[x.r.team] - TEAM_ORDER[y.r.team] || (x.r.id === 'crew' ? 1 : 0) - (y.r.id === 'crew' ? 1 : 0)),
  );

  function newRound() {
    confirmNew = false;
    try {
      store.game = distribute($state.snapshot(game.config));
      go('deal');
    } catch (e) {
      error = (e as Error).message;
    }
  }
</script>

<main class="screen">
  <Header onback={() => go('start')} />
  <div class="content">
    <div>
      <span class="label">Zum Vorlesen</span>
      <h1 class="display title">{theme.name}</h1>
      <p class="intro">{card.intro}</p>
    </div>
    {#each card.sections as s}
      <section class="panel">
        <h2 class="panel-title"><span class="ico">{s.icon}</span>{s.title}</h2>
        <ul>
          {#each s.items as item}<li>{item}</li>{/each}
        </ul>
      </section>
    {/each}
    {#if error}<p class="issue issue-error">⛔ {error}</p>{/if}
  </div>
  <div class="footer">
    <div class="row">
      <HoldButton class="btn" duration={1500} onconfirm={() => (resolve = true)} label="Auflösung: gedrückt halten">🔓 Auflösung</HoldButton>
      <button class="btn btn-primary" onclick={() => (confirmNew = true)}>🎲 Neue Runde</button>
    </div>
    <p class="note">Auflösung erst nach dem Spiel – gedrückt halten.</p>
  </div>
</main>

<Sheet open={resolve} title="Auflösung" onclose={() => (resolve = false)}>
  <ul class="resolve">
    {#each resolved as { a, r } (a.playerId)}
      <li class="res team-{r.team}">
        <span class="ri">{r.icon}</span>
        <span class="rn">{a.name}</span>
        <span class="rr">{r.name}</span>
      </li>
    {/each}
  </ul>
</Sheet>

<Confirm
  open={confirmNew}
  title="Neue Runde?"
  text="Gleiche Spieler und Regeln, neu gemischt."
  confirmLabel="Neu mischen"
  oncancel={() => (confirmNew = false)}
  onconfirm={newRound}
/>

<style>
  .intro { margin-top: 10px; font-style: italic; color: var(--muted); font-size: 1.05rem; }
  section { padding: 14px 16px; }
  .panel-title { margin-bottom: 6px; }
  .ico { font-size: 1.2rem; }
  ul { margin: 0; padding-left: 1.1em; display: flex; flex-direction: column; gap: 4px; }
  li::marker { color: var(--primary); }
  .row :global(.btn) { flex: 1; font-size: 0.95rem; padding: 0 0.6rem; }
  .note { text-align: center; font-size: 0.78rem; color: var(--muted); }
  .resolve { list-style: none; padding: 0; gap: 8px; }
  .res {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border-radius: var(--radius);
    background: var(--surface2);
    border-left: 4px solid var(--good);
  }
  .team-imposter { border-left-color: var(--danger); }
  .team-neutral { border-left-color: var(--warn); }
  .ri { font-size: 1.5rem; }
  .rn { flex: 1; font-weight: 700; }
  .rr { color: var(--muted); font-size: 0.92rem; }
</style>

<script lang="ts">
  import { store } from '../../lib/store.svelte';
  import { go } from '../../lib/router.svelte';
  import { buildRuleCard, ruleCardSpeech } from '../../lib/rules';
  import { themedRole } from '../../lib/text';
  import { recordResult } from '../../lib/stats';
  import { playStart } from '../../lib/sound';
  import { distribute } from '../../core/distribute';
  import type { Winner } from '../../core/types';
  import type { Theme } from '../../themes/types';
  import Header from '../components/Header.svelte';
  import HoldButton from '../components/HoldButton.svelte';
  import Sheet from '../components/Sheet.svelte';
  import Confirm from '../components/Confirm.svelte';
  import NightOverlay from '../components/NightOverlay.svelte';
  import Icon from '../icons/Icon.svelte';
  import Emblem from '../icons/Emblem.svelte';
  let { theme }: { theme: Theme } = $props();

  const game = $derived(store.game!);
  const card = $derived(buildRuleCard(game, theme));
  let resolve = $state(false);
  let confirmNew = $state(false);
  let night = $state(false);
  let speaking = $state(false);
  let error = $state('');
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const TEAM_ORDER = { imposter: 0, neutral: 1, crew: 2 } as const;
  const resolved = $derived(
    game.assignments
      .map((a) => ({ a, r: themedRole(a.roleId, theme, game.config) }))
      .sort((x, y) => TEAM_ORDER[x.r.team] - TEAM_ORDER[y.r.team] || (x.r.id === 'crew' ? 1 : 0) - (y.r.id === 'crew' ? 1 : 0)),
  );
  const hasJester = $derived(game.assignments.some((a) => a.roleId === 'jester'));
  const mixedLovers = $derived(game.assignments.some((a) => a.lover?.mixed));
  const winnerOpts = $derived(
    [
      { value: 'crew' as Winner, label: theme.terms.crews },
      { value: 'imposter' as Winner, label: theme.terms.imposters },
      ...(hasJester ? [{ value: 'jester' as Winner, label: themedRole('jester', theme, game.config).name }] : []),
      ...(mixedLovers ? [{ value: 'lovers' as Winner, label: theme.lovers.name }] : []),
    ],
  );

  function setWinner(w: Winner) {
    if (game.winner) return;
    recordResult(store.stats, game, w);
    game.winner = w;
  }

  function newRound() {
    confirmNew = false;
    stopSpeak();
    try {
      store.game = distribute($state.snapshot(game.config));
      if (store.prefs.sound) playStart(theme);
      go('deal');
    } catch (e) {
      error = (e as Error).message;
    }
  }

  // ---- Vorlesen ----
  function speak() {
    if (!canSpeak) return;
    if (speaking) return stopSpeak();
    const synth = window.speechSynthesis;
    synth.cancel();
    const voice = synth.getVoices().find((v) => v.lang.startsWith('de'));
    const parts = ruleCardSpeech(card);
    speaking = true;
    parts.forEach((text, i) => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'de-DE';
      u.rate = 0.95;
      if (voice) u.voice = voice;
      if (i === parts.length - 1) u.onend = () => (speaking = false);
      u.onerror = () => (speaking = false);
      synth.speak(u);
    });
  }
  function stopSpeak() {
    if (canSpeak) window.speechSynthesis.cancel();
    speaking = false;
  }
  $effect(() => () => stopSpeak());
</script>

<main class="screen">
  <Header onback={() => go('start')} />
  <div class="content">
    <div>
      <span class="label">Zum Vorlesen</span>
      <h1 class="display title">{theme.name}</h1>
      <p class="intro">{card.intro}</p>
    </div>
    <div class="row tools">
      <button class="btn" onclick={() => (night = true)}><Icon name="moon" /> Nacht starten</button>
      {#if canSpeak}
        <button class="btn" onclick={speak} aria-pressed={speaking}><Icon name={speaking ? 'stop' : 'speak'} /> {speaking ? 'Stopp' : 'Vorlesen'}</button>
      {/if}
    </div>
    {#each card.sections as s}
      <section class="panel">
        <h2 class="panel-title"><Emblem icon={s.icon} size="sm" />{s.title}</h2>
        <ul>
          {#each s.items as item}
            <li class:with-icon={item.icon}>
              {#if item.icon}<span class="li-icon"><Icon name={item.icon} size={18} /></span>{/if}
              <span>{#if item.label}<b>{item.label}:</b>{' '}{/if}{item.text}</span>
            </li>
          {/each}
        </ul>
      </section>
    {/each}
    {#if error}<p class="issue issue-error"><Icon name="error" size={18} /> {error}</p>{/if}
  </div>
  <div class="footer">
    <div class="row">
      <HoldButton class="btn" duration={1500} onconfirm={() => (resolve = true)} label="Auflösung: gedrückt halten"><Icon name="unlock" /> Auflösung</HoldButton>
      <button class="btn btn-primary" onclick={() => (confirmNew = true)}><Icon name="dice" /> Neue Runde</button>
    </div>
    <p class="note">Auflösung erst nach dem Spiel – gedrückt halten.</p>
  </div>
</main>

{#if night}
  <NightOverlay {theme} cooldown={game.config.cooldownOnNightStart ? game.config.killCooldown : 0} onclose={() => (night = false)} />
{/if}

<Sheet open={resolve} title="Auflösung" onclose={() => (resolve = false)}>
  <ul class="resolve">
    {#each resolved as { a, r } (a.playerId)}
      <li class="res team-{r.team}">
        <Emblem icon={r.icon} size="sm" />
        <span class="rn">{a.name}</span>
        {#if a.lover}<span class="lv" title="{theme.lovers.name} mit {a.lover.partner}"><Icon name={theme.lovers.icon} size={16} /></span>{/if}
        <span class="rr">{r.name}</span>
      </li>
    {/each}
  </ul>
  <div class="win">
    <span class="label">Wer hat gewonnen?</span>
    <div class="wins">
      {#each winnerOpts as o}
        <button class="btn btn-small" class:picked={game.winner === o.value} disabled={!!game.winner && game.winner !== o.value} onclick={() => setWinner(o.value)}>
          {#if game.winner === o.value}<Icon name="trophy" size={18} />{/if}{o.label}
        </button>
      {/each}
    </div>
    {#if game.winner}<p class="muted saved"><Icon name="check" size={16} /> In der Statistik gespeichert.</p>{/if}
  </div>
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
  .tools :global(.btn) { flex: 1; min-height: 48px; font-size: 0.95rem; }
  section { padding: 14px 16px; }
  .panel-title { margin-bottom: 8px; }
  ul { margin: 0; padding-left: 1.1em; display: flex; flex-direction: column; gap: 5px; }
  li::marker { color: var(--primary); }
  li.with-icon { list-style: none; margin-left: -1.1em; display: flex; gap: 8px; align-items: flex-start; }
  .li-icon { color: var(--primary); display: grid; padding-top: 2px; }
  .row :global(.btn) { flex: 1; font-size: 0.95rem; padding: 0 0.6rem; }
  .note { text-align: center; font-size: 0.78rem; color: var(--muted); }
  .resolve { list-style: none; padding: 0; gap: 8px; }
  .res {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    margin-left: 0;
    border-radius: var(--radius);
    background: var(--surface2);
    border-left: 4px solid var(--good);
  }
  .team-imposter { border-left-color: var(--danger); }
  .team-neutral { border-left-color: var(--warn); }
  .rn { flex: 1; font-weight: 700; }
  .lv { color: var(--accent); display: grid; }
  .rr { color: var(--muted); font-size: 0.92rem; }
  .win { display: flex; flex-direction: column; gap: 8px; margin-top: 6px; }
  .wins { display: flex; flex-wrap: wrap; gap: 8px; }
  .wins .btn { flex: 1 1 40%; }
  .picked { background: var(--primary); color: var(--on-primary); border-color: transparent; }
  .saved { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; }
</style>

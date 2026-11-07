<script lang="ts">
  import { store } from '../../lib/store.svelte';
  import { go } from '../../lib/router.svelte';
  import { themedRole } from '../../lib/text';
  import type { Theme } from '../../themes/types';
  import Header from '../components/Header.svelte';
  import HoldButton from '../components/HoldButton.svelte';
  import Confirm from '../components/Confirm.svelte';
  import RevealCard from '../reveal/RevealCard.svelte';
  import Icon from '../icons/Icon.svelte';
  import { flip } from 'svelte/animate';
  let { theme }: { theme: Theme } = $props();

  type Phase = 'list' | 'handover' | 'reveal' | 'hidden';
  let phase = $state<Phase>('list');
  let currentId = $state<string | null>(null);
  let again = $state(false);
  let seenNow = $state(false);
  let confirmAbort = $state(false);

  const game = $derived(store.game!);
  const seenCount = $derived(game.assignments.filter((a) => a.seen).length);
  const total = $derived(game.assignments.length);
  const allSeen = $derived(seenCount === total);
  // Ungeöffnete oben, geöffnete rutschen nach unten
  // justSeen bleibt kurz an alter Stelle, damit man das Nach-unten-Rutschen sieht
  let justSeen = $state<string | null>(null);
  const isDone = (a: { seen: boolean; playerId: string }) => Number(a.seen && a.playerId !== justSeen);
  const ordered = $derived([...game.assignments].sort((x, y) => isDone(x) - isDone(y)));
  $effect(() => {
    if (phase === 'list' && justSeen) {
      const t = setTimeout(() => (justSeen = null), 350);
      return () => clearTimeout(t);
    }
  });
  const current = $derived(game.assignments.find((a) => a.playerId === currentId));

  function pick(id: string, isAgain = false) {
    currentId = id;
    again = isAgain;
    seenNow = false;
    phase = 'handover';
  }
  function done() {
    phase = 'hidden';
  }
  function next() {
    justSeen = currentId;
    currentId = null;
    phase = 'list';
  }

  // Bildschirm anlassen, solange verteilt wird
  $effect(() => {
    let lock: WakeLockSentinel | null = null;
    const request = () =>
      (navigator as Navigator & { wakeLock?: WakeLock }).wakeLock?.request('screen').then((l) => (lock = l)).catch(() => {});
    request();
    const onVis = () => {
      if (document.visibilityState === 'visible') request();
      else if (phase === 'reveal') next(); // App gewechselt → Rolle verbergen
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      lock?.release().catch(() => {});
    };
  });
</script>

{#if phase === 'list'}
  <main class="screen">
    <Header onback={() => (seenCount ? (confirmAbort = true) : go('rules'))} />
    <div class="content">
      <div>
        <h1 class="display title">{allSeen ? 'Alle bereit!' : 'Wer ist dran?'}</h1>
        <p class="subtitle">{allSeen ? 'Jetzt die Regeln vorlesen.' : 'Tippe auf deinen Namen.'}</p>
      </div>
      <div class="progress" aria-label="{seenCount} von {total} bereit">
        <span class="bar" style="width:{(seenCount / total) * 100}%"></span>
      </div>
      <span class="label">{seenCount} / {total} kennen ihre Rolle</span>
      <ul class="names">
        {#each ordered as a (a.playerId)}
          <li animate:flip={{ duration: 450 }}>
            {#if a.seen}
              <HoldButton class="tile done" duration={1500} onconfirm={() => pick(a.playerId, true)} label="{a.name}: nochmal ansehen, gedrückt halten">
                <span class="tname">{a.name}</span>
                <span class="tag"><Icon name="check" size={16} /> halten = nochmal</span>
              </HoldButton>
            {:else}
              <button class="tile" onclick={() => pick(a.playerId)}>
                <span class="tname">{a.name}</span>
                <span class="arrow"><Icon name="next" /></span>
              </button>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
    {#if allSeen}
      <div class="footer">
        <button class="btn btn-primary" onclick={() => go('ready')}><Icon name="rules" /> Regeln vorlesen</button>
      </div>
    {/if}
  </main>
{:else if phase === 'handover' && current}
  <main class="screen center">
    <div class="content mid">
      <span class="label">Gib das Handy an</span>
      <h1 class="display hand-name">{current.name}</h1>
      {#if again}
        <p class="warnbox">Nur {current.name} darf hinschauen!</p>
      {:else}
        <p class="muted">Alle anderen schauen weg.</p>
      {/if}
    </div>
    <div class="footer">
      <button class="btn btn-primary" onclick={() => (phase = 'reveal')}>Ich bin {current.name}</button>
      <button class="btn btn-ghost" onclick={next}>Zurück</button>
    </div>
  </main>
{:else if phase === 'reveal' && current}
  <main class="screen center">
    <div class="content mid">
      <span class="label">{current.name}</span>
      <RevealCard
        {theme}
        role={themedRole(current.roleId, theme, game.config)}
        info={current.info}
        lover={current.lover}
        onseen={() => {
          seenNow = true;
          current.seen = true;
        }}
      />
      <p class="hint muted">{seenNow ? 'Loslassen versteckt die Rolle sofort.' : 'Gedrückt halten'}</p>
    </div>
    <div class="footer">
      <button class="btn btn-primary" disabled={!seenNow} onclick={done}>Verstanden – verdecken</button>
    </div>
  </main>
{:else if phase === 'hidden'}
  <main class="screen center">
    <div class="content mid">
      <span class="ok"><Icon name="check" size={44} /></span>
      <h1 class="display title">Rolle verdeckt</h1>
      <p class="muted">{allSeen ? 'Alle kennen ihre Rolle.' : 'Gib das Handy an die nächste Person.'}</p>
    </div>
    <div class="footer">
      <button class="btn btn-primary" onclick={next}>Weiter</button>
    </div>
  </main>
{/if}

<Confirm
  open={confirmAbort}
  title="Verteilung abbrechen?"
  text="Bereits gesehene Rollen bleiben gültig, bis neu verteilt wird."
  confirmLabel="Zu den Regeln"
  oncancel={() => (confirmAbort = false)}
  onconfirm={() => {
    confirmAbort = false;
    go('rules');
  }}
/>

<style>
  .center { text-align: center; }
  .mid { justify-content: center; align-items: center; gap: 16px; }
  .progress { height: 6px; border-radius: 6px; background: var(--surface2); overflow: hidden; }
  .bar { display: block; height: 100%; background: var(--primary); transition: width 0.4s var(--ease); }
  .names { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
  .names :global(.tile) {
    width: 100%;
    min-height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 0 20px;
    border-radius: var(--radius-lg);
    border: 1px solid var(--border);
    background: var(--surface);
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
    text-align: left;
    transition: transform 0.12s var(--ease);
  }
  .names :global(.tile:active) { transform: scale(0.98); }
  .names :global(.tile .inner) { width: 100%; justify-content: space-between; }
  .names :global(.tile.done) { opacity: 0.5; }
  .tname { font-size: 1.3rem; font-weight: 700; }
  .arrow { display: grid; color: var(--primary); }
  .tag { display: flex; align-items: center; gap: 4px; font-size: 0.8rem; color: var(--muted); }
  .hand-name { font-size: clamp(2.6rem, 14vw, 4.4rem); word-break: break-word; }
  .warnbox { color: var(--warn); font-weight: 700; padding: 10px 14px; border: 1px solid var(--warn); border-radius: var(--radius); }
  .hint { min-height: 1.4em; }
  .ok {
    display: grid;
    place-items: center;
    width: 92px;
    height: 92px;
    border-radius: 50%;
    border: 2px solid var(--good);
    color: var(--good);
    font-size: 2.6rem;
    animation: pop 0.4s var(--ease);
  }
  @keyframes pop { from { transform: scale(0.6); opacity: 0; } }
</style>

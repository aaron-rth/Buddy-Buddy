<script lang="ts">
  /**
   * „Nacht starten“: 10 s zum Verteilen (leises Ticken), dann Gong = Licht aus.
   * Optional danach die Kill-Sperre als Countdown mit leisem Glockenton am Ende.
   * Bildschirm bleibt dunkel, damit er im Haus nicht leuchtet.
   */
  import { store } from '../../lib/store.svelte';
  import { tick, gong, chime } from '../../lib/sound';
  import type { Theme } from '../../themes/types';
  import Icon from '../icons/Icon.svelte';

  let { theme, cooldown, onclose }: { theme: Theme; cooldown: number; onclose: () => void } = $props();

  const DISPERSE = 10;
  let phase = $state<'disperse' | 'lock' | 'night'>('disperse');
  let left = $state(DISPERSE);

  $effect(() => {
    let lock: WakeLockSentinel | null = null;
    (navigator as Navigator & { wakeLock?: WakeLock }).wakeLock?.request('screen').then((l) => (lock = l)).catch(() => {});
    const sound = store.prefs.sound;
    let t = DISPERSE;
    let lockLeft = cooldown;
    if (sound) tick();
    const id = setInterval(() => {
      if (phase === 'disperse') {
        t--;
        left = t;
        if (t > 0) {
          if (sound) tick(t <= 3);
        } else {
          if (sound) gong();
          navigator.vibrate?.(200);
          if (cooldown > 0) {
            phase = 'lock';
            left = lockLeft;
          } else phase = 'night';
        }
      } else if (phase === 'lock') {
        lockLeft--;
        left = lockLeft;
        if (lockLeft <= 0) {
          if (sound) chime();
          phase = 'night';
        }
      }
    }, 1000);
    return () => {
      clearInterval(id);
      lock?.release().catch(() => {});
    };
  });
</script>

<div class="night" class:dark={phase !== 'disperse'} role="dialog" aria-modal="true" aria-label="Nacht">
  {#if phase === 'disperse'}
    <span class="label">Verteilt euch</span>
    <span class="num display">{left}</span>
    <p>Gleich geht das Licht aus.</p>
  {:else if phase === 'lock'}
    <Icon name="moon" size={40} />
    <p class="big display">Licht aus</p>
    <p class="muted">Kill-Sperre: <b class="mono">{left}</b> s</p>
  {:else}
    <Icon name="moon" size={40} />
    <p class="big display">Die {theme.terms.night} läuft</p>
    <p class="muted">Handy weglegen.</p>
  {/if}
  <button class="btn btn-ghost close" onclick={onclose}><Icon name="close" size={18} /> Schließen</button>
</div>

<style>
  .night {
    position: fixed;
    inset: 0;
    z-index: 80;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 24px;
    text-align: center;
    background: color-mix(in srgb, var(--bg) 92%, black);
    color: var(--text);
    transition: background 1.2s ease, color 1.2s ease;
    animation: in 0.3s ease;
  }
  .night.dark { background: #000; color: #555; }
  .num { font-size: 9rem; line-height: 1; color: var(--primary); font-variant-numeric: tabular-nums; }
  .big { font-size: 2rem; }
  .mono { font-variant-numeric: tabular-nums; }
  .close { position: absolute; bottom: calc(20px + env(safe-area-inset-bottom)); width: auto; }
  .dark .close { color: #444; }
  @keyframes in { from { opacity: 0; } }
</style>

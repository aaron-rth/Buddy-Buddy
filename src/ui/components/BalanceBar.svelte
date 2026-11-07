<script lang="ts">
  import type { Analysis } from '../../core/balance';
  import type { Theme } from '../../themes/types';
  let { a, theme }: { a: Analysis; theme: Theme } = $props();

  const label = $derived(
    {
      balanced: 'Ausgeglichen',
      crew: `Vorteil ${theme.terms.crews}`,
      'crew-strong': `Klarer Vorteil ${theme.terms.crews}`,
      imposter: `Vorteil ${theme.terms.imposters}`,
      'imposter-strong': `Klarer Vorteil ${theme.terms.imposters}`,
    }[a.verdict],
  );
</script>

<div class="bal">
  <div class="top">
    <span class="label">Balance</span>
    <strong class:ok={a.verdict === 'balanced'} class:bad={a.verdict.endsWith('strong')}>{label}</strong>
  </div>
  <div class="track">
    <span class="zone"></span>
    <span class="marker" style="left:{50 + a.position * 46}%"></span>
  </div>
  <div class="ends"><span>{theme.terms.imposters}</span><span>{theme.terms.crews}</span></div>
</div>

<style>
  .top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
  strong { color: var(--warn); }
  strong.ok { color: var(--good); }
  strong.bad { color: var(--danger); }
  .track {
    position: relative;
    height: 10px;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--danger), var(--warn) 30%, var(--good) 45%, var(--good) 55%, var(--warn) 70%, var(--danger));
    opacity: 0.85;
  }
  .marker {
    position: absolute;
    top: 50%;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--text);
    border: 4px solid var(--bg);
    transform: translate(-50%, -50%);
    transition: left 0.4s var(--ease);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  }
  .ends { display: flex; justify-content: space-between; margin-top: 6px; font-size: 0.75rem; color: var(--muted); }
</style>

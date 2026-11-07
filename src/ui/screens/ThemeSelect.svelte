<script lang="ts">
  import { store } from '../../lib/store.svelte';
  import { go } from '../../lib/router.svelte';
  import { THEMES } from '../../themes';
  import Header from '../components/Header.svelte';
</script>

<main class="screen">
  <Header step={1} onback={() => go('start')} />
  <div class="content">
    <div>
      <h1 class="display title">Wählt eure Welt</h1>
      <p class="subtitle">Ändert Look, Begriffe und Rollennamen.</p>
    </div>
    <div class="grid">
      {#each THEMES as t (t.id)}
        {@const sel = store.config.themeId === t.id}
        <button
          class="tile"
          class:sel
          aria-pressed={sel}
          onclick={() => (store.config.themeId = t.id)}
          style="--t-bg:{t.palette.bg};--t-primary:{t.palette.primary};--t-text:{t.palette.text};--t-muted:{t.palette.muted};--t-font:{t.fonts.display};--t-radius:{Math.round(t.radius * 1.4)}px"
        >
          <span class="scene" aria-hidden="true"><t.Scene /></span>
          <span class="shade" aria-hidden="true"></span>
          {#if sel}<span class="check" aria-hidden="true">✓</span>{/if}
          <span class="info">
            <span class="genre">{t.genre}</span>
            <span class="name">{t.name}</span>
            <span class="vs">{t.roles.imposter?.icon} {t.terms.imposters}</span>
          </span>
        </button>
      {/each}
    </div>
  </div>
  <div class="footer">
    <button class="btn btn-primary" onclick={() => go('players')}>Weiter</button>
  </div>
</main>

<style>
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .tile {
    position: relative;
    aspect-ratio: 3 / 4;
    border-radius: var(--t-radius);
    overflow: hidden;
    border: 2px solid transparent;
    background: var(--t-bg);
    padding: 0;
    text-align: left;
    transition: transform 0.2s var(--ease), border-color 0.2s, box-shadow 0.2s;
  }
  .tile:active { transform: scale(0.97); }
  .tile.sel { border-color: var(--t-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--t-primary) 30%, transparent), 0 10px 30px rgba(0, 0, 0, 0.5); }
  .scene { position: absolute; inset: 0; }
  .scene :global(svg) { width: 100%; height: 100%; }
  .shade { position: absolute; inset: 0; background: linear-gradient(to top, var(--t-bg) 8%, transparent 60%); }
  .check {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: var(--t-primary);
    color: var(--t-bg);
    font-weight: 800;
  }
  .info { position: absolute; left: 12px; right: 12px; bottom: 12px; display: flex; flex-direction: column; gap: 2px; }
  .genre { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--t-muted); font-weight: 600; }
  .name { font-family: var(--t-font); font-size: 1.35rem; font-weight: 800; line-height: 1.1; color: var(--t-text); }
  .vs { font-size: 0.8rem; color: var(--t-muted); }
</style>

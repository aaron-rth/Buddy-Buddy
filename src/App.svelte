<script lang="ts">
  import { untrack } from 'svelte';
  import { store, persist } from './lib/store.svelte';
  import { route, go } from './lib/router.svelte';
  import { getTheme } from './themes';
  import { applyAutoImposters } from './core/defaults';
  import Backdrop from './ui/components/Backdrop.svelte';
  import Start from './ui/screens/Start.svelte';
  import ThemeSelect from './ui/screens/ThemeSelect.svelte';
  import Players from './ui/screens/Players.svelte';
  import Rules from './ui/screens/Rules.svelte';
  import Deal from './ui/screens/Deal.svelte';
  import Ready from './ui/screens/Ready.svelte';

  const theme = $derived(getTheme(store.config.themeId));

  // Theme → CSS-Variablen
  $effect(() => {
    const p = theme.palette;
    const root = document.documentElement;
    const vars: Record<string, string> = {
      '--bg': p.bg,
      '--bg2': p.bg2,
      '--surface': p.surface,
      '--surface2': p.surface2,
      '--border': p.border,
      '--text': p.text,
      '--muted': p.muted,
      '--primary': p.primary,
      '--on-primary': p.onPrimary,
      '--accent': p.accent,
      '--danger': p.danger,
      '--warn': p.warn,
      '--good': p.good,
      '--font-display': theme.fonts.display,
      '--font-label': theme.fonts.label ?? 'var(--font-body)',
      '--radius': `${theme.radius}px`,
      '--radius-lg': `${Math.round(theme.radius * 1.4)}px`,
    };
    for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);
    root.dataset.theme = theme.id;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', p.bg);
  });

  // Imposter-Empfehlung folgt der Spielerzahl
  $effect(() => {
    store.config.players.length;
    untrack(() => applyAutoImposters(store.config));
  });

  // Speichern
  $effect(() => {
    $state.snapshot(store);
    persist();
  });

  // Ohne Verteilung keine Verteilungs-Screens
  $effect(() => {
    if ((route.screen === 'deal' || route.screen === 'ready') && !store.game) untrack(() => go('rules', true));
  });
</script>

<Backdrop {theme} />

{#key route.screen}
  {#if route.screen === 'start'}
    <Start {theme} />
  {:else if route.screen === 'theme'}
    <ThemeSelect />
  {:else if route.screen === 'players'}
    <Players {theme} />
  {:else if route.screen === 'rules'}
    <Rules {theme} />
  {:else if route.screen === 'deal' && store.game}
    <Deal {theme} />
  {:else if route.screen === 'ready' && store.game}
    <Ready {theme} />
  {/if}
{/key}

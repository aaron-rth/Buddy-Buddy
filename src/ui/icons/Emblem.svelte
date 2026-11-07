<script lang="ts">
  /** Rollen-Icon im Theme-Rahmen. Für alle Rollen gleich gefärbt (verrät nichts). */
  import Icon from './Icon.svelte';
  let { icon, size = 'md' }: { icon: string; size?: 'sm' | 'md' | 'lg' } = $props();
  const px = $derived({ sm: 20, md: 24, lg: 46 }[size]);
</script>

<span class="emblem emblem-{size}" aria-hidden="true"><Icon name={icon} size={px} /></span>

<style>
  .emblem {
    position: relative;
    flex: none;
    display: inline-grid;
    place-items: center;
    color: var(--primary);
    border-radius: var(--emblem-radius, 50%);
    background: radial-gradient(circle at 50% 35%, color-mix(in srgb, var(--primary) 18%, transparent), color-mix(in srgb, var(--primary) 4%, transparent) 70%);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary) 45%, transparent);
    clip-path: var(--emblem-clip, none);
  }
  .emblem-sm { width: 36px; height: 36px; }
  .emblem-md { width: 42px; height: 42px; }
  .emblem-lg { width: 96px; height: 96px; }
  .emblem-lg::after {
    content: '';
    position: absolute;
    inset: 6px;
    border-radius: inherit;
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary) 25%, transparent);
    clip-path: var(--emblem-clip, none);
  }
  .emblem-lg { box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--primary) 60%, transparent), 0 0 40px color-mix(in srgb, var(--primary) 22%, transparent); }
</style>

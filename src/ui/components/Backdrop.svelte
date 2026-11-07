<script lang="ts">
  import type { Theme } from '../../themes/types';
  import Ambient from './Ambient.svelte';
  let { theme }: { theme: Theme } = $props();
</script>

<div class="backdrop" aria-hidden="true">
  {#key theme.id}
    <div class="scene"><theme.Scene /></div>
    <Ambient kinds={theme.ambient} />
  {/key}
  <div class="vignette"></div>
</div>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    background: var(--bg);
    pointer-events: none;
  }
  .scene {
    position: absolute;
    inset: 0;
    animation: fade 0.8s ease both;
  }
  .vignette {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(120% 80% at 50% 30%, transparent 40%, color-mix(in srgb, var(--bg) 70%, transparent) 100%),
      linear-gradient(to bottom, color-mix(in srgb, var(--bg) 35%, transparent), transparent 30%, transparent 60%, color-mix(in srgb, var(--bg) 60%, transparent));
  }
  @keyframes fade {
    from { opacity: 0; transform: scale(1.03); }
  }
</style>

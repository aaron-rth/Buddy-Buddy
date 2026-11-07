<script lang="ts">
  import type { Snippet } from 'svelte';
  let {
    duration = 1200,
    onconfirm,
    children,
    class: cls = 'btn',
    label,
  }: { duration?: number; onconfirm: () => void; children: Snippet; class?: string; label?: string } = $props();

  let progress = $state(0);
  let raf = 0;
  let start = 0;

  function down(e: PointerEvent) {
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    start = performance.now();
    const tick = (t: number) => {
      progress = Math.min(1, (t - start) / duration);
      if (progress >= 1) {
        stop();
        navigator.vibrate?.(30);
        onconfirm();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }
  function stop() {
    cancelAnimationFrame(raf);
    progress = 0;
  }
</script>

<button
  class="hold {cls}"
  aria-label={label}
  onpointerdown={down}
  onpointerup={stop}
  onpointercancel={stop}
  onlostpointercapture={stop}
  oncontextmenu={(e) => e.preventDefault()}
  onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && onconfirm()}
  style="--p:{progress}"
>
  <span class="fill" aria-hidden="true"></span>
  <span class="inner">{@render children()}</span>
</button>

<style>
  .hold {
    position: relative;
    overflow: hidden;
    touch-action: none;
    -webkit-touch-callout: none;
    user-select: none;
  }
  .fill {
    position: absolute;
    inset: 0;
    background: var(--primary);
    opacity: 0.28;
    transform-origin: left;
    transform: scaleX(var(--p));
  }
  .inner { position: relative; display: inline-flex; align-items: center; gap: 0.5rem; }
</style>

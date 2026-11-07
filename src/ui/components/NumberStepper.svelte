<script lang="ts">
  let {
    value = $bindable(),
    min = 0,
    max = 99,
    step = 1,
    unit = '',
    label = '',
    onchange,
  }: { value: number; min?: number; max?: number; step?: number; unit?: string; label?: string; onchange?: (v: number) => void } = $props();

  function set(v: number) {
    const next = Math.min(max, Math.max(min, v));
    if (next !== value) {
      value = next;
      onchange?.(next);
    }
  }
</script>

<div class="stepper">
  {#if label}<span class="lbl">{label}</span>{/if}
  <div class="ctrl">
    <button class="icon-btn" onclick={() => set(value - step)} disabled={value <= min} aria-label="{label} weniger">−</button>
    <output class="val">{value}<small>{unit}</small></output>
    <button class="icon-btn" onclick={() => set(value + step)} disabled={value >= max} aria-label="{label} mehr">+</button>
  </div>
</div>

<style>
  .stepper { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .lbl { font-weight: 600; }
  .ctrl { display: flex; align-items: center; gap: 6px; }
  .val {
    min-width: 64px;
    text-align: center;
    font-size: 1.5rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
  }
  .val small { font-size: 0.85rem; font-weight: 600; color: var(--muted); margin-left: 2px; }
  .icon-btn:disabled { opacity: 0.3; }
</style>

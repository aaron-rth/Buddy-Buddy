<script lang="ts" generics="T extends string | number">
  let {
    value = $bindable(),
    options,
    label = '',
    onchange,
  }: { value: T | null; options: { value: T; label: string }[]; label?: string; onchange?: (v: T) => void } = $props();
</script>

<div class="seg" role="radiogroup" aria-label={label}>
  {#each options as o}
    <button
      role="radio"
      aria-checked={value === o.value}
      class:active={value === o.value}
      onclick={() => {
        value = o.value;
        onchange?.(o.value);
      }}>{o.label}</button>
  {/each}
</div>

<style>
  .seg {
    display: flex;
    gap: 4px;
    padding: 4px;
    border-radius: calc(var(--radius) + 4px);
    background: color-mix(in srgb, var(--bg) 60%, transparent);
    border: 1px solid var(--border);
  }
  button {
    flex: 1;
    min-height: 40px;
    border: none;
    border-radius: var(--radius);
    background: transparent;
    color: var(--muted);
    font-weight: 600;
    font-size: 0.92rem;
    transition: background 0.2s, color 0.2s;
    white-space: nowrap;
  }
  button.active { background: var(--primary); color: var(--on-primary); }
</style>

<script lang="ts">
  import type { Snippet } from 'svelte';
  let {
    checked = $bindable(),
    label,
    hint = '',
    children,
    onchange,
  }: { checked: boolean; label: string; hint?: string; children?: Snippet; onchange?: (v: boolean) => void } = $props();
</script>

<label class="toggle">
  {#if children}{@render children()}{/if}
  <span class="text">
    <span class="l">{label}</span>
    {#if hint}<span class="h">{hint}</span>{/if}
  </span>
  <input type="checkbox" class="sr-only" bind:checked onchange={() => onchange?.(checked)} />
  <span class="switch" class:on={checked} aria-hidden="true"><span class="knob"></span></span>
</label>

<style>
  .toggle {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 52px;
    cursor: pointer;
    user-select: none;
  }
  .text { flex: 1; display: flex; flex-direction: column; }
  .l { font-weight: 600; }
  .h { font-size: 0.85rem; color: var(--muted); line-height: 1.3; }
  .switch {
    flex: none;
    width: 52px;
    height: 32px;
    border-radius: 999px;
    background: var(--surface2);
    border: 1px solid var(--border);
    position: relative;
    transition: background 0.2s;
  }
  .switch.on { background: var(--primary); border-color: transparent; }
  .knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--text);
    transition: transform 0.22s var(--ease), background 0.2s;
  }
  .on .knob { transform: translateX(20px); background: var(--on-primary); }
  .toggle:has(input:focus-visible) .switch { outline: 2px solid var(--primary); outline-offset: 2px; }
</style>

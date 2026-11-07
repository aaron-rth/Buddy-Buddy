<script lang="ts">
  import { store } from '../../lib/store.svelte';
  import { go } from '../../lib/router.svelte';
  import { MIN_PLAYERS } from '../../core/defaults';
  import { uid } from '../../core/rng';
  import type { Theme } from '../../themes/types';
  import Header from '../components/Header.svelte';
  import Confirm from '../components/Confirm.svelte';
  let { theme }: { theme: Theme } = $props();

  let input = $state('');
  let error = $state('');
  let editing = $state<string | null>(null);
  let editValue = $state('');
  let confirmClear = $state(false);
  let inputEl: HTMLInputElement;

  const players = $derived(store.config.players);
  const n = $derived(players.length);

  function clean(name: string) {
    return name.replace(/\s+/g, ' ').trim().slice(0, 20);
  }
  function exists(name: string, exceptId?: string) {
    return players.some((p) => p.id !== exceptId && p.name.toLowerCase() === name.toLowerCase());
  }

  function add(e?: Event) {
    e?.preventDefault();
    const names = input.split(/[,;\n]/).map(clean).filter(Boolean);
    const dupes: string[] = [];
    for (const name of names) {
      if (exists(name)) dupes.push(name);
      else store.config.players.push({ id: uid(), name });
    }
    error = dupes.length ? `${dupes.join(', ')} gibt es schon.` : '';
    input = '';
    inputEl?.focus();
  }

  function remove(id: string) {
    store.config.players = players.filter((p) => p.id !== id);
  }

  function startEdit(id: string, name: string) {
    editing = id;
    editValue = name;
  }
  function saveEdit() {
    const p = players.find((x) => x.id === editing);
    const name = clean(editValue);
    if (p && name && !exists(name, p.id)) p.name = name;
    editing = null;
  }
  function focus(el: HTMLInputElement) {
    el.focus();
    el.select();
  }
</script>

<main class="screen">
  <Header step={2} onback={() => go('theme')} />
  <div class="content">
    <div>
      <h1 class="display title">Wer spielt mit?</h1>
      <p class="subtitle">Mehrere Namen mit Komma trennen.</p>
    </div>

    <form class="add" onsubmit={add}>
      <input
        bind:this={inputEl}
        class="field"
        bind:value={input}
        placeholder="Name eingeben"
        autocomplete="off"
        autocapitalize="words"
        enterkeyhint="done"
        maxlength="200"
        aria-label="Spielername"
      />
      <button class="icon-btn add-btn" type="submit" disabled={!input.trim()} aria-label="Hinzufügen">＋</button>
    </form>
    {#if error}<p class="issue issue-warn">{error}</p>{/if}

    {#if n}
      <div class="list-head">
        <span class="label">{n} Spieler</span>
        <button class="btn btn-ghost btn-small" onclick={() => (confirmClear = true)}>Alle entfernen</button>
      </div>
      <ul class="list">
        {#each players as p, i (p.id)}
          <li class="item panel">
            <span class="num">{i + 1}</span>
            {#if editing === p.id}
              <input
                class="field edit"
                bind:value={editValue}
                use:focus
                onblur={saveEdit}
                onkeydown={(e) => e.key === 'Enter' && saveEdit()}
                maxlength="20"
                aria-label="Name ändern"
              />
            {:else}
              <button class="name" onclick={() => startEdit(p.id, p.name)} aria-label="{p.name} umbenennen">{p.name}</button>
            {/if}
            <button class="icon-btn rm" onclick={() => remove(p.id)} aria-label="{p.name} entfernen">✕</button>
          </li>
        {/each}
      </ul>
    {:else}
      <div class="empty muted">
        <span class="big">{theme.roles.crew?.icon ?? '🙂'}</span>
        Mindestens {MIN_PLAYERS} Spieler.
      </div>
    {/if}
  </div>
  <div class="footer">
    <button class="btn btn-primary" disabled={n < MIN_PLAYERS} onclick={() => go('rules')}>
      {n < MIN_PLAYERS ? `Noch ${MIN_PLAYERS - n} Spieler` : `Weiter · ${n} Spieler`}
    </button>
  </div>
</main>

<Confirm
  open={confirmClear}
  title="Alle entfernen?"
  confirmLabel="Entfernen"
  oncancel={() => (confirmClear = false)}
  onconfirm={() => {
    store.config.players = [];
    confirmClear = false;
  }}
/>

<style>
  .add { display: flex; gap: 8px; }
  .add .field { flex: 1; }
  .add-btn { width: 52px; height: 52px; border-radius: var(--radius); background: var(--primary); color: var(--on-primary); border: none; font-size: 1.4rem; }
  .add-btn:disabled { opacity: 0.35; }
  .list-head { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
  .list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
  .item { display: flex; align-items: center; gap: 10px; padding: 6px 6px 6px 14px; animation: in 0.25s var(--ease); }
  .num { width: 22px; color: var(--muted); font-variant-numeric: tabular-nums; font-size: 0.9rem; }
  .name { flex: 1; text-align: left; background: none; border: none; padding: 10px 0; font-size: 1.1rem; font-weight: 600; }
  .edit { flex: 1; min-height: 44px; }
  .rm { border: none; background: transparent; color: var(--muted); }
  .empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 40px 0; }
  .big { font-size: 2.6rem; }
  @keyframes in { from { opacity: 0; transform: translateY(-6px); } }
</style>

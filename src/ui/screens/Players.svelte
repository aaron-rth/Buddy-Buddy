<script lang="ts">
  import { store } from '../../lib/store.svelte';
  import { go } from '../../lib/router.svelte';
  import { MIN_PLAYERS } from '../../core/defaults';
  import { uid } from '../../core/rng';
  import type { Group } from '../../core/types';
  import type { Theme } from '../../themes/types';
  import Header from '../components/Header.svelte';
  import Confirm from '../components/Confirm.svelte';
  import Sheet from '../components/Sheet.svelte';
  import Icon from '../icons/Icon.svelte';
  import Emblem from '../icons/Emblem.svelte';
  let { theme }: { theme: Theme } = $props();

  let input = $state('');
  let error = $state('');
  let editing = $state<string | null>(null);
  let editValue = $state('');
  let confirmClear = $state(false);
  let groupsOpen = $state(false);
  let groupName = $state('');
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

  // ---- Gruppen ----
  function saveGroup(e?: Event) {
    e?.preventDefault();
    const name = groupName.trim().slice(0, 24);
    if (!name || !n) return;
    const names = players.map((p) => p.name);
    const existing = store.groups.find((g) => g.name.toLowerCase() === name.toLowerCase());
    if (existing) existing.players = names;
    else store.groups.push({ id: uid(), name, players: names });
    groupName = '';
  }
  function loadGroup(g: Group) {
    store.config.players = g.players.map((name) => ({ id: uid(), name }));
    groupsOpen = false;
  }
  function deleteGroup(id: string) {
    store.groups = store.groups.filter((g) => g.id !== id);
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
      <button class="icon-btn add-btn" type="submit" disabled={!input.trim()} aria-label="Hinzufügen"><Icon name="plus" /></button>
    </form>
    {#if error}<p class="issue issue-warn">{error}</p>{/if}

    {#if store.groups.length && !n}
      <div class="quick">
        {#each store.groups as g (g.id)}
          <button class="chip group-chip" onclick={() => loadGroup(g)}><Icon name="users" size={16} />{g.name} · {g.players.length}</button>
        {/each}
      </div>
    {/if}

    <div class="list-head">
      <span class="label">{n} Spieler</span>
      <div class="row">
        <button class="btn btn-ghost btn-small" onclick={() => (groupsOpen = true)}><Icon name="users" size={18} /> Gruppen</button>
        {#if n}<button class="btn btn-ghost btn-small" onclick={() => (confirmClear = true)}><Icon name="trash" size={18} /></button>{/if}
      </div>
    </div>

    {#if n}
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
            <button class="icon-btn rm" onclick={() => remove(p.id)} aria-label="{p.name} entfernen"><Icon name="close" size={18} /></button>
          </li>
        {/each}
      </ul>
    {:else}
      <div class="empty muted">
        <Emblem icon={theme.roles.crew?.icon ?? 'users'} size="lg" />
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

<Sheet open={groupsOpen} title="Gruppen" onclose={() => (groupsOpen = false)}>
  {#if store.groups.length}
    <ul class="groups">
      {#each store.groups as g (g.id)}
        <li class="group panel">
          <button class="gload" onclick={() => loadGroup(g)}>
            <strong>{g.name}</strong>
            <span class="muted">{g.players.join(', ')}</span>
          </button>
          <button class="icon-btn rm" onclick={() => deleteGroup(g.id)} aria-label="{g.name} löschen"><Icon name="trash" size={18} /></button>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="muted">Noch keine Gruppen gespeichert.</p>
  {/if}
  <form class="add" onsubmit={saveGroup}>
    <input class="field" bind:value={groupName} placeholder="Name, z. B. WG" maxlength="24" aria-label="Gruppenname" />
    <button class="btn btn-primary btn-small save" type="submit" disabled={!groupName.trim() || !n}><Icon name="save" size={18} /> Speichern</button>
  </form>
  <p class="muted hint">Speichert die aktuellen {n} Spieler. Gleicher Name überschreibt.</p>
</Sheet>

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
  .add-btn { width: 52px; height: 52px; border-radius: var(--radius); background: var(--primary); color: var(--on-primary); border: none; }
  .add-btn:disabled { opacity: 0.35; }
  .quick { display: flex; flex-wrap: wrap; gap: 8px; }
  .group-chip { padding: 8px 12px; font-size: 0.9rem; color: var(--text); }
  .list-head { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
  .list-head .btn-small { padding: 0 8px; }
  .list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
  .item { display: flex; align-items: center; gap: 10px; padding: 6px 6px 6px 14px; animation: in 0.25s var(--ease); }
  .num { width: 22px; color: var(--muted); font-variant-numeric: tabular-nums; font-size: 0.9rem; }
  .name { flex: 1; text-align: left; background: none; border: none; padding: 10px 0; font-size: 1.1rem; font-weight: 600; }
  .edit { flex: 1; min-height: 44px; }
  .rm { border: none; background: transparent; color: var(--muted); }
  .empty { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 36px 0; }
  .groups { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
  .group { display: flex; align-items: center; gap: 8px; padding: 6px 6px 6px 14px; }
  .gload { flex: 1; min-width: 0; display: flex; flex-direction: column; text-align: left; background: none; border: none; padding: 8px 0; }
  .gload .muted { font-size: 0.82rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .save { min-height: 52px; }
  .hint { font-size: 0.8rem; }
  @keyframes in { from { opacity: 0; transform: translateY(-6px); } }
</style>

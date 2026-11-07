<script lang="ts">
  import { store } from '../../lib/store.svelte';
  import { go } from '../../lib/router.svelte';
  import { analyze } from '../../core/balance';
  import { roleMap, SPECIAL_ROLE_IDS } from '../../core/roles';
  import { HOUSE_PRESETS, applyAutoImposters, recommendedExtraChance } from '../../core/defaults';
  import { distribute } from '../../core/distribute';
  import { uid } from '../../core/rng';
  import type { CustomRole, GameConfig, HouseSize, RoleSetting, Team } from '../../core/types';
  import type { Theme } from '../../themes/types';
  import { fill, themedRole } from '../../lib/text';
  import Header from '../components/Header.svelte';
  import NumberStepper from '../components/NumberStepper.svelte';
  import Segmented from '../components/Segmented.svelte';
  import Toggle from '../components/Toggle.svelte';
  import BalanceBar from '../components/BalanceBar.svelte';
  import Sheet from '../components/Sheet.svelte';
  import Confirm from '../components/Confirm.svelte';
  let { theme }: { theme: Theme } = $props();

  const cfg = store.config;
  const a = $derived(analyze(cfg));
  const imp = $derived(cfg.roles.find((r) => r.roleId === 'imposter')!);
  const defs = $derived(roleMap(cfg));
  const n = $derived(cfg.players.length);
  const recChance = $derived(recommendedExtraChance(n));
  const issues = $derived([...a.errors, ...a.warnings]);
  const multi = $derived(a.imposterRange[1] > 1);

  let more = $state(false);
  let confirmRedeal = $state(false);
  let dealError = $state('');

  // ---- Sonderrollen: "Anzahl" + "Chance" (Sicher / 50 % / 25 %) ----
  const total = (s: RoleSetting) => s.count + (s.extraChance > 0 ? 1 : 0);
  function setTotal(s: RoleSetting, v: number) {
    s.count = Math.max(0, v - (s.extraChance > 0 ? 1 : 0));
  }
  function setChance(s: RoleSetting, p: number) {
    const t = total(s);
    s.extraChance = p;
    s.count = p > 0 ? t - 1 : t;
  }
  function toggleRole(s: RoleSetting, on: boolean) {
    s.enabled = on;
    if (on && total(s) === 0) s.count = 1;
  }
  const settingOf = (id: string) => cfg.roles.find((r) => r.roleId === id)!;

  // ---- Eigene Rollen ----
  let editor = $state<{ open: boolean; role: CustomRole; isNew: boolean }>({
    open: false,
    role: { id: '', name: '', team: 'crew', description: '' },
    isNew: true,
  });
  function newRole() {
    editor = { open: true, isNew: true, role: { id: 'c-' + uid(), name: '', team: 'crew', description: '' } };
  }
  function editRole(c: CustomRole) {
    editor = { open: true, isNew: false, role: { ...c } };
  }
  function saveRole() {
    const r = { ...editor.role, name: editor.role.name.trim().slice(0, 24) };
    if (!r.name) return;
    if (editor.isNew) {
      cfg.customRoles.push(r);
      cfg.roles.push({ roleId: r.id, enabled: true, count: 1, extraChance: 0 });
    } else {
      const i = cfg.customRoles.findIndex((c) => c.id === r.id);
      if (i >= 0) cfg.customRoles[i] = r;
    }
    editor.open = false;
  }
  function deleteRole() {
    const id = editor.role.id;
    cfg.customRoles = cfg.customRoles.filter((c) => c.id !== id);
    cfg.roles = cfg.roles.filter((s) => s.roleId !== id);
    editor.open = false;
  }

  // ---- Zeiten ----
  function setHouse(h: HouseSize) {
    cfg.house = h;
    cfg.killCooldown = HOUSE_PRESETS[h].killCooldown;
    cfg.deathCountdown = HOUSE_PRESETS[h].deathCountdown;
  }

  // ---- Verteilen ----
  function deal() {
    if (store.game && store.game.assignments.some((x) => x.seen)) {
      confirmRedeal = true;
      return;
    }
    doDeal();
  }
  function doDeal() {
    confirmRedeal = false;
    try {
      store.game = distribute($state.snapshot(cfg) as GameConfig);
      go('deal');
    } catch (e) {
      dealError = (e as Error).message;
    }
  }

  const chanceOpts = [
    { value: 0, label: 'Aus' },
    { value: 0.1, label: '10 %' },
    { value: 0.25, label: '25 %' },
    { value: 0.5, label: '50 %' },
  ];
  const specialChanceOpts = [
    { value: 0, label: 'Sicher' },
    { value: 0.5, label: '50 %' },
    { value: 0.25, label: '25 %' },
  ];
  const teamOpts: { value: Team; label: string }[] = [
    { value: 'crew', label: 'Gut' },
    { value: 'imposter', label: 'Böse' },
    { value: 'neutral', label: 'Neutral' },
  ];
  const pct = (p: number) => `${Math.round(p * 100)} %`;
</script>

<main class="screen">
  <Header step={3} onback={() => go('players')} />
  <div class="content">
    <div>
      <h1 class="display title">Regeln</h1>
      <p class="subtitle">Vorschläge passen zu {n} Spielern.</p>
    </div>

    <!-- Balance -->
    <section class="panel">
      {#if n >= 4}<BalanceBar {a} {theme} />{/if}
      {#each issues as i}
        <p class="issue" class:issue-error={i.level === 'error'} class:issue-warn={i.level === 'warn'}>
          <span>{i.level === 'error' ? '⛔' : '⚠️'}</span>
          <span>{fill(i.text, theme, cfg)}</span>
        </p>
      {/each}
      {#if a.errors.some((e) => e.overridable)}
        <Toggle bind:checked={cfg.override} label="Trotzdem erlauben" hint="Ich weiß, was ich tue." />
      {/if}
    </section>

    <!-- Imposter -->
    <section class="panel">
      <div class="panel-title">
        <span class="ico">{themedRole('imposter', theme, cfg).icon}</span>
        {theme.terms.imposters}
        <span class="chip" class:chip-warn={!cfg.autoImposters && (imp.count !== a.recommended || imp.extraChance !== recChance)}>
          Empfohlen: {a.recommended}{recChance ? ` + ${pct(recChance)}` : ''}
        </span>
      </div>
      <NumberStepper bind:value={imp.count} min={1} max={12} label="Anzahl" onchange={() => (cfg.autoImposters = false)} />
      <div class="sub">
        <span class="label">+1 mit Wahrscheinlichkeit</span>
        <Segmented bind:value={imp.extraChance} options={chanceOpts} label="Zusatzchance" onchange={() => (cfg.autoImposters = false)} />
      </div>
      {#if a.imposterDist.length > 1}
        <p class="dist">
          {#each a.imposterDist as d}<span class="chip">{pct(d.p)} → {d.count}</span>{/each}
        </p>
      {/if}
      {#if !cfg.autoImposters}
        <button
          class="btn btn-ghost btn-small reset"
          onclick={() => {
            cfg.autoImposters = true;
            applyAutoImposters(cfg);
          }}>↺ Empfehlung übernehmen</button
        >
      {/if}
    </section>

    <!-- Sonderrollen -->
    <section class="panel">
      <div class="panel-title"><span class="ico">⭐</span> Sonderrollen</div>
      <div class="roles">
        {#each [...SPECIAL_ROLE_IDS, ...cfg.customRoles.map((c) => c.id)] as id (id)}
          {@const s = settingOf(id)}
          {@const r = themedRole(id, theme, cfg)}
          {@const def = defs[id]}
          {#if s && def}
            <div class="role" class:on={s.enabled}>
              <Toggle checked={s.enabled} label={r.name} hint={r.short} onchange={(v) => toggleRole(s, v)}>
                <span class="ico big">{r.icon}</span>
              </Toggle>
              <div class="meta">
                {#if def.custom}
                  <span class="chip">{def.team === 'crew' ? 'Gut' : def.team === 'imposter' ? 'Böse' : 'Neutral'}</span>
                  <button class="btn btn-ghost btn-small" onclick={() => editRole(cfg.customRoles.find((c) => c.id === id)!)}>Bearbeiten</button>
                {:else}
                  <span class="chip" class:chip-warn={n < def.minPlayers}>ab {def.minPlayers} Spielern</span>
                {/if}
              </div>
              {#if s.enabled}
                <div class="opts">
                  {#if def.maxCount > 1}
                    <NumberStepper value={total(s)} min={1} max={def.maxCount} label="Anzahl" onchange={(v) => setTotal(s, v)} />
                  {/if}
                  <Segmented value={s.extraChance} options={specialChanceOpts} label="Wahrscheinlichkeit" onchange={(p) => setChance(s, p)} />
                </div>
              {/if}
            </div>
          {/if}
        {/each}
      </div>
      <button class="btn add-role" onclick={newRole}>＋ Eigene Rolle</button>
    </section>

    <!-- Zeiten -->
    <section class="panel">
      <div class="panel-title"><span class="ico">⏱️</span> Zeiten</div>
      <Segmented
        value={cfg.house === 'custom' ? null : cfg.house}
        options={(Object.keys(HOUSE_PRESETS) as HouseSize[]).map((k) => ({ value: k, label: HOUSE_PRESETS[k].label }))}
        label="Hausgröße"
        onchange={setHouse}
      />
      <div class="times">
        <NumberStepper bind:value={cfg.killCooldown} min={10} max={180} step={5} unit="s" label="Kill-Cooldown" onchange={() => (cfg.house = 'custom')} />
        <NumberStepper bind:value={cfg.deathCountdown} min={3} max={30} unit="s" label="Countdown Opfer" onchange={() => (cfg.house = 'custom')} />
        <NumberStepper bind:value={cfg.discussionMinutes} min={1} max={10} unit="min" label="Diskussion" />
      </div>
    </section>

    <!-- Weitere Regeln -->
    <section class="panel">
      <button class="more" onclick={() => (more = !more)} aria-expanded={more}>
        <span class="panel-title flat"><span class="ico">⚙️</span> Weitere Regeln</span>
        <span class="chev" class:open={more}>⌄</span>
      </button>
      {#if more}
        <div class="toggles">
          {#if multi}
            <Toggle bind:checked={cfg.impostersKnow} label="{theme.terms.imposters} kennen sich" hint="Sonst wissen sie nichts voneinander." />
            <Toggle bind:checked={cfg.noDoubleKill} label="Kein Doppelkill" hint="Wer einen Kill sieht, wartet den Cooldown mit ab." />
          {/if}
          <Toggle bind:checked={cfg.cooldownOnNightStart} label="Cooldown zu Beginn jeder {theme.terms.night}" hint="Alle können sich erst verteilen." />
          <Toggle bind:checked={cfg.emergencyMeeting} label="Notfall-{theme.terms.meeting}" hint="Jeder darf einmal ohne Leiche einberufen." />
          <Toggle bind:checked={cfg.revealOnVoteOut} label="Rolle bei Abwahl verraten" hint="Einfacher für die Crew." />
          <Toggle
            checked={cfg.countDisplay === 'exact'}
            label="Genaue Anzahl verraten"
            hint="Sonst steht nur die Spanne auf der Regelkarte (z. B. 2–3)."
            onchange={(v) => (cfg.countDisplay = v ? 'exact' : 'range')}
          />
        </div>
      {/if}
    </section>
    {#if dealError}<p class="issue issue-error">⛔ {fill(dealError, theme, cfg)}</p>{/if}
  </div>
  <div class="footer">
    <button class="btn btn-primary" disabled={a.blocked} onclick={deal}>🎲 Rollen verteilen</button>
  </div>
</main>

<Sheet open={editor.open} title={editor.isNew ? 'Eigene Rolle' : 'Rolle bearbeiten'} onclose={() => (editor.open = false)}>
  <input class="field" bind:value={editor.role.name} placeholder="Name, z. B. Bürgermeister" maxlength="24" aria-label="Rollenname" />
  <Segmented bind:value={editor.role.team} options={teamOpts} label="Team" />
  <textarea class="field" bind:value={editor.role.description} placeholder="Was kann die Rolle? (optional)" maxlength="160" aria-label="Beschreibung"></textarea>
  <button class="btn btn-primary" disabled={!editor.role.name.trim()} onclick={saveRole}>Speichern</button>
  {#if !editor.isNew}<button class="btn btn-ghost" onclick={deleteRole}>Rolle löschen</button>{/if}
</Sheet>

<Confirm
  open={confirmRedeal}
  title="Neu verteilen?"
  text="Die aktuelle Verteilung wird verworfen."
  confirmLabel="Neu verteilen"
  oncancel={() => (confirmRedeal = false)}
  onconfirm={doDeal}
/>

<style>
  section { display: flex; flex-direction: column; gap: 12px; }
  .panel-title { margin-bottom: 0; flex-wrap: wrap; }
  .panel-title .chip { margin-left: auto; }
  .flat { margin: 0; }
  .ico { font-size: 1.3rem; }
  .ico.big { font-size: 1.7rem; width: 34px; text-align: center; }
  .sub { display: flex; flex-direction: column; gap: 6px; }
  .dist { display: flex; gap: 6px; flex-wrap: wrap; }
  .reset { align-self: flex-start; padding: 0; }
  .roles { display: flex; flex-direction: column; }
  .role { padding: 6px 0 10px; border-bottom: 1px solid var(--border); }
  .role:last-child { border-bottom: none; }
  .meta { display: flex; gap: 6px; align-items: center; padding-left: 46px; }
  .meta .btn-small { padding: 0 6px; min-height: 28px; }
  .opts { display: flex; flex-direction: column; gap: 10px; padding: 10px 0 0 46px; }
  .role:not(.on) :global(.h) { opacity: 0.7; }
  .add-role { min-height: 48px; border-style: dashed; }
  .times { display: flex; flex-direction: column; gap: 10px; }
  .more { display: flex; justify-content: space-between; align-items: center; background: none; border: none; padding: 0; width: 100%; }
  .chev { font-size: 1.4rem; transition: transform 0.2s; color: var(--muted); }
  .chev.open { transform: rotate(180deg); }
  .toggles { display: flex; flex-direction: column; }
</style>

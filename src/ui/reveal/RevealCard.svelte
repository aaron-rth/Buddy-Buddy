<script lang="ts">
  /**
   * Gedrückt halten = Rolle sichtbar, loslassen = sofort verdeckt.
   * Wichtig: Für ALLE Rollen identische Farben, Animation und Dauer –
   * damit niemand am Lichtschein oder an der Bewegung erkennt, wer böse ist.
   */
  import type { RevealInfo } from '../../core/types';
  import type { Theme } from '../../themes/types';
  import type { ThemedRole } from '../../lib/text';

  let { role, info, theme, onseen }: { role: ThemedRole; info?: RevealInfo; theme: Theme; onseen: () => void } = $props();

  let pressed = $state(false);
  let seenTimer: ReturnType<typeof setTimeout> | undefined;
  let scrambled = $state('');
  let scrambleTimer: ReturnType<typeof setInterval> | undefined;

  const GLYPHS = '█▓▒░#%&@$01<>/\\';

  function down(e: PointerEvent) {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    show();
  }
  function show() {
    if (pressed) return;
    pressed = true;
    navigator.vibrate?.(15);
    seenTimer = setTimeout(onseen, 600);
    if (theme.reveal === 'terminal') startScramble();
  }
  function hide() {
    pressed = false;
    clearTimeout(seenTimer);
    clearInterval(scrambleTimer);
  }
  function startScramble() {
    const target = role.name.toUpperCase();
    let frame = 0;
    clearInterval(scrambleTimer);
    scrambleTimer = setInterval(() => {
      frame++;
      const done = Math.floor(frame / 2);
      scrambled = target
        .split('')
        .map((ch, i) => (i < done || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
        .join('');
      if (done >= target.length) clearInterval(scrambleTimer);
    }, 28);
  }

  $effect(() => {
    const onBlur = () => hide();
    window.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onBlur);
    return () => {
      hide();
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onBlur);
    };
  });

  const shownName = $derived(theme.reveal === 'terminal' ? scrambled || role.name : role.name);
</script>

<div
  class="reveal style-{theme.reveal}"
  class:pressed
  role="button"
  tabindex="0"
  aria-label="Gedrückt halten, um deine Rolle zu sehen"
  onpointerdown={down}
  onpointerup={hide}
  onpointercancel={hide}
  onlostpointercapture={hide}
  oncontextmenu={(e) => e.preventDefault()}
  onkeydown={(e) => (e.key === ' ' || e.key === 'Enter') && (e.preventDefault(), show())}
  onkeyup={hide}
>
  <!-- Inhalt: wird nur gerendert, solange gedrückt -->
  <div class="face front">
    {#if pressed}
      <div class="content">
        <span class="you label">Du bist</span>
        <span class="icon">{role.icon}</span>
        <span class="name display" style="--len:{Math.max(6, role.name.length)}">{shownName}</span>
        {#if role.short}<p class="short">{role.short}</p>{/if}
        {#if info}
          <p class="info">
            {#if info.type === 'teammates'}
              Mit dir: <b>{info.names.join(', ')}</b>
            {:else if info.type === 'unknownTeammates'}
              {#if info.maybeAlone}Vielleicht gibt es weitere {theme.terms.imposters} – du kennst sie nicht.{:else}Du kennst die anderen {theme.terms.imposters} nicht.{/if}
            {:else if info.type === 'imposters'}
              {theme.terms.imposters}: <b>{info.names.join(', ')}</b>
            {:else if info.type === 'innocent'}
              {#if info.name}Sicher unschuldig: <b>{info.name}</b>{:else}Niemand ist sicher unschuldig.{/if}
            {/if}
          </p>
        {/if}
        <p class="goal">{role.goal}</p>
      </div>
    {/if}
  </div>

  <!-- Abdeckung -->
  <div class="face cover" aria-hidden="true">
    <div class="pattern"></div>
    <div class="emblem">
      {#if theme.reveal === 'terminal'}
        <span class="term">&gt; VERSCHLÜSSELT<span class="cursor">_</span></span>
      {:else if theme.reveal === 'dossier'}
        <span class="stamp">Streng geheim</span>
      {:else if theme.reveal === 'envelope'}
        <span class="seal">✦</span>
      {:else}
        <span class="glyph">?</span>
      {/if}
    </div>
    <p class="cover-text">{theme.terms.cover}</p>
    <span class="finger">☝︎</span>
  </div>
</div>

<style>
  .reveal {
    --w: min(84vw, 340px);
    position: relative;
    width: var(--w);
    aspect-ratio: 3 / 4.2;
    margin: 0 auto;
    perspective: 1200px;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    cursor: pointer;
    outline: none;
  }
  .face {
    position: absolute;
    inset: 0;
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: transform 0.45s var(--ease), opacity 0.35s ease, clip-path 0.45s var(--ease), filter 0.45s ease;
  }
  .front {
    background: linear-gradient(160deg, var(--surface2), transparent), var(--bg);
    border: 1px solid var(--border);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
  }
  .content {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 22px;
    text-align: center;
  }
  .icon { font-size: 3.4rem; line-height: 1; margin: 6px 0; }
  .name {
    font-size: clamp(1.5rem, calc(15rem / var(--len)), 3rem);
    word-break: break-word;
    hyphens: auto;
  }
  .short { font-size: 0.95rem; opacity: 0.9; }
  .info {
    font-size: 0.95rem;
    padding: 8px 12px;
    border-radius: var(--radius);
    background: color-mix(in srgb, var(--text) 8%, transparent);
  }
  .goal { font-size: 0.82rem; opacity: 0.7; margin-top: 4px; }

  .cover {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 18px;
    padding: 24px;
    text-align: center;
    background: linear-gradient(var(--surface2), var(--surface2)), var(--bg);
    border: 1px solid var(--border);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
  }
  .pattern {
    position: absolute;
    inset: 10px;
    border-radius: calc(var(--radius-lg) - 6px);
    border: 1px solid var(--border);
    background:
      radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--primary) 16%, transparent), transparent 60%),
      repeating-linear-gradient(45deg, color-mix(in srgb, var(--primary) 7%, transparent) 0 2px, transparent 2px 14px),
      repeating-linear-gradient(-45deg, color-mix(in srgb, var(--primary) 7%, transparent) 0 2px, transparent 2px 14px);
  }
  .emblem { position: relative; }
  .glyph {
    display: grid;
    place-items: center;
    width: 96px;
    height: 96px;
    border-radius: 50%;
    border: 2px solid var(--primary);
    font-family: var(--font-display);
    font-size: 3rem;
    color: var(--primary);
    box-shadow: 0 0 40px color-mix(in srgb, var(--primary) 35%, transparent);
  }
  .cover-text { position: relative; font-weight: 600; max-width: 220px; }
  .finger { position: relative; font-size: 1.8rem; animation: press 1.6s ease-in-out infinite; }
  @keyframes press { 50% { transform: translateY(6px) scale(0.92); } }

  /* ---- Karte (Flip) ---- */
  .style-card .front { transform: rotateY(180deg); backface-visibility: hidden; }
  .style-card .cover { backface-visibility: hidden; }
  .style-card.pressed .front { transform: rotateY(0); }
  .style-card.pressed .cover { transform: rotateY(-180deg); }

  /* ---- Umschlag ---- */
  .style-envelope .front { background: linear-gradient(170deg, #f8efd9, #e6d5ad); color: #2a1d0f; }
  .style-envelope .cover {
    background:
      linear-gradient(to bottom right, transparent 49.6%, rgba(0, 0, 0, 0.25) 50%, transparent 50.6%) top / 100% 45% no-repeat,
      linear-gradient(to bottom left, transparent 49.6%, rgba(0, 0, 0, 0.25) 50%, transparent 50.6%) top / 100% 45% no-repeat,
      linear-gradient(170deg, #3a2a17, #20160b);
  }
  .style-envelope .pattern { display: none; }
  .seal {
    display: grid;
    place-items: center;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #c7484a, #7d1a1d 70%);
    color: #f1c9a0;
    font-size: 2.2rem;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5), inset 0 0 0 6px rgba(0, 0, 0, 0.15);
  }
  .style-envelope { overflow: hidden; border-radius: var(--radius-lg); }
  .style-envelope.pressed .cover { transform: translateY(100%); }

  /* ---- Terminal ---- */
  .style-terminal .front,
  .style-terminal .cover { background: #010812; font-family: var(--font-label); }
  .style-terminal .front { box-shadow: 0 0 0 1px var(--primary), 0 0 40px color-mix(in srgb, var(--primary) 25%, transparent); }
  .style-terminal .content { color: var(--primary); }
  .style-terminal .name { font-family: var(--font-display); text-shadow: 0 0 18px color-mix(in srgb, var(--primary) 60%, transparent); }
  .term { color: var(--primary); font-size: 1.05rem; letter-spacing: 0.1em; }
  .cursor { animation: blink 1s steps(2) infinite; }
  @keyframes blink { to { opacity: 0; } }
  .style-terminal.pressed .cover { opacity: 0; clip-path: inset(50% 0 50% 0); }
  .style-terminal .cover { clip-path: inset(0 0 0 0); }

  /* ---- Schriftrolle ---- */
  .style-scroll .front {
    background: radial-gradient(ellipse at center, #f5e6c4, #dcc28e 85%);
    color: #2c1c0a;
    clip-path: inset(46% 0 46% 0 round 12px);
  }
  .style-scroll.pressed .front { clip-path: inset(0 0 0 0 round 12px); }
  .style-scroll .cover { background: linear-gradient(180deg, #4a3016, #2d1c0b); }
  .style-scroll .pattern {
    background: repeating-linear-gradient(0deg, rgba(232, 194, 122, 0.12) 0 3px, transparent 3px 12px);
  }
  .style-scroll.pressed .cover { opacity: 0; transform: scaleY(0.1); }

  /* ---- Akte ---- */
  .style-dossier .front { background: #efe9d8; color: #1b1b1b; font-family: var(--font-display); }
  .style-dossier .front::after {
    content: 'VERTRAULICH';
    position: absolute;
    top: 14px;
    right: -30px;
    transform: rotate(18deg);
    color: #d63a2f;
    border: 2px solid #d63a2f;
    padding: 2px 30px;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    opacity: 0.8;
  }
  .style-dossier .cover { background: linear-gradient(170deg, #c9a66b, #a9844b); color: #2a1f10; transform-origin: left center; }
  .style-dossier .pattern { background: none; border-color: rgba(42, 31, 16, 0.25); }
  .stamp {
    display: inline-block;
    padding: 6px 16px;
    border: 3px solid #b3261e;
    color: #b3261e;
    font-family: var(--font-display);
    font-size: 1.3rem;
    text-transform: uppercase;
    transform: rotate(-8deg);
    letter-spacing: 0.08em;
  }
  .style-dossier.pressed .cover { transform: perspective(1200px) rotateY(-120deg); opacity: 0; }

  /* ---- Nebel ---- */
  .style-mist .front { filter: blur(14px); }
  .style-mist.pressed .front { filter: blur(0); }
  .style-mist .cover {
    background:
      radial-gradient(ellipse at 30% 30%, rgba(200, 255, 210, 0.18), transparent 60%),
      radial-gradient(ellipse at 70% 70%, rgba(176, 92, 255, 0.16), transparent 60%),
      linear-gradient(var(--surface2), var(--surface2)),
      var(--bg);
  }
  .style-mist.pressed .cover { opacity: 0; transform: scale(1.15); }
</style>

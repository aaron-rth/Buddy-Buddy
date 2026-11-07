<script lang="ts">
  import { range } from '../scene-utils';
  const rays = range(-90, 90, 7.5).map((a) => {
    const rad = ((a - 90) * Math.PI) / 180;
    return { x: 200 + Math.cos(rad) * 1600, y: 760 + Math.sin(rad) * 1600 };
  });
  const panels = range(-1000, 1400, 120);
</script>

<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
  <defs>
    <linearGradient id="dn-wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#070504" />
      <stop offset=".7" stop-color="#1c140b" />
      <stop offset="1" stop-color="#2a1d0f" />
    </linearGradient>
    <radialGradient id="dn-candle">
      <stop offset="0" stop-color="#ffd27a" stop-opacity=".55" />
      <stop offset="1" stop-color="#ffb347" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="dn-table" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3a0f12" />
      <stop offset="1" stop-color="#150506" />
    </linearGradient>
  </defs>
  <rect x="-1200" y="-1200" width="2800" height="2600" fill="url(#dn-wall)" />
  {#each panels as x}
    <rect x={x + 14} y="-600" width="92" height="1250" fill="none" stroke="#d4af5f" stroke-opacity=".07" />
  {/each}
  <g stroke="#d4af5f" stroke-opacity=".13" stroke-width="1.2">
    {#each rays as p}<line x1="200" y1="760" x2={p.x} y2={p.y} />{/each}
  </g>
  <g fill="none" stroke="#d4af5f">
    <path d="M60 760 V330 A140 140 0 0 1 340 330 V760" stroke-opacity=".45" stroke-width="2" />
    <path d="M76 760 V336 A124 124 0 0 1 324 336 V760" stroke-opacity=".25" />
    <path d="M100 760 V350 A100 100 0 0 1 300 350 V760" stroke-opacity=".15" />
    <path d="M200 206 L212 230 L200 254 L188 230Z" stroke-opacity=".6" />
  </g>
  <!-- Kronleuchter -->
  <g stroke="#d4af5f" stroke-opacity=".5" fill="none">
    <line x1="200" y1="-400" x2="200" y2="70" />
    <path d="M140 92 Q200 130 260 92" />
    <path d="M160 82 Q200 104 240 82" />
  </g>
  <g fill="#ffd98a">
    {#each [140, 170, 200, 230, 260] as x, i}
      <circle class="fl" cx={x} cy={i % 2 ? 78 : 86} r="2.5" style="--delay:{i * 0.37}s" />
    {/each}
  </g>
  <circle cx="200" cy="90" r="90" fill="url(#dn-candle)" opacity=".5" />
  <!-- Tisch -->
  <path d="M-1200 690 H1600 V1400 H-1200Z" fill="url(#dn-table)" />
  <rect x="-1200" y="686" width="2800" height="6" fill="#d4af5f" opacity=".35" />
  {#each [70, 330] as cx, i}
    <g>
      <circle class="glow" cx={cx} cy="600" r="80" fill="url(#dn-candle)" style="--delay:{i * 0.6}s" />
      <path d="M{cx - 30} 690 h60 l-6 -8 h-48z M{cx - 3} 682 V640 h6 V682z M{cx - 26} 650 h52 v4 h-52z" fill="#b8913f" />
      {#each [-22, 0, 22] as dx}
        <rect x={cx + dx - 3} y="612" width="6" height="36" fill="#efe3c4" />
        <ellipse class="fl" cx={cx + dx} cy="606" rx="3" ry="6" fill="#ffcf6b" style="--delay:{(dx + 30) / 40}s" />
      {/each}
    </g>
  {/each}
  {#each [140, 190, 230, 270] as x}
    <path d="M{x - 9} 640 q9 22 18 0z M{x - 1} 660 V682 M{x - 8} 684 h16" fill="#d4af5f" fill-opacity=".14" stroke="#d4af5f" stroke-opacity=".45" />
  {/each}
</svg>

<style>
  svg { width: 100%; height: 100%; display: block; }
  .fl { animation: fl 1.6s ease-in-out var(--delay) infinite alternate; transform-box: fill-box; transform-origin: center bottom; }
  .glow { animation: glow 2.4s ease-in-out var(--delay) infinite alternate; }
  @keyframes fl { to { transform: scaleY(0.82); opacity: 0.8; } }
  @keyframes glow { to { opacity: 0.6; } }
</style>

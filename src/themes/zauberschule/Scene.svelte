<script lang="ts">
  import { seeded, starField } from '../scene-utils';
  const stars = starField(14, 150, -900, 420);
  const r = seeded(4);
  const candles = Array.from({ length: 12 }, () => ({ x: -60 + r() * 520, y: 120 + r() * 300, s: 0.6 + r() * 0.6, d: (3 + r() * 3).toFixed(2), delay: (r() * 3).toFixed(2) }));
  // Türme: x, Breite, Oberkante
  const towers = [
    [-160, 50, 420], [-90, 40, 470], [30, 46, 360], [92, 34, 440], [150, 60, 300], [226, 40, 410], [282, 54, 340], [352, 36, 450], [420, 48, 390], [500, 40, 460],
  ];
  const windows = towers.flatMap(([x, w, top], i) =>
    Array.from({ length: 3 }, (_, j) => ({ x: x + w / 2 - 3, y: top + 30 + j * 46, on: r() > 0.35, i })),
  );
</script>

<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
  <defs>
    <linearGradient id="zs-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#07030f" /><stop offset=".6" stop-color="#26114a" /><stop offset="1" stop-color="#4a2370" />
    </linearGradient>
    <radialGradient id="zs-flame"><stop offset="0" stop-color="#ffe9a3" stop-opacity=".9" /><stop offset="1" stop-color="#ffb347" stop-opacity="0" /></radialGradient>
  </defs>
  <rect x="-1200" y="-1200" width="2800" height="2000" fill="url(#zs-sky)" />
  {#each stars as s}
    <circle class="tw" cx={s.x} cy={s.y} r={s.r} fill="#fff6d8" opacity={s.o} style="--d:{s.d}s;--delay:{s.delay}s" />
  {/each}
  <path d="M110 120 A48 48 0 1 0 150 196 A38 38 0 1 1 110 120Z" fill="#fff1c4" />
  <path d="M-1200 600 L-500 470 L-200 560 L60 440 L260 560 L520 450 L900 580 L1600 520 V1400 H-1200Z" fill="#1a0b30" />
  <g fill="#0c0518">
    {#each towers as [x, w, top]}
      <rect x={x} y={top} width={w} height={800 - top} />
      <path d="M{x - 6} {top} L{x + w / 2} {top - w * 1.6} L{x + w + 6} {top}Z" />
    {/each}
    <rect x="-1200" y="560" width="2800" height="800" />
    <path d="M-40 560 h480 v-30 h-20 v12 h-20 v-12 h-20 v12 h-20 v-12 h-20 v12 h-20 v-12 h-20 v12 h-20 v-12 h-20 v12 h-20 v-12 h-20 v12 h-20 v-12 h-20 v12 h-20 v-12 h-20 v12 h-20 v-12 h-20 v12 h-20 v-12 h-20 v12 h-20 v-12 h-20 v12 h-20 v-12 h-20 v12 h-20 v-12 h-20 v12 h-20 v-12 h-20 v12 h-20 v-12 h-20v30z" />
  </g>
  <g fill="#ffcf6b">
    {#each windows as w}
      {#if w.on}<rect class="win" x={w.x} y={w.y} width="6" height="12" rx="3" style="--delay:{w.i * 0.4}s" />{/if}
    {/each}
  </g>
  {#each candles as c}
    <g class="candle" style="--d:{c.d}s;--delay:{c.delay}s">
      <g transform="translate({c.x} {c.y}) scale({c.s})">
        <circle cx="0" cy="-6" r="16" fill="url(#zs-flame)" />
        <ellipse cx="0" cy="-6" rx="2.6" ry="5" fill="#fff3c4" />
        <rect x="-3.5" y="-1" width="7" height="22" rx="1" fill="#f3e8d4" />
      </g>
    </g>
  {/each}
</svg>

<style>
  svg { width: 100%; height: 100%; display: block; }
  .tw { animation: tw var(--d) ease-in-out var(--delay) infinite alternate; }
  .candle { animation: float var(--d) ease-in-out var(--delay) infinite alternate; }
  .win { animation: win 3s ease-in-out var(--delay) infinite alternate; }
  @keyframes tw { to { opacity: 0.15; } }
  @keyframes float { to { transform: translateY(-14px); } }
  @keyframes win { to { opacity: 0.55; } }
</style>

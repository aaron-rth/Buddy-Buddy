<script lang="ts">
  import { range, seeded } from '../scene-utils';
  const r = seeded(31);
  const back = range(-900, 1300, 34).map((x) => ({ x, w: 26 + r() * 14, h: 120 + r() * 200 }));
  const front = range(-900, 1300, 52).map((x) => ({ x: x + r() * 10, w: 40 + r() * 16, h: 170 + r() * 260 }));
  const lights = front.flatMap((b) =>
    Array.from({ length: Math.floor(b.h / 22) * 3 }, (_, k) => ({
      x: b.x + 6 + (k % 3) * ((b.w - 12) / 3),
      y: 700 - b.h + 14 + Math.floor(k / 3) * 22,
      on: r() > 0.78,
    })).filter((l) => l.on),
  );
</script>

<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
  <defs>
    <linearGradient id="mw-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#050608" /><stop offset=".75" stop-color="#151a22" /><stop offset="1" stop-color="#2a2a30" />
    </linearGradient>
    <linearGradient id="mw-beam" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#f2ecd8" stop-opacity=".22" /><stop offset="1" stop-color="#f2ecd8" stop-opacity="0" />
    </linearGradient>
  </defs>
  <rect x="-1200" y="-1200" width="2800" height="2000" fill="url(#mw-sky)" />
  <g class="beam b1"><path d="M70 720 L-140 -200 L60 -220 Z" fill="url(#mw-beam)" /></g>
  <g class="beam b2"><path d="M330 720 L300 -240 L520 -200 Z" fill="url(#mw-beam)" /></g>
  <g fill="#0f1217">
    {#each back as b}<rect x={b.x} y={640 - b.h} width={b.w} height={b.h + 200} />{/each}
  </g>
  <g fill="#07080b">
    {#each front as b}<rect x={b.x} y={700 - b.h} width={b.w} height={b.h + 200} />{/each}
    <rect x="186" y="220" width="30" height="500" />
    <rect x="199" y="150" width="4" height="72" />
  </g>
  <circle class="blink" cx="201" cy="148" r="3.5" fill="#d63a2f" />
  <g fill="#e9d9a6">
    {#each lights as l}<rect x={l.x} y={l.y} width="5" height="8" opacity=".55" />{/each}
  </g>
  <rect x="-1200" y="700" width="2800" height="700" fill="#040507" />
  <path d="M-1200 740 H1600" stroke="#d63a2f" stroke-opacity=".25" stroke-dasharray="14 10" />
</svg>

<style>
  svg { width: 100%; height: 100%; display: block; }
  .beam { transform-box: view-box; }
  .b1 { transform-origin: 70px 720px; animation: sweep 9s ease-in-out infinite alternate; }
  .b2 { transform-origin: 330px 720px; animation: sweep 11s ease-in-out infinite alternate-reverse; }
  .blink { animation: blink 1.6s steps(2) infinite; }
  @keyframes sweep { from { transform: rotate(-14deg); } to { transform: rotate(16deg); } }
  @keyframes blink { to { opacity: 0.1; } }
</style>

<script lang="ts">
  import { seeded, starField, wave } from '../scene-utils';
  const stars = starField(5, 90, -900, 380);
  const r = seeded(9);
  const glints = Array.from({ length: 26 }, (_, i) => ({ x: 250 + (r() - 0.5) * (30 + i * 6), y: 590 + i * 8, w: 8 + r() * 22 }));
</script>

<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
  <defs>
    <linearGradient id="mt-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#02080c" /><stop offset=".7" stop-color="#0c2a36" /><stop offset="1" stop-color="#1b4550" />
    </linearGradient>
    <radialGradient id="mt-glow"><stop offset="0" stop-color="#fff1cf" stop-opacity=".4" /><stop offset="1" stop-color="#fff1cf" stop-opacity="0" /></radialGradient>
    <linearGradient id="mt-sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0b2a33" /><stop offset="1" stop-color="#020a0d" />
    </linearGradient>
  </defs>
  <rect x="-1200" y="-1200" width="2800" height="2000" fill="url(#mt-sky)" />
  {#each stars as s}<circle cx={s.x} cy={s.y} r={s.r} fill="#fff6e0" opacity={s.o * 0.8} />{/each}
  <circle cx="250" cy="250" r="190" fill="url(#mt-glow)" />
  <circle cx="250" cy="250" r="44" fill="#fff4d6" />
  <g class="clouds" fill="#0a1f28" opacity=".85">
    <ellipse cx="120" cy="300" rx="130" ry="18" />
    <ellipse cx="330" cy="330" rx="150" ry="14" />
    <ellipse cx="-200" cy="250" rx="180" ry="20" />
    <ellipse cx="640" cy="280" rx="200" ry="18" />
  </g>
  <path d="M-1200 586 H1600 V1400 H-1200Z" fill="url(#mt-sea)" />
  <g fill="#fff1cf" opacity=".5">
    {#each glints as g}<rect x={g.x - g.w / 2} y={g.y} width={g.w} height="1.6" rx="1" />{/each}
  </g>
  <!-- Schiff -->
  <g class="ship" fill="#03090c">
    <path d="M40 600 L330 600 L310 640 L70 640 Z" />
    <path d="M40 600 L20 584 L60 594 Z M330 600 L360 580 L345 600Z" />
    <rect x="118" y="380" width="4" height="222" />
    <rect x="198" y="330" width="5" height="272" />
    <rect x="270" y="400" width="4" height="202" />
    <path d="M122 400 Q160 440 122 500 Z M122 510 Q168 548 122 590Z" />
    <path d="M203 350 Q258 400 203 470 Z M203 480 Q264 528 203 590 Z" />
    <path d="M274 420 Q312 456 274 510 Z M274 520 Q314 552 274 590Z" />
    <path d="M203 330 L234 340 L203 350Z" fill="#7a1d1d" />
    <path d="M30 590 L198 334 M203 334 L360 580" stroke="#03090c" stroke-width="1.2" fill="none" />
  </g>
  <rect class="lamp" x="300" y="596" width="5" height="5" fill="#ffc861" />
  <path class="w1" d={wave(640, 8, 80)} fill="#071c22" />
  <path class="w2" d={wave(668, 10, 110)} fill="#05151a" />
  <path class="w3" d={wave(712, 14, 150)} fill="#020a0d" />
</svg>

<style>
  svg { width: 100%; height: 100%; display: block; }
  .w1 { animation: drift 7s linear infinite; }
  .w2 { animation: drift 10s linear infinite reverse; }
  .w3 { animation: drift 14s linear infinite; }
  .ship { animation: bob 5s ease-in-out infinite alternate; transform-origin: 200px 620px; }
  .clouds { animation: clouds 60s linear infinite alternate; }
  .lamp { animation: bob 5s ease-in-out infinite alternate; }
  @keyframes drift { to { transform: translateX(-80px); } }
  @keyframes bob { from { transform: rotate(-1.2deg) translateY(0); } to { transform: rotate(1.2deg) translateY(4px); } }
  @keyframes clouds { to { transform: translateX(60px); } }
</style>

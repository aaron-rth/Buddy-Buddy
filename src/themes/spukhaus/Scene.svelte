<script lang="ts">
  import { range, seeded, starField } from '../scene-utils';
  const stars = starField(8, 70, -900, 300);
  const r = seeded(17);
  const graves = range(-900, 1300, 70).filter((x) => x < 20 || x > 380).map((x) => ({ x: x + r() * 30, h: 24 + r() * 18, tilt: (r() - 0.5) * 16 }));
  const fence = range(-1000, 1400, 14);
</script>

<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
  <defs>
    <linearGradient id="sh-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#020403" /><stop offset=".65" stop-color="#112019" /><stop offset="1" stop-color="#253a2e" />
    </linearGradient>
    <radialGradient id="sh-glow"><stop offset="0" stop-color="#d8ffd9" stop-opacity=".4" /><stop offset="1" stop-color="#d8ffd9" stop-opacity="0" /></radialGradient>
    <radialGradient id="sh-win"><stop offset="0" stop-color="#ffb24d" stop-opacity=".7" /><stop offset="1" stop-color="#ffb24d" stop-opacity="0" /></radialGradient>
  </defs>
  <rect x="-1200" y="-1200" width="2800" height="2000" fill="url(#sh-sky)" />
  {#each stars as s}<circle cx={s.x} cy={s.y} r={s.r} fill="#e9ffe9" opacity={s.o * 0.7} />{/each}
  <circle cx="110" cy="190" r="200" fill="url(#sh-glow)" />
  <circle cx="110" cy="190" r="56" fill="#e3f5df" />
  <g class="clouds" fill="#0b1510" opacity=".9">
    <ellipse cx="60" cy="230" rx="120" ry="12" />
    <ellipse cx="200" cy="160" rx="90" ry="9" />
    <ellipse cx="-260" cy="200" rx="180" ry="14" />
  </g>
  <path d="M-1200 640 Q-400 600 0 620 Q200 520 420 610 Q800 590 1600 630 V1400 H-1200Z" fill="#0b130e" />
  <!-- Haus -->
  <g fill="#030604">
    <path d="M150 600 V420 L136 420 L196 330 L256 420 L244 420 V600Z" />
    <path d="M232 600 V470 L224 470 L282 400 L340 470 L330 470 V600Z" />
    <path d="M168 335 V260 L160 260 L184 196 L208 260 L200 260 V350Z" />
    <rect x="290" y="380" width="12" height="40" />
    <path d="M130 600 H350 V612 H130Z" />
  </g>
  <g>
    <circle class="win" cx="196" cy="460" r="36" fill="url(#sh-win)" />
    <rect class="win" x="186" y="446" width="20" height="28" fill="#ffb24d" opacity=".85" />
    <rect x="195" y="446" width="2" height="28" fill="#030604" />
    <rect x="186" y="459" width="20" height="2" fill="#030604" />
    <rect class="win2" x="270" y="500" width="22" height="26" fill="#9dff9a" opacity=".5" />
    <rect x="176" y="282" width="16" height="22" fill="#ffb24d" opacity=".35" />
    <path d="M186 600 V560 a10 10 0 0 1 20 0 V600Z" fill="#1b1206" />
  </g>
  <!-- toter Baum -->
  <path d="M40 640 C46 560 30 520 18 470 M30 540 C10 520 -20 520 -40 500 M24 500 C40 480 60 470 70 440 M18 470 C10 450 0 430 4 400 M60 452 C80 450 96 440 104 420"
    stroke="#030604" stroke-width="7" stroke-linecap="round" fill="none" />
  <path d="M40 640 C46 560 30 520 18 470" stroke="#030604" stroke-width="14" stroke-linecap="round" fill="none" />
  <g fill="#050906">
    {#each graves as g}
      <path transform="rotate({g.tilt} {g.x} 640)" d="M{g.x - 9} 650 V{650 - g.h + 9} a9 9 0 0 1 18 0 V650Z" />
    {/each}
  </g>
  <g fill="#020403">
    {#each fence as x}<path d="M{x} 700 V664 l3 -8 l3 8 V700Z" />{/each}
    <rect x="-1200" y="672" width="2800" height="3" />
    <rect x="-1200" y="690" width="2800" height="700" />
  </g>
  <g class="bats" fill="#020403">
    <path d="M300 250 q8 -8 14 0 q6 -8 14 0 q-7 2 -14 8 q-7 -6 -14 -8z" />
    <path d="M250 300 q6 -6 10 0 q4 -6 10 0 q-5 2 -10 6 q-5 -4 -10 -6z" />
    <path d="M340 210 q5 -5 8 0 q3 -5 8 0 q-4 2 -8 5 q-4 -3 -8 -5z" />
  </g>
</svg>

<style>
  svg { width: 100%; height: 100%; display: block; }
  .win { animation: flick 3.2s infinite; }
  .win2 { animation: flick 4.4s 1s infinite; }
  .bats { animation: bats 7s ease-in-out infinite alternate; }
  .clouds { animation: clouds 50s linear infinite alternate; }
  @keyframes flick { 0%, 40%, 44%, 100% { opacity: 0.85; } 42% { opacity: 0.2; } 70% { opacity: 0.6; } }
  @keyframes bats { to { transform: translate(-40px, -30px); } }
  @keyframes clouds { to { transform: translateX(80px); } }
</style>

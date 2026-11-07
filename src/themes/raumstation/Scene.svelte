<script lang="ts">
  import { range, starField } from '../scene-utils';
  const stars = starField(21, 220, -900, 640);
  const grid = range(-1200, 1600, 40);
  const rows = [690, 708, 730, 758, 794];
</script>

<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
  <defs>
    <radialGradient id="rs-neb1"><stop offset="0" stop-color="#ff3d81" stop-opacity=".28" /><stop offset="1" stop-color="#ff3d81" stop-opacity="0" /></radialGradient>
    <radialGradient id="rs-neb2"><stop offset="0" stop-color="#3ce0ff" stop-opacity=".22" /><stop offset="1" stop-color="#3ce0ff" stop-opacity="0" /></radialGradient>
    <radialGradient id="rs-planet" cx=".35" cy=".3">
      <stop offset="0" stop-color="#5d7bd6" /><stop offset=".6" stop-color="#26306e" /><stop offset="1" stop-color="#0a0d26" />
    </radialGradient>
    <linearGradient id="rs-floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#05091a" /><stop offset="1" stop-color="#0b1838" />
    </linearGradient>
  </defs>
  <rect x="-1200" y="-1200" width="2800" height="2800" fill="#02040b" />
  <ellipse cx="60" cy="160" rx="420" ry="240" fill="url(#rs-neb1)" />
  <ellipse cx="380" cy="420" rx="380" ry="260" fill="url(#rs-neb2)" />
  {#each stars as s}
    <circle class="tw" cx={s.x} cy={s.y} r={s.r} fill="#dff8ff" opacity={s.o} style="--d:{s.d}s;--delay:{s.delay}s" />
  {/each}
  <g transform="rotate(-14 310 470)">
    <ellipse cx="310" cy="470" rx="230" ry="34" fill="none" stroke="#3ce0ff" stroke-opacity=".25" stroke-width="5" />
    <circle cx="310" cy="470" r="120" fill="url(#rs-planet)" />
    <path d="M80 470 A230 34 0 0 0 540 470" fill="none" stroke="#8ef0ff" stroke-opacity=".5" stroke-width="3" />
  </g>
  <circle cx="90" cy="300" r="14" fill="#c9d3ff" opacity=".8" />
  <!-- Fensterrahmen & Boden -->
  <path d="M-1200 -1200 H1600 V40 H-1200Z M-1200 40 H-10 L30 80 V640 L-10 680 H-1200Z M1600 40 H410 L370 80 V640 L410 680 H1600Z" fill="#070b18" />
  <path d="M-10 40 H410 M30 80 V640 M370 80 V640" stroke="#3ce0ff" stroke-opacity=".35" />
  <path d="M-1200 680 H1600 V1400 H-1200Z" fill="url(#rs-floor)" />
  <g stroke="#3ce0ff" stroke-opacity=".18">
    {#each grid as x}<line x1={200 + (x - 200) * 0.25} y1="680" x2={x} y2="1100" />{/each}
    {#each rows as y}<line x1="-1200" y1={y} x2="1600" y2={y} />{/each}
  </g>
  <rect x="-1200" y="678" width="2800" height="3" fill="#3ce0ff" opacity=".6" />
  <rect class="blink" x="186" y="52" width="28" height="4" fill="#ff3d81" />
</svg>

<style>
  svg { width: 100%; height: 100%; display: block; }
  .tw { animation: tw var(--d) ease-in-out var(--delay) infinite alternate; }
  .blink { animation: blink 1.4s steps(2) infinite; }
  @keyframes tw { to { opacity: 0.1; } }
  @keyframes blink { to { opacity: 0.15; } }
</style>

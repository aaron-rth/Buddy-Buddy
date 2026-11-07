<script lang="ts">
  import { pine, range, seeded, starField } from '../scene-utils';
  const r = seeded(11);
  const stars = starField(3, 140, -900, 430);
  const far = range(-820, 1220, 26).map((x) => pine(x + r() * 12, 618 + r() * 18, 90 + r() * 50)).join('');
  const mid = range(-800, 1200, 38).map((x) => pine(x + r() * 16, 690 + r() * 20, 150 + r() * 70)).join('');
  const near = range(-780, 1200, 64).map((x) => pine(x + r() * 26, 800 + r() * 14, 240 + r() * 110)).join('');
</script>

<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
  <defs>
    <linearGradient id="mn-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#03050f" />
      <stop offset=".6" stop-color="#101c3d" />
      <stop offset="1" stop-color="#22355f" />
    </linearGradient>
    <radialGradient id="mn-glow">
      <stop offset="0" stop-color="#dfe6ff" stop-opacity=".5" />
      <stop offset=".35" stop-color="#9fb3ff" stop-opacity=".16" />
      <stop offset="1" stop-color="#9fb3ff" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect x="-1200" y="-1200" width="2800" height="2000" fill="url(#mn-sky)" />
  {#each stars as s}
    <circle class="tw" cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.o} style="--d:{s.d}s;--delay:{s.delay}s" />
  {/each}
  <circle cx="282" cy="200" r="230" fill="url(#mn-glow)" />
  <circle cx="282" cy="200" r="62" fill="#eef1ff" />
  <circle cx="262" cy="186" r="13" fill="#d5dbf3" />
  <circle cx="300" cy="222" r="9" fill="#d5dbf3" />
  <circle cx="296" cy="176" r="6" fill="#dde2f6" />
  <path d="M-1200 640 Q-600 560 -100 610 T 600 590 T 1600 600 V1400 H-1200Z" fill="#14234a" />
  <path d={far} fill="#101d3b" />
  <path d="M-1200 700 Q-500 650 0 690 T 1600 680 V1400 H-1200Z" fill="#0b152d" />
  <path d={mid} fill="#09122a" />
  <path d={near} fill="#040814" />
  <rect x="-1200" y="796" width="2800" height="600" fill="#040814" />
</svg>

<style>
  svg { width: 100%; height: 100%; display: block; }
  .tw { animation: tw var(--d) ease-in-out var(--delay) infinite alternate; }
  @keyframes tw { to { opacity: 0.15; } }
</style>

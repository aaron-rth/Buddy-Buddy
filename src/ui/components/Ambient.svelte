<script lang="ts">
  import type { Ambient } from '../../themes/types';
  import { seeded } from '../../themes/scene-utils';
  let { kinds }: { kinds: Ambient[] } = $props();

  const r = seeded(42);
  const particles = Array.from({ length: 26 }, () => ({
    x: r() * 100,
    y: r() * 100,
    s: 2 + r() * 4,
    d: 8 + r() * 12,
    delay: -r() * 20,
    drift: (r() - 0.5) * 60,
  }));
</script>

<div class="ambient">
  {#if kinds.includes('fog')}
    <div class="fog f1"></div>
    <div class="fog f2"></div>
    <div class="fog f3"></div>
  {/if}
  {#if kinds.includes('rain')}
    <div class="rain"></div>
    <div class="rain r2"></div>
  {/if}
  {#if kinds.includes('stars')}
    <div class="shoot"></div>
    <div class="shoot s2"></div>
  {/if}
  {#if kinds.includes('sparkles') || kinds.includes('dust') || kinds.includes('embers')}
    {#each particles as p}
      <span
        class="p"
        class:sparkle={kinds.includes('sparkles')}
        class:dust={kinds.includes('dust')}
        class:ember={kinds.includes('embers')}
        style="left:{p.x}%;top:{p.y}%;width:{p.s}px;height:{p.s}px;--d:{p.d}s;--delay:{p.delay}s;--drift:{p.drift}px"
      ></span>
    {/each}
  {/if}
</div>

<style>
  .ambient { position: absolute; inset: 0; overflow: hidden; }
  .fog {
    position: absolute;
    width: 160%;
    height: 45%;
    left: -30%;
    border-radius: 50%;
    background: radial-gradient(closest-side, rgba(220, 230, 255, 0.13), transparent);
    filter: blur(10px);
    animation: fog 26s ease-in-out infinite alternate;
  }
  .f1 { bottom: -5%; }
  .f2 { bottom: 18%; height: 30%; animation-duration: 34s; animation-direction: alternate-reverse; opacity: 0.8; }
  .f3 { bottom: 35%; height: 22%; animation-duration: 42s; opacity: 0.5; }
  @keyframes fog { from { transform: translateX(-12%); } to { transform: translateX(12%); } }

  .rain {
    position: absolute;
    inset: -20% -20% 0 -20%;
    background-image: repeating-linear-gradient(105deg, transparent 0 22px, rgba(200, 220, 230, 0.09) 22px 23px, transparent 23px 47px);
    background-size: 100% 120px;
    animation: rain 0.7s linear infinite;
  }
  .r2 { opacity: 0.5; animation-duration: 1.1s; background-size: 100% 90px; }
  @keyframes rain { to { background-position: -30px 120px; } }

  .shoot {
    position: absolute;
    top: 12%;
    left: 80%;
    width: 120px;
    height: 1.5px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.9), transparent);
    transform: rotate(-200deg);
    opacity: 0;
    animation: shoot 9s ease-in 2s infinite;
  }
  .s2 { top: 30%; left: 30%; animation-delay: 6s; animation-duration: 13s; }
  @keyframes shoot {
    0% { opacity: 0; translate: 0 0; }
    2% { opacity: 1; }
    8% { opacity: 0; translate: -260px -90px; }
    100% { opacity: 0; translate: -260px -90px; }
  }

  .p {
    position: absolute;
    border-radius: 50%;
    animation: rise var(--d) linear var(--delay) infinite;
    opacity: 0;
  }
  .sparkle { background: #fff2c2; box-shadow: 0 0 8px 2px rgba(255, 220, 140, 0.6); }
  .dust { background: rgba(255, 220, 160, 0.5); filter: blur(0.5px); }
  .ember { background: #ff9a3c; box-shadow: 0 0 6px #ff7b00; }
  @keyframes rise {
    0% { opacity: 0; transform: translate(0, 0) scale(0.6); }
    20% { opacity: 0.9; }
    80% { opacity: 0.6; }
    100% { opacity: 0; transform: translate(var(--drift), -160px) scale(1); }
  }
</style>

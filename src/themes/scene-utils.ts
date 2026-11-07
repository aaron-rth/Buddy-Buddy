/**
 * Hilfen für die SVG-Hintergründe.
 * Szenen nutzen viewBox 0 0 400 800 mit „meet“ und zeichnen absichtlich weit über den
 * Rand hinaus (x −800…1200, y −1000…), damit jedes Seitenverhältnis gefüllt ist.
 */
export function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export function range(from: number, to: number, step: number): number[] {
  const out: number[] = [];
  for (let x = from; x <= to; x += step) out.push(x);
  return out;
}

export function starField(seed: number, count: number, y0 = -900, y1 = 460) {
  const r = seeded(seed);
  return Array.from({ length: count }, () => ({
    x: -800 + r() * 2000,
    y: y0 + r() * (y1 - y0),
    r: r() * 1.4 + 0.3,
    o: r() * 0.6 + 0.3,
    d: (r() * 4 + 2).toFixed(2),
    delay: (r() * 4).toFixed(2),
  }));
}

/** Tannen-Silhouette als Pfad */
export function pine(x: number, base: number, h: number): string {
  const tiers = 4;
  const w = h * 0.36;
  let d = '';
  for (let i = 0; i < tiers; i++) {
    const top = base - h + (i * h * 0.8) / tiers;
    const bot = base - h + ((i + 1.5) * h * 0.8) / tiers;
    const ww = w * (0.4 + (i / (tiers - 1)) * 0.6);
    d += `M${x.toFixed(1)} ${top.toFixed(1)}L${(x + ww).toFixed(1)} ${bot.toFixed(1)}L${(x - ww).toFixed(1)} ${bot.toFixed(1)}Z`;
  }
  d += `M${x - 2.5} ${base - h * 0.12}h5V${base}h-5Z`;
  return d;
}

/** Wellenlinie über die volle Breite */
export function wave(y: number, amp: number, len: number, x0 = -1200, x1 = 1600): string {
  let d = `M${x0} ${y}`;
  for (let x = x0; x < x1; x += len) d += `q${len / 4} ${-amp} ${len / 2} 0t${len / 2} 0`;
  return d + `V1400H${x0}Z`;
}

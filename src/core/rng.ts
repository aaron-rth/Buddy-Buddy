/** Zufall: kryptografisch sicher und ohne Verzerrung. */
export type Rng = () => number;

export const cryptoRng: Rng = () => {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 2 ** 32;
};

/** Ganzzahl in [0, max) */
export function randomInt(max: number, rng: Rng): number {
  return Math.floor(rng() * max);
}

/** Fisher-Yates (in place) */
export function shuffle<T>(arr: T[], rng: Rng): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i + 1, rng);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function uid(): string {
  const buf = new Uint32Array(2);
  crypto.getRandomValues(buf);
  return buf[0].toString(36) + buf[1].toString(36);
}

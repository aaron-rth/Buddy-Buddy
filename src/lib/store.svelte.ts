import type { Game, GameConfig } from '../core/types';
import { normalizeConfig } from '../core/defaults';

/**
 * Gesamter App-Zustand. Wird nur lokal (localStorage) gespeichert – nichts verlässt das Gerät.
 */
const KEY = 'buddy-buddy:v1';

interface Saved {
  config: GameConfig;
  game: Game | null;
}

function load(): Saved {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw) as Partial<Saved>;
      return { config: normalizeConfig(data.config), game: data.game ?? null };
    }
  } catch {
    /* privater Modus o. Ä. */
  }
  return { config: normalizeConfig(undefined), game: null };
}

export const store: Saved = $state(load());

export function persist(): void {
  try {
    localStorage.setItem(KEY, JSON.stringify($state.snapshot(store)));
  } catch {
    /* ignorieren */
  }
}

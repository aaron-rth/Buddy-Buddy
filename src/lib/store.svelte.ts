import type { Game, GameConfig, Group, PlayerStats } from '../core/types';
import { normalizeConfig } from '../core/defaults';

/**
 * Gesamter App-Zustand. Wird nur lokal (localStorage) gespeichert – nichts verlässt das Gerät.
 */
const KEY = 'buddy-buddy:v1';

interface Saved {
  config: GameConfig;
  game: Game | null;
  groups: Group[];
  /** Statistik je Spielername */
  stats: Record<string, PlayerStats>;
  prefs: { sound: boolean };
}

function load(): Saved {
  const empty: Saved = { config: normalizeConfig(undefined), game: null, groups: [], stats: {}, prefs: { sound: false } };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw) as Partial<Saved>;
      return {
        config: normalizeConfig(d.config),
        game: d.game ?? null,
        groups: Array.isArray(d.groups) ? d.groups : [],
        stats: d.stats && typeof d.stats === 'object' ? d.stats : {},
        prefs: { ...empty.prefs, ...(d.prefs ?? {}) },
      };
    }
  } catch {
    /* privater Modus o. Ä. */
  }
  return empty;
}

export const store: Saved = $state(load());

export function persist(): void {
  try {
    localStorage.setItem(KEY, JSON.stringify($state.snapshot(store)));
  } catch {
    /* ignorieren */
  }
}

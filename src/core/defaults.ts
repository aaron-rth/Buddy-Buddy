import type { GameConfig, HouseSize } from './types';
import { SPECIAL_ROLE_IDS } from './roles';

export const MIN_PLAYERS = 4;

/**
 * Empfohlene Imposter-Anzahl ≈ Spieler ÷ 6.
 * Orientierung: Among Us (mehrere Kills pro Runde, Standard 10 Spieler / 2 Imposter ≈ 1:5).
 * Werwolf-Quoten (1:3–1:4) passen nicht, weil dort nur 1 Kill pro Nacht möglich ist.
 */
export function recommendedImposters(n: number): number {
  return Math.max(1, Math.round(n / 6));
}

/** Harte Grenze: Imposter < ⅓ der Spieler. */
export function maxImposters(n: number): number {
  return Math.max(1, Math.floor((n - 1) / 3));
}

/** Zusatzchance nur im Grenzbereich knapp unter der nächsten Stufe. */
export function recommendedExtraChance(n: number): number {
  const base = recommendedImposters(n);
  if (n / 6 >= base + 0.25 && base + 1 <= maxImposters(n)) return 0.25;
  return 0;
}

export const HOUSE_PRESETS: Record<HouseSize, { label: string; hint: string; killCooldown: number; deathCountdown: number }> = {
  small: { label: 'Wohnung', hint: 'Man trifft sich schnell', killCooldown: 60, deathCountdown: 5 },
  medium: { label: 'Haus', hint: 'Standard', killCooldown: 45, deathCountdown: 10 },
  large: { label: 'Großes Haus', hint: 'Viele Verstecke', killCooldown: 30, deathCountdown: 10 },
};

export function defaultConfig(): GameConfig {
  return {
    themeId: 'mondnacht',
    players: [],
    roles: [
      { roleId: 'imposter', enabled: true, count: 1, extraChance: 0 },
      ...SPECIAL_ROLE_IDS.map((roleId) => ({ roleId, enabled: false, count: 1, extraChance: 0 })),
    ],
    customRoles: [],
    autoImposters: true,
    house: 'medium',
    killCooldown: HOUSE_PRESETS.medium.killCooldown,
    deathCountdown: HOUSE_PRESETS.medium.deathCountdown,
    cooldownOnNightStart: true,
    impostersKnow: false,
    noDoubleKill: true,
    revealOnVoteOut: false,
    emergencyMeeting: true,
    discussionMinutes: 3,
    countDisplay: 'range',
    override: false,
  };
}

/** Setzt Imposter-Anzahl + Zusatzchance auf die Empfehlung (falls automatisch). */
export function applyAutoImposters(config: GameConfig): void {
  if (!config.autoImposters) return;
  const s = config.roles.find((r) => r.roleId === 'imposter');
  if (!s) return;
  const n = config.players.length;
  s.count = recommendedImposters(n);
  s.extraChance = recommendedExtraChance(n);
}

/** Ergänzt fehlende Felder/Rollen (z. B. nach einem Update der App). */
export function normalizeConfig(raw: Partial<GameConfig> | undefined): GameConfig {
  const base = defaultConfig();
  const cfg: GameConfig = { ...base, ...(raw ?? {}) };
  const roles = Array.isArray(cfg.roles) ? cfg.roles : [];
  const ids = new Set([...base.roles.map((r) => r.roleId), ...(cfg.customRoles ?? []).map((c) => c.id)]);
  cfg.roles = roles.filter((r) => ids.has(r.roleId));
  for (const r of base.roles) if (!cfg.roles.some((x) => x.roleId === r.roleId)) cfg.roles.push(r);
  cfg.roles.sort((a, b) => (a.roleId === 'imposter' ? -1 : b.roleId === 'imposter' ? 1 : 0));
  cfg.players = Array.isArray(cfg.players) ? cfg.players : [];
  cfg.customRoles = Array.isArray(cfg.customRoles) ? cfg.customRoles : [];
  return cfg;
}

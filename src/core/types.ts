export type Team = 'crew' | 'imposter' | 'neutral';

/**
 * Rollendefinition – beschreibt, was eine Rolle IST.
 * Texte dürfen Platzhalter enthalten, die beim Anzeigen ersetzt werden:
 * {imposter} {imposters} {crew} {crews} {cooldown} {countdown}
 * Grammatik-Regel: {imposter} nur im Nominativ nach „ein“ verwenden
 * („Ist das Ziel ein {imposter}“), {imposters} nur im Plural mit „die/alle“.
 */
export interface RoleDef {
  id: string;
  team: Team;
  name: string;
  plural: string;
  icon: string;
  /** Eine Zeile auf der Rollenkarte. */
  short: string;
  /** Eigenes Ziel (sonst Team-Ziel). */
  goal?: string;
  /** Ab wie vielen Spielern sinnvoll. */
  minPlayers: number;
  maxCount: number;
  /** Balance-Punkte, Idee aus „Ultimate Werewolf“: + hilft der Crew, − den Impostern. */
  weight: number;
  /** Zusatzwissen, das beim Aufdecken angezeigt wird. */
  knows?: 'imposters' | 'innocent';
  custom?: boolean;
}

export interface CustomRole {
  id: string;
  name: string;
  team: Team;
  description: string;
}

/** Wie oft eine Rolle in DIESER Runde vorkommt. */
export interface RoleSetting {
  roleId: string;
  enabled: boolean;
  /** garantiert */
  count: number;
  /** 0–1: Wahrscheinlichkeit für +1 */
  extraChance: number;
}

export interface Player {
  id: string;
  name: string;
}

export type HouseSize = 'small' | 'medium' | 'large';

export interface GameConfig {
  themeId: string;
  players: Player[];
  /** enthält immer 'imposter'; Crew füllt automatisch auf */
  roles: RoleSetting[];
  customRoles: CustomRole[];
  /** Imposter-Anzahl folgt automatisch der Empfehlung */
  autoImposters: boolean;
  house: HouseSize | 'custom';
  killCooldown: number;
  deathCountdown: number;
  cooldownOnNightStart: boolean;
  impostersKnow: boolean;
  noDoubleKill: boolean;
  revealOnVoteOut: boolean;
  /** Notfall-Versammlungen pro Spiel (insgesamt, nicht pro Spieler) */
  emergencyMeetings: number;
  discussionMinutes: number;
  lovers: LoversSetting;
  /** 'range' = nur Spanne verraten (z. B. 2–3) */
  countDisplay: 'exact' | 'range';
  /** blockierte (überschreibbare) Konfiguration trotzdem erlauben */
  override: boolean;
}

export interface LoversSetting {
  enabled: boolean;
  /** 1 = sicher, sonst Wahrscheinlichkeit, dass es ein Paar gibt */
  chance: number;
  /** true = kann jeden treffen (auch böse), false = nur gute Spieler */
  anyone: boolean;
}

export type Winner = 'crew' | 'imposter' | 'jester' | 'lovers';

export type RevealInfo =
  | { type: 'teammates'; names: string[] }
  | { type: 'unknownTeammates'; maybeAlone: boolean }
  | { type: 'imposters'; names: string[] }
  | { type: 'innocent'; name: string | null };

export interface Assignment {
  playerId: string;
  name: string;
  roleId: string;
  seen: boolean;
  info?: RevealInfo;
  /** Verliebtes Paar: Name des Partners; mixed = Partner ist im anderen Team */
  lover?: { partner: string; mixed: boolean };
}

export interface Group {
  id: string;
  name: string;
  players: string[];
}

export interface PlayerStats {
  games: number;
  wins: number;
  imposter: number;
}

export interface Game {
  id: string;
  createdAt: number;
  assignments: Assignment[];
  /** Momentaufnahme der Regeln bei der Verteilung */
  config: GameConfig;
  /** Ergebnis, sobald in der Auflösung eingetragen */
  winner?: Winner;
}

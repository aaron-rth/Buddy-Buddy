import type { CustomRole, GameConfig, RoleDef } from './types';

/**
 * Eingebaute Rollen. Neue Rolle = neuer Eintrag hier (+ optional Theme-Namen).
 * Namen sind neutral – Themes überschreiben sie (siehe src/themes).
 */
export const BUILTIN_ROLES: RoleDef[] = [
  {
    id: 'crew',
    team: 'crew',
    name: 'Crew',
    plural: 'Crew',
    icon: 'custom-good',
    short: 'Finde die {imposters}, bevor es zu spät ist.',
    minPlayers: 0,
    maxCount: 99,
    weight: 1,
  },
  {
    id: 'imposter',
    team: 'imposter',
    name: 'Imposter',
    plural: 'Imposter',
    icon: 'dagger',
    short: '2× an die Schulter tippen = Kill. Danach {cooldown} s warten.',
    minPlayers: 0,
    maxCount: 12,
    weight: -5,
  },
  {
    id: 'sheriff',
    team: 'crew',
    name: 'Sheriff',
    plural: 'Sheriffs',
    icon: 'badge',
    short: 'Einmal pro Spiel: 4× antippen. Ist das Ziel ein {imposter}, stirbt es. Sonst flüstert es „falsch“ – und du stirbst.',
    minPlayers: 8,
    maxCount: 1,
    weight: 3,
  },
  {
    id: 'detective',
    team: 'crew',
    name: 'Ermittler',
    plural: 'Ermittler',
    icon: 'eye',
    short: 'Du kennst eine Person, die sicher unschuldig ist.',
    minPlayers: 7,
    maxCount: 2,
    weight: 2,
    knows: 'innocent',
  },
  {
    id: 'accomplice',
    team: 'imposter',
    name: 'Komplize',
    plural: 'Komplizen',
    icon: 'key',
    short: 'Du kennst die {imposters}, kannst aber nicht töten. Lenk den Verdacht ab.',
    minPlayers: 10,
    maxCount: 2,
    weight: -3,
    knows: 'imposters',
  },
  {
    id: 'jester',
    team: 'neutral',
    name: 'Narr',
    plural: 'Narren',
    icon: 'jester',
    short: 'Wirk verdächtig – aber nicht zu sehr.',
    goal: 'Werde in einer {meeting} rausgewählt. Dann gewinnst du allein.',
    minPlayers: 9,
    maxCount: 1,
    weight: -1,
  },
];

export const SPECIAL_ROLE_IDS = BUILTIN_ROLES.filter((r) => r.id !== 'crew' && r.id !== 'imposter').map((r) => r.id);

const CUSTOM_WEIGHT = { crew: 2, imposter: -3, neutral: -1 } as const;

export function customToDef(c: CustomRole): RoleDef {
  return {
    id: c.id,
    team: c.team,
    name: c.name.trim() || 'Eigene Rolle',
    plural: c.name.trim() || 'Eigene Rolle',
    icon: c.team === 'imposter' ? 'custom-evil' : c.team === 'neutral' ? 'custom-neutral' : 'custom-good',
    short: c.description.trim(),
    minPlayers: 0,
    maxCount: 12,
    weight: CUSTOM_WEIGHT[c.team],
    custom: true,
  };
}

/** Alle Rollen der aktuellen Konfiguration (eingebaut + eigene). */
export function roleMap(config: Pick<GameConfig, 'customRoles'>): Record<string, RoleDef> {
  const map: Record<string, RoleDef> = {};
  for (const r of BUILTIN_ROLES) map[r.id] = r;
  for (const c of config.customRoles) map[c.id] = customToDef(c);
  return map;
}

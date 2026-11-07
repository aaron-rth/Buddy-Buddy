import type { GameConfig, RoleDef } from '../core/types';
import { roleMap } from '../core/roles';
import type { Theme } from '../themes/types';

export interface ThemedRole {
  id: string;
  team: RoleDef['team'];
  name: string;
  icon: string;
  short: string;
  goal: string;
}

const TEAM_GOAL = {
  crew: 'Entlarvt alle {imposters}.',
  imposter: 'Werdet so viele wie alle anderen zusammen.',
  neutral: 'Du spielst für dich allein.',
};

/** Ersetzt Platzhalter durch Theme-Begriffe und Regelwerte. */
export function fill(text: string, theme: Theme, config?: GameConfig): string {
  return text.replace(/\{(\w+)(?::(\w+))?\}/g, (m, key: string, arg?: string) => {
    switch (key) {
      case 'imposter': return theme.terms.imposter;
      case 'imposters': return theme.terms.imposters;
      case 'crew': return theme.terms.crew;
      case 'crews': return theme.terms.crews;
      case 'night': return theme.terms.night;
      case 'meeting': return theme.terms.meeting;
      case 'cooldown': return String(config?.killCooldown ?? 45);
      case 'countdown': return String(config?.deathCountdown ?? 10);
      case 'role': return arg && config ? roleName(arg, theme, config) : m;
      default: return m;
    }
  });
}

export function roleName(id: string, theme: Theme, config: Pick<GameConfig, 'customRoles'>): string {
  if (id === 'imposter') return theme.terms.imposter;
  if (id === 'crew') return theme.terms.crew;
  return theme.roles[id]?.name ?? roleMap(config)[id]?.name ?? id;
}

export function rolePlural(id: string, theme: Theme, config: Pick<GameConfig, 'customRoles'>): string {
  if (id === 'imposter') return theme.terms.imposters;
  if (id === 'crew') return theme.terms.crews;
  return roleName(id, theme, config);
}

export function themedRole(id: string, theme: Theme, config: GameConfig): ThemedRole {
  const def = roleMap(config)[id] ?? roleMap(config)['crew'];
  return {
    id: def.id,
    team: def.team,
    name: roleName(def.id, theme, config),
    icon: theme.roles[def.id]?.icon ?? def.icon,
    short: fill(def.short, theme, config),
    goal: fill(def.goal ?? TEAM_GOAL[def.team], theme, config),
  };
}

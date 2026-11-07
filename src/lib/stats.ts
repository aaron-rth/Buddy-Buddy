import type { Game, PlayerStats, Winner } from '../core/types';
import { roleMap } from '../core/roles';

/** Wer hat gewonnen? Liefert die Namen der Gewinner. */
export function winners(game: Game, winner: Winner): string[] {
  const defs = roleMap(game.config);
  return game.assignments
    .filter((a) => {
      const team = defs[a.roleId]?.team;
      if (winner === 'lovers') return !!a.lover;
      if (a.lover?.mixed) return false; // verbotenes Paar spielt nur für sich
      if (winner === 'jester') return a.roleId === 'jester';
      return team === winner;
    })
    .map((a) => a.name);
}

export function recordResult(stats: Record<string, PlayerStats>, game: Game, winner: Winner): void {
  const won = new Set(winners(game, winner));
  for (const a of game.assignments) {
    const s = (stats[a.name] ??= { games: 0, wins: 0, imposter: 0 });
    s.games++;
    if (won.has(a.name)) s.wins++;
    if (a.roleId === 'imposter') s.imposter++;
  }
}

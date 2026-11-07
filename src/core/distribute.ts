import type { Assignment, Game, GameConfig } from './types';
import { activeSettings, analyze, resolveCounts } from './balance';
import { roleMap } from './roles';
import { cryptoRng, randomInt, shuffle, uid, type Rng } from './rng';

export class DistributionError extends Error {}

/**
 * Verteilt die Rollen zufällig.
 * Garantiert: jeder Spieler genau eine Rolle, Anzahlen wie konfiguriert (inkl. gewürfelter Extras).
 */
export function distribute(config: GameConfig, rng: Rng = cryptoRng): Game {
  const a = analyze(config);
  if (a.blocked) throw new DistributionError(a.errors.map((e) => e.text).join(' '));

  const players = config.players;
  const n = players.length;
  const defs = roleMap(config);
  const settings = activeSettings(config);

  // 1. Extras würfeln, 2. Grenzen prüfen (in resolveCounts)
  const rolls = settings.map((s) => s.extraChance > 0 && rng() < s.extraChance);
  const counts = resolveCounts(config, rolls);

  // 3. Rollenpool bauen und mit Crew auffüllen
  const pool: string[] = [];
  for (const [id, c] of Object.entries(counts)) for (let i = 0; i < c; i++) pool.push(id);
  if (pool.length > n) throw new DistributionError('Mehr Rollen als Spieler.');
  while (pool.length < n) pool.push('crew');

  // 4. Mischen (Fisher-Yates + crypto)
  shuffle(pool, rng);

  const assignments: Assignment[] = players.map((p, i) => ({
    playerId: p.id,
    name: p.name,
    roleId: pool[i],
    seen: false,
  }));

  // Zusatzwissen
  const imposters = assignments.filter((x) => x.roleId === 'imposter');
  const maxPossibleImposters = a.imposterRange[1];
  for (const x of assignments) {
    const def = defs[x.roleId];
    if (x.roleId === 'imposter') {
      if (config.impostersKnow) {
        const names = imposters.filter((o) => o !== x).map((o) => o.name);
        if (names.length) x.info = { type: 'teammates', names };
      } else if (maxPossibleImposters > 1) {
        x.info = { type: 'unknownTeammates', maybeAlone: a.imposterRange[0] <= 1 };
      }
    } else if (def.knows === 'imposters') {
      x.info = { type: 'imposters', names: imposters.map((o) => o.name) };
    } else if (def.knows === 'innocent') {
      const candidates = assignments.filter((o) => o !== x && defs[o.roleId].team === 'crew');
      x.info = { type: 'innocent', name: candidates.length ? candidates[randomInt(candidates.length, rng)].name : null };
    }
  }

  // 5. Kontrolle
  if (assignments.length !== n || new Set(assignments.map((x) => x.playerId)).size !== n)
    throw new DistributionError('Interner Fehler bei der Verteilung.');
  for (const [id, c] of Object.entries(counts))
    if (assignments.filter((x) => x.roleId === id).length !== c) throw new DistributionError('Interner Fehler bei der Verteilung.');

  return { id: uid(), createdAt: Date.now(), assignments, config: structuredClone(config) };
}

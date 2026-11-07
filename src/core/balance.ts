import type { GameConfig, RoleDef, RoleSetting } from './types';
import { roleMap } from './roles';
import { MIN_PLAYERS, maxImposters, recommendedImposters } from './defaults';

/** Texte enthalten Platzhalter ({imposter}, {role:id} …), die das UI mit Theme-Begriffen füllt. */
export interface Issue {
  level: 'error' | 'warn';
  text: string;
  overridable?: boolean;
}

export const LOVERS_MIN = 8;

export interface Outcome {
  counts: Record<string, number>;
  p: number;
}

export interface Analysis {
  n: number;
  errors: Issue[];
  warnings: Issue[];
  /** blockiert die Verteilung (unter Berücksichtigung von override) */
  blocked: boolean;
  score: number;
  tolerance: number;
  /** −1 (Imposter im Vorteil) … +1 (Crew im Vorteil) */
  position: number;
  verdict: 'balanced' | 'crew' | 'crew-strong' | 'imposter' | 'imposter-strong';
  imposterDist: { count: number; p: number }[];
  imposterRange: [number, number];
  recommended: number;
}

/** Aktive Rolleneinstellungen in fester Reihenfolge (Imposter zuerst). */
export function activeSettings(config: GameConfig): RoleSetting[] {
  const defs = roleMap(config);
  return config.roles.filter((s) => s.enabled && defs[s.roleId] && s.roleId !== 'crew');
}

/**
 * Wendet gewürfelte Extras an. Ein Extra entfällt, wenn es eine Grenze verletzen würde –
 * so kann eine Wahrscheinlichkeit nie zu einer kaputten Kombination führen.
 */
export function resolveCounts(config: GameConfig, rolls: boolean[]): Record<string, number> {
  const n = config.players.length;
  const defs = roleMap(config);
  const settings = activeSettings(config);
  const counts: Record<string, number> = {};
  for (const s of settings) counts[s.roleId] = Math.max(0, Math.floor(s.count));
  let total = Object.values(counts).reduce((a, b) => a + b, 0);
  settings.forEach((s, i) => {
    if (!rolls[i]) return;
    const next = counts[s.roleId] + 1;
    if (total + 1 > n) return;
    if (next > defs[s.roleId].maxCount) return;
    if (s.roleId === 'imposter' && next * 3 >= n) return;
    counts[s.roleId] = next;
    total++;
  });
  return counts;
}

export function outcomes(config: GameConfig): Outcome[] {
  const settings = activeSettings(config);
  const chanceIdx = settings.map((s, i) => (s.extraChance > 0 ? i : -1)).filter((i) => i >= 0);
  const k = chanceIdx.length;
  const result: Outcome[] = [];
  const combos = 1 << Math.min(k, 12);
  for (let mask = 0; mask < combos; mask++) {
    const rolls = settings.map(() => false);
    let p = 1;
    chanceIdx.forEach((idx, bit) => {
      const c = Math.min(1, Math.max(0, settings[idx].extraChance));
      const hit = bit < 12 && (mask & (1 << bit)) !== 0;
      rolls[idx] = hit;
      p *= hit ? c : 1 - c;
    });
    if (p > 0) result.push({ counts: resolveCounts(config, rolls), p });
  }
  return result;
}

function sumCounts(counts: Record<string, number>) {
  return Object.values(counts).reduce((a, b) => a + b, 0);
}

export function analyze(config: GameConfig): Analysis {
  const n = config.players.length;
  const defs = roleMap(config);
  const settings = activeSettings(config);
  const errors: Issue[] = [];
  const warnings: Issue[] = [];
  const recommended = recommendedImposters(n);
  const imp = settings.find((s) => s.roleId === 'imposter')?.count ?? 0;
  const guaranteed: Record<string, number> = {};
  for (const s of settings) guaranteed[s.roleId] = Math.max(0, Math.floor(s.count));
  const guaranteedTotal = sumCounts(guaranteed);

  if (n < MIN_PLAYERS) errors.push({ level: 'error', text: `Mindestens ${MIN_PLAYERS} Spieler nötig.` });
  if (imp < 1) errors.push({ level: 'error', text: 'Es braucht mindestens einen {imposter}.' });
  if (n >= MIN_PLAYERS && guaranteedTotal > n) errors.push({ level: 'error', text: 'Mehr Rollen als Spieler.' });
  for (const c of config.customRoles) {
    const s = config.roles.find((r) => r.roleId === c.id);
    if (s?.enabled && !c.name.trim()) errors.push({ level: 'error', text: 'Eine eigene Rolle hat keinen Namen.' });
  }
  if (n >= MIN_PLAYERS && imp >= 1 && imp * 3 >= n) {
    errors.push({
      level: 'error',
      overridable: true,
      text: `Zu viele {imposters}: Sie wären fast sofort in der Überzahl. Maximal ${maxImposters(n)} bei ${n} Spielern.`,
    });
  }

  const outs = n >= MIN_PLAYERS && guaranteedTotal <= n ? outcomes(config) : [{ counts: guaranteed, p: 1 }];

  if (n >= MIN_PLAYERS) {
    if (imp > recommended && imp * 3 < n)
      warnings.push({ level: 'warn', text: `Mehr {imposters} als empfohlen (${recommended}) – sie sind im Vorteil.` });
    if (n >= 18 && imp < n / 9)
      warnings.push({ level: 'warn', text: 'Wenige {imposters} – das Spiel könnte sich ziehen.' });
    for (const s of settings) {
      const d = defs[s.roleId];
      if (s.roleId !== 'imposter' && n < d.minPlayers)
        warnings.push({ level: 'warn', text: `{role:${d.id}} ist erst ab ${d.minPlayers} Spielern sinnvoll.` });
    }
    if (config.lovers?.enabled && n < LOVERS_MIN)
      warnings.push({ level: 'warn', text: `{lovers}: erst ab ${LOVERS_MIN} Spielern sinnvoll.` });
    const maxSpecials = Math.max(
      ...outs.map((o) => sumCounts(o.counts) - (o.counts['imposter'] ?? 0)),
    );
    if (maxSpecials > n / 3) warnings.push({ level: 'warn', text: 'Viele Sonderrollen – das wird unübersichtlich.' });
    const maxEvil = Math.max(
      ...outs.map((o) => Object.entries(o.counts).reduce((a, [id, c]) => a + (defs[id]?.team === 'imposter' ? c : 0), 0)),
    );
    if (maxEvil * 3 >= n && imp * 3 < n)
      warnings.push({ level: 'warn', text: 'Das Team der {imposters} ist sehr groß.' });
    // Extras, die nie greifen können
    settings.forEach((s, i) => {
      if (s.extraChance <= 0 || guaranteedTotal > n) return;
      const rolls = settings.map((_, j) => j === i);
      const withExtra = resolveCounts(config, rolls)[s.roleId];
      if (withExtra === Math.floor(s.count))
        warnings.push({ level: 'warn', text: `Die Zusatzchance für {role:${s.roleId}} greift bei ${n} Spielern nie.` });
    });
  }

  // Balance-Punkte (Erwartungswert über alle Ergebnisse)
  let score = 0;
  for (const o of outs) {
    const special = sumCounts(o.counts);
    let s = Math.max(0, n - special) * defs['crew'].weight;
    for (const [id, c] of Object.entries(o.counts)) s += c * (defs[id] as RoleDef).weight;
    score += s * o.p;
  }
  const tolerance = Math.max(3, n * 0.2);
  const position = Math.max(-1, Math.min(1, score / (tolerance * 3)));
  let verdict: Analysis['verdict'] = 'balanced';
  if (score > tolerance * 2) verdict = 'crew-strong';
  else if (score > tolerance) verdict = 'crew';
  else if (score < -tolerance * 2) verdict = 'imposter-strong';
  else if (score < -tolerance) verdict = 'imposter';

  const distMap = new Map<number, number>();
  for (const o of outs) {
    const c = o.counts['imposter'] ?? 0;
    distMap.set(c, (distMap.get(c) ?? 0) + o.p);
  }
  const imposterDist = [...distMap.entries()].map(([count, p]) => ({ count, p })).sort((a, b) => a.count - b.count);
  const imposterRange: [number, number] = [imposterDist[0]?.count ?? 0, imposterDist[imposterDist.length - 1]?.count ?? 0];

  const blocked = errors.some((e) => !(e.overridable && config.override));
  return { n, errors, warnings, blocked, score, tolerance, position, verdict, imposterDist, imposterRange, recommended };
}

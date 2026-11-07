import { describe, expect, it } from 'vitest';
import { defaultConfig, maxImposters, recommendedExtraChance, recommendedImposters, applyAutoImposters } from './defaults';
import { analyze } from './balance';
import { distribute } from './distribute';
import type { GameConfig } from './types';

function cfg(n: number, patch: (c: GameConfig) => void = () => {}): GameConfig {
  const c = defaultConfig();
  c.players = Array.from({ length: n }, (_, i) => ({ id: 'p' + i, name: 'Spieler ' + i }));
  applyAutoImposters(c);
  patch(c);
  return c;
}
const set = (c: GameConfig, id: string, count: number, extraChance = 0) => {
  const s = c.roles.find((r) => r.roleId === id)!;
  Object.assign(s, { enabled: true, count, extraChance });
};

describe('Empfehlungen', () => {
  it('Imposter ≈ Spieler ÷ 6', () => {
    expect([4, 7, 8, 9, 13, 14, 15, 20, 21].map(recommendedImposters)).toEqual([1, 1, 1, 2, 2, 2, 3, 3, 4]);
  });
  it('Zusatzchance nur im Grenzbereich', () => {
    expect(recommendedExtraChance(8)).toBe(0.25);
    expect(recommendedExtraChance(14)).toBe(0.25);
    expect(recommendedExtraChance(10)).toBe(0);
    expect(recommendedExtraChance(5)).toBe(0);
  });
  it('Empfehlung ist nie blockiert und ausgeglichen', () => {
    for (let n = 4; n <= 30; n++) {
      const a = analyze(cfg(n));
      expect(a.blocked, `n=${n}`).toBe(false);
      expect(a.verdict, `n=${n}`).toBe('balanced');
    }
  });
  it('harte Grenze: Imposter < ⅓', () => {
    expect(maxImposters(6)).toBe(1);
    expect(maxImposters(7)).toBe(2);
    expect(analyze(cfg(6, (c) => { c.autoImposters = false; set(c, 'imposter', 2); })).blocked).toBe(true);
    expect(analyze(cfg(6, (c) => { set(c, 'imposter', 2); c.override = true; })).blocked).toBe(false);
  });
});

describe('Verteilung', () => {
  it('jeder Spieler genau eine Rolle, Anzahlen stimmen', () => {
    const c = cfg(12, (c) => { set(c, 'sheriff', 1); set(c, 'detective', 1); set(c, 'jester', 1); });
    for (let i = 0; i < 2000; i++) {
      const g = distribute(c);
      expect(g.assignments).toHaveLength(12);
      const count = (id: string) => g.assignments.filter((a) => a.roleId === id).length;
      expect(count('imposter')).toBe(2);
      expect(count('sheriff')).toBe(1);
      expect(count('detective')).toBe(1);
      expect(count('jester')).toBe(1);
      expect(count('crew')).toBe(7);
    }
  });

  it('Zusatzchance trifft ungefähr die Wahrscheinlichkeit', () => {
    const c = cfg(14); // 2 + 25 %
    let three = 0;
    const N = 20000;
    for (let i = 0; i < N; i++) if (distribute(c).assignments.filter((a) => a.roleId === 'imposter').length === 3) three++;
    expect(three / N).toBeGreaterThan(0.23);
    expect(three / N).toBeLessThan(0.27);
  });

  it('Extras brechen nie die Grenzen', () => {
    const c = cfg(9, (c) => { c.autoImposters = false; set(c, 'imposter', 2, 1); });
    for (let i = 0; i < 500; i++) expect(distribute(c).assignments.filter((a) => a.roleId === 'imposter').length).toBe(2);
    expect(analyze(c).warnings.some((w) => w.text.includes('greift'))).toBe(true);
  });

  it('jeder Spieler kann Imposter werden (keine Verzerrung)', () => {
    const c = cfg(6);
    const hits = new Array(6).fill(0);
    const N = 30000;
    for (let i = 0; i < N; i++) distribute(c).assignments.forEach((a, j) => a.roleId === 'imposter' && hits[j]++);
    for (const h of hits) expect(Math.abs(h / N - 1 / 6)).toBeLessThan(0.015);
  });

  it('Zusatzwissen: Komplize kennt Imposter, Ermittler kennt Unschuldigen', () => {
    const c = cfg(12, (c) => { set(c, 'accomplice', 1); set(c, 'detective', 1); });
    for (let i = 0; i < 300; i++) {
      const g = distribute(c);
      const imps = g.assignments.filter((a) => a.roleId === 'imposter').map((a) => a.name).sort();
      const acc = g.assignments.find((a) => a.roleId === 'accomplice')!;
      expect(acc.info).toEqual({ type: 'imposters', names: expect.any(Array) });
      expect((acc.info as { names: string[] }).names.sort()).toEqual(imps);
      const det = g.assignments.find((a) => a.roleId === 'detective')!;
      const innocent = g.assignments.find((a) => a.name === (det.info as { name: string }).name)!;
      expect(innocent.roleId).toBe('crew');
      for (const imp of g.assignments.filter((a) => a.roleId === 'imposter')) expect(imp.info).toEqual({ type: 'unknownTeammates', maybeAlone: false });
    }
  });

  it('Imposter kennen sich (Option)', () => {
    const c = cfg(12, (c) => { c.impostersKnow = true; });
    const g = distribute(c);
    const imps = g.assignments.filter((a) => a.roleId === 'imposter');
    expect(imps[0].info).toEqual({ type: 'teammates', names: [imps[1].name] });
  });

  it('eigene Rollen werden verteilt', () => {
    const c = cfg(8, (c) => {
      c.customRoles.push({ id: 'c1', name: 'Bürgermeister', team: 'crew', description: 'Doppelte Stimme' });
      c.roles.push({ roleId: 'c1', enabled: true, count: 1, extraChance: 0 });
    });
    expect(distribute(c).assignments.filter((a) => a.roleId === 'c1')).toHaveLength(1);
  });
});

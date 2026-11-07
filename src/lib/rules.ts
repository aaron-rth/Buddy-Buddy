import type { Game } from '../core/types';
import { analyze } from '../core/balance';
import type { Theme } from '../themes/types';
import { fill, themedRole } from './text';

export interface RuleSection {
  icon: string;
  title: string;
  items: string[];
}

/** Regelkarte zum Vorlesen – erzeugt aus Regeln + Theme. */
export function buildRuleCard(game: Game, theme: Theme): { intro: string; sections: RuleSection[] } {
  const c = game.config;
  const t = theme.terms;
  const f = (s: string) => fill(s, theme, c);
  const a = analyze(c);
  const actual = game.assignments.filter((x) => x.roleId === 'imposter').length;
  const [lo, hi] = a.imposterRange;
  const count = c.countDisplay === 'exact' || lo === hi ? `${actual}` : `${lo}–${hi}`;
  const multi = hi > 1;

  // Sonderrollen, die möglich waren (nicht nur die tatsächlich verteilten – sonst verrät die Karte zu viel)
  const possible = c.roles.filter((s) => s.enabled && s.roleId !== 'imposter' && (s.count > 0 || s.extraChance > 0));
  const specials = possible.map((s) => themedRole(s.roleId, theme, c));
  const hasJester = specials.some((r) => r.id === 'jester');

  const sections: RuleSection[] = [];

  sections.push({
    icon: '🎯',
    title: 'Ziel',
    items: [
      f(`${t.crews}: Entlarvt alle {imposters}.`),
      f(`{imposters}: Werdet so viele wie alle anderen zusammen.`),
      ...(hasJester ? [`${specials.find((r) => r.id === 'jester')!.name}: will rausgewählt werden.`] : []),
    ],
  });

  sections.push({
    icon: '👥',
    title: 'In dieser Runde',
    items: [
      `${c.players.length} Spieler · ${count} ${count === '1' ? t.imposter : t.imposters}`,
      ...(specials.length ? [`Mögliche Sonderrollen: ${specials.map((r) => `${r.icon} ${r.name}`).join(', ')}`] : []),
    ],
  });

  sections.push({
    icon: '🌙',
    title: `Die ${t.night}`,
    items: [
      'Licht aus. Alle verteilen sich still im Haus.',
      ...(c.cooldownOnNightStart ? [`In den ersten ${c.killCooldown} Sekunden darf niemand töten.`] : []),
    ],
  });

  const kill = [
    f('Ein {imposter} tippt 2× auf die Schulter – das ist ein Kill.'),
    `Das Opfer zählt leise von ${c.deathCountdown} runter, legt sich hin und ist still.`,
    `Danach muss der Täter ${c.killCooldown} Sekunden warten.`,
  ];
  if (multi) {
    kill.push(f('{imposters} sind gegeneinander immun: Wer angetippt wird, tippt 2× zurück. Beide wissen dann Bescheid – der Cooldown ist trotzdem verbraucht.'));
    kill.push(c.impostersKnow ? f('Die {imposters} kennen sich von Anfang an.') : f('Die {imposters} kennen sich am Anfang nicht.'));
    if (c.noDoubleKill) kill.push(f(`Kein Doppelkill: Tötet ein {imposter} direkt neben dir, wartest du ebenfalls ${c.killCooldown} Sekunden.`));
  }
  sections.push({ icon: '🔪', title: 'Töten', items: kill });

  sections.push({
    icon: '📣',
    title: 'Leiche gefunden',
    items: [
      `Laut „${t.call}“ rufen. Licht an, alle kommen zusammen.`,
      'Tote bleiben liegen, bis sie gefunden werden – danach schweigen sie.',
      ...(c.emergencyMeeting ? [`Jeder darf einmal pro Spiel auch ohne Leiche eine ${t.meeting} einberufen.`] : []),
    ],
  });

  sections.push({
    icon: '🗳️',
    title: t.meeting,
    items: [
      `${c.discussionMinutes} ${c.discussionMinutes === 1 ? 'Minute' : 'Minuten'} diskutieren.`,
      'Auf drei zeigen alle gleichzeitig auf eine Person – oder auf den Boden (Enthaltung).',
      'Mehrheit fliegt raus. Gleichstand: niemand.',
      c.revealOnVoteOut ? 'Die Rolle der Person wird verraten.' : 'Die Rolle der Person bleibt geheim.',
      `Danach beginnt die nächste ${t.night}.`,
    ],
  });

  if (specials.length) {
    sections.push({
      icon: '⭐',
      title: 'Sonderrollen',
      items: specials.map((r) => `${r.icon} ${r.name}: ${r.short}${r.id === 'jester' ? ' ' + r.goal : ''}`.trim()),
    });
  }

  sections.push({
    icon: '🛟',
    title: 'Sicherheit',
    items: [
      'Nur Schulter oder Oberarm antippen.',
      'Nicht rennen – Treppen nur gehend.',
      '„Stopp, Licht an!“ beendet sofort alles.',
    ],
  });

  return { intro: t.intro, sections };
}

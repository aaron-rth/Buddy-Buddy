import type { Game } from '../core/types';
import { analyze } from '../core/balance';
import type { Theme } from '../themes/types';
import { fill, themedRole } from './text';

export interface RuleItem {
  text: string;
  /** Icon-Name (src/ui/icons) */
  icon?: string;
  /** fett vorangestellt, z. B. Rollenname */
  label?: string;
}

export interface RuleSection {
  icon: string;
  title: string;
  items: RuleItem[];
}

const t2 = (text: string): RuleItem => ({ text });

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
  const imp = themedRole('imposter', theme, c);

  // Sonderrollen, die möglich waren (nicht nur die tatsächlich verteilten – sonst verrät die Karte zu viel)
  const possible = c.roles.filter((s) => s.enabled && s.roleId !== 'imposter' && (s.count > 0 || s.extraChance > 0));
  const specials = possible.map((s) => themedRole(s.roleId, theme, c));
  const jester = specials.find((r) => r.id === 'jester');
  const lovers = c.lovers.enabled;

  const sections: RuleSection[] = [];

  sections.push({
    icon: 'target',
    title: 'Ziel',
    items: [
      { label: t.crews, text: f('Entlarvt alle {imposters}.') },
      { label: t.imposters, text: 'Werdet so viele wie alle anderen zusammen.' },
      ...(jester ? [{ label: jester.name, text: 'will rausgewählt werden.' }] : []),
    ],
  });

  sections.push({
    icon: 'users',
    title: 'In dieser Runde',
    items: [
      t2(`${c.players.length} Spieler · ${count} ${count === '1' ? t.imposter : t.imposters}`),
      ...(specials.length || lovers
        ? [t2(`Mögliche Sonderrollen: ${[...specials.map((r) => r.name), ...(lovers ? [theme.lovers.name] : [])].join(', ')}`)]
        : []),
    ],
  });

  sections.push({
    icon: 'moon',
    title: `Die ${t.night}`,
    items: [
      t2('Licht aus. Alle verteilen sich still im Haus.'),
      ...(c.cooldownOnNightStart ? [t2(`In den ersten ${c.killCooldown} Sekunden darf niemand töten.`)] : []),
    ],
  });

  const kill: RuleItem[] = [
    t2(f('Ein {imposter} tippt 2× auf die Schulter – das ist ein Kill.')),
    t2(`Das Opfer zählt leise von ${c.deathCountdown} runter, legt sich hin und ist still.`),
    t2(`Danach muss der Täter ${c.killCooldown} Sekunden warten.`),
  ];
  if (multi) {
    kill.push(t2(f('{imposters} sind gegeneinander immun: Wird ein {imposter} angetippt, passiert nichts. Kein Zeichen, einfach weiterlaufen. Der Cooldown des Angreifers ist trotzdem verbraucht.')));
    kill.push(t2(c.impostersKnow ? f('Die {imposters} kennen sich von Anfang an.') : f('Die {imposters} kennen sich am Anfang nicht.')));
    if (c.noDoubleKill) kill.push(t2(f(`Kein Doppelkill: Siehst du als {imposter}, wie jemand tötet, wartest du ebenfalls ${c.killCooldown} Sekunden.`)));
  }
  sections.push({ icon: imp.icon, title: 'Töten', items: kill });

  sections.push({
    icon: 'megaphone',
    title: 'Leiche gefunden',
    items: [
      t2(`Laut „${t.call}“ rufen. Licht an, alle kommen zusammen.`),
      t2('Tote bleiben liegen, bis sie gefunden werden – danach schweigen sie.'),
    ],
  });

  if (c.emergencyMeetings > 0) {
    sections.push({
      icon: 'bell',
      title: 'Notfall',
      items: [
        t2(`${c.emergencyMeetings === 1 ? 'Einmal' : `${c.emergencyMeetings}×`} pro Spiel (insgesamt) darf jemand laut „${t.emergencyCall}“ rufen – auch ohne Leiche.`),
        t2(`Dann gibt es sofort eine ${t.meeting}.`),
      ],
    });
  }

  sections.push({
    icon: 'ballot',
    title: t.meeting,
    items: [
      t2(`${c.discussionMinutes} ${c.discussionMinutes === 1 ? 'Minute' : 'Minuten'} diskutieren.`),
      t2('Auf drei zeigen alle gleichzeitig auf eine Person – oder auf den Boden (Enthaltung).'),
      t2('Mehrheit fliegt raus. Gleichstand: niemand.'),
      t2(c.revealOnVoteOut ? 'Die Rolle der Person wird verraten.' : 'Die Rolle der Person bleibt geheim.'),
      t2(`Danach beginnt die nächste ${t.night}.`),
    ],
  });

  if (specials.length) {
    sections.push({
      icon: 'star',
      title: 'Sonderrollen',
      items: specials.map((r) => ({ icon: r.icon, label: r.name, text: `${r.short}${r.id === 'jester' ? ' ' + r.goal : ''}`.trim() })),
    });
  }

  if (lovers) {
    sections.push({
      icon: theme.lovers.icon,
      title: theme.lovers.name,
      items: [
        t2(c.lovers.chance >= 1 ? 'Zwei Spieler sind ein Paar und kennen sich.' : 'Vielleicht sind zwei Spieler ein Paar und kennen sich.'),
        t2('Verteilt euch im Haus – nicht die ganze Zeit zusammen herumlaufen.'),
        t2(`Stirbt einer, stirbt der andere mit: Wird einer nach „${t.call}“ tot gefunden oder rausgewählt, meldet sich der Partner und ist ebenfalls tot.`),
        t2('Ihr gewinnt mit eurem Team. Überlebt ihr beide, gibt es zusätzlich einen Bonus-Sieg.'),
        ...(c.lovers.anyone ? [t2('Ist einer von euch böse, seid ihr ein verbotenes Paar: Ihr gewinnt nur zu zweit – als Letzte übrig.')] : []),
      ],
    });
  }

  sections.push({
    icon: 'lifebuoy',
    title: 'Sicherheit',
    items: [
      t2('Nur Schulter oder Oberarm antippen.'),
      t2('Nicht rennen – Treppen nur gehend.'),
      t2('„Stopp, Licht an!“ beendet sofort alles.'),
    ],
  });

  return { intro: t.intro, sections };
}

/** Reiner Text zum Vorlesen. */
export function ruleCardSpeech(card: { intro: string; sections: RuleSection[] }): string[] {
  const parts = [card.intro];
  for (const s of card.sections) {
    parts.push(`${s.title}.`);
    for (const i of s.items) parts.push(`${i.label ? i.label + ': ' : ''}${i.text}`.replace(/×/g, ' mal ').replace(/–/g, ','));
  }
  return parts;
}

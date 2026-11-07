# Buddy Buddy – Konzept

Live-Deduktionsspiel im dunklen Haus (ähnlich Werwolf / Among Us). Die Website bereitet das Spiel vor und verteilt die Rollen geheim. Das Spiel selbst läuft ohne Handy.

## 1. Ablauf

```
Start → ① Welt (Theme) → ② Spieler → ③ Regeln → Rollen verteilen
      → Verteilung (Handy geht herum) → Regelkarte vorlesen → Spiel → Auflösung / Neue Runde
```

- Jeder Schritt hat sinnvolle Standardwerte. Wer nur Namen eintippt und auf „Weiter“ drückt, bekommt ein ausgewogenes Spiel.
- Der Spielleiter spielt mit. Die App zeigt nie, wer welche Rolle hat. Einzige Ausnahme ist die Auflösung am Ende, die nur durch Gedrückthalten erscheint.
- „Neue Runde“ mischt mit gleichen Spielern und Regeln neu.

## 2. Spielregeln (Kurzfassung)

| | |
|---|---|
| **Kill** | Ein Imposter tippt 2× auf die Schulter. Das Opfer zählt leise herunter (Standard 10 s), legt sich hin und schweigt. |
| **Kill-Cooldown** | Standard 45 s pro Imposter. Er startet zu Beginn jeder Nacht neu, damit sich alle erst verteilen können. |
| **Leichenfund** | „Buddy Buddy!“ rufen → Licht an → Versammlung |
| **Versammlung** | 3 min diskutieren. Auf drei zeigen alle gleichzeitig auf eine Person oder auf den Boden (Enthaltung). Mehrheit fliegt raus, bei Gleichstand niemand. |
| **Notfall-Versammlung** | Jeder darf 1× pro Spiel eine Versammlung einberufen (Option). |
| **Sieg Crew** | Alle Imposter sind entlarvt. |
| **Sieg Imposter** | Die Imposter sind so viele wie alle anderen zusammen. |
| **Sicherheit** | Nur Schulter oder Oberarm antippen, nicht rennen, „Stopp, Licht an!“ beendet sofort alles. |

### Hausgröße (Voreinstellungen)

| | Kill-Cooldown | Countdown Opfer |
|---|---|---|
| Wohnung | 60 s | 5 s |
| Haus (Standard) | 45 s | 10 s |
| Großes Haus | 30 s | 10 s |

In kleinen Räumen findet ein Imposter schnell Opfer, deshalb ist der Cooldown dort länger. In großen Häusern ist das Finden selbst schon die Hürde.

## 3. Imposter untereinander

**Entscheidung:** Imposter **können sich nicht gegenseitig töten**. Standardmäßig **kennen sie sich nicht**.

- Wird ein Imposter angetippt, passiert **nichts**: Er stirbt nicht und gibt auch kein Zeichen. Der Angreifer erfährt es nicht direkt, sondern höchstens indirekt (z. B. weil die Person später noch lebt). Sein Cooldown ist trotzdem verbraucht.
- **Kein Doppelkill (Standard an):** Sieht ein Imposter, wie jemand tötet, muss er ebenfalls den Cooldown abwarten. Damit wird das „Nebeneinander-Laufen mit Doppelkill“ verhindert.
- **Option „Imposter kennen sich“:** klassische Werwolf-Variante. Imposter sehen beim Aufdecken die Namen ihrer Partner.

Gegenseitiges Töten wird **nicht** angeboten. Im Dunkeln erkennt man sein Opfer oft nicht, Team-Kills wären also fast immer Zufall. Bei 2 Impostern halbiert ein einziger Unfall das Team.

## 4. Spielbalance

**Empfohlene Imposter-Anzahl ≈ Spieler ÷ 6** (gerundet, mindestens 1).
Orientierung ist Among Us: mehrere Kills pro Runde, Standard 10 Spieler mit 2 Impostern ≈ 1 : 5. Werwolf-Quoten (1 : 3–1 : 4) passen nicht, weil dort nur ein Kill pro Nacht möglich ist.

| Spieler | Imposter | Zusatzchance |
|---|---|---|
| 4–7 | 1 | – |
| 8 | 1 | +25 % auf einen 2. |
| 9–13 | 2 | – |
| 14 | 2 | +25 % auf einen 3. |
| 15–20 | 3 | 20: +25 % |
| 21–26 | 4 | 26: +25 % |

- **Harte Grenze:** Imposter < ⅓ der Spieler. Darüber ist die Verteilung blockiert, außer man wählt „Trotzdem erlauben“.
- **Warnungen:** mehr Imposter als empfohlen, sehr wenige Imposter, viele Sonderrollen, Rolle unter ihrer Mindest-Spielerzahl, Zusatzchance kann nie greifen.
- **Zusatzchancen** werden erst gewürfelt und danach gegen die Grenzen geprüft. Ein Extra, das eine Grenze verletzen würde, entfällt.
- **Balance-Balken:** Punktesystem nach dem Vorbild von *Ultimate Werewolf*: Crew +1, Imposter −5, Sheriff +3, Ermittler +2, Komplize −3, Narr −1.
- **Anzahl verraten:** Standardmäßig zeigt die Regelkarte nur die Spanne (z. B. „2–3“).

## 5. Rollen

| Rolle | Team | Funktion | Ab |
|---|---|---|---|
| Crew | gut | Imposter finden | – |
| Imposter | böse | Kill durch 2× Antippen, Cooldown | – |
| Sheriff | gut | 1× pro Spiel 3× antippen. Ist das Ziel Imposter, stirbt es, sonst stirbt der Sheriff. | 8 |
| Ermittler | gut | Bekommt beim Aufdecken den Namen einer sicher unschuldigen Person. Im Spiel ist keine Aktion nötig. | 7 |
| Komplize | böse | Kennt die Imposter, kann nicht töten | 10 |
| Narr | neutral | Gewinnt allein, wenn er rausgewählt wird | 9 |
| Eigene Rollen | frei wählbar | Name, Team, Beschreibung, Anzahl, Wahrscheinlichkeit | – |

Alle Sonderrollen sind optional (Schalter). Jede Rolle kann „sicher“ oder mit 50 % / 25 % Wahrscheinlichkeit vorkommen.

**Bewusst weggelassen:** Rollen, die einen Erzähler brauchen (Hexe, Seherin mit Aufwachen), Rollen, die Todeszeitpunkte synchronisieren müssen (Liebespaar, Jäger-Rache), Bekehrungen und Sabotage (Licht aus = Sicherheitsrisiko).

**Ideen für später:** Sanitäter (rettet ein Opfer während des Countdowns), Gepanzerter (überlebt den ersten Kill).

## 6. Themes

| Theme | Genre | Imposter / Crew | Versammlung | Aufdecken |
|---|---|---|---|---|
| Mondnacht | Werwolf | Werwolf / Dorfbewohner | Dorfversammlung | Karte dreht sich |
| Das Dinner | Krimi | Mörder / Gäste | Krisensitzung im Salon | Umschlag mit Wachssiegel |
| Raumstation | Sci-Fi | Imposter / Crewmitglieder | Notfallbesprechung | Terminal entschlüsselt |
| Meuterei | Piraten | Meuterer / Matrosen | Versammlung an Deck | Schriftrolle |
| Zauberschule | Fantasy | Schwarzmagier / Schüler | Ratsversammlung | Karte dreht sich |
| Maulwurf | Agenten | Maulwürfe / Agenten | Lagebesprechung | Akte „Streng geheim“ |
| Spukhaus | Horror | Dämonen / Menschen | Séance | Nebel lichtet sich |

Jedes Theme legt Begriffe, Rollennamen, Icons, Farben, Schrift, Hintergrund-Szene (animiertes SVG), Atmosphäre-Effekt (Nebel, Regen, Funken …) und Aufdeck-Animation fest. Die Bedienung bleibt in allen Themes identisch.

**Ideen für später:** Ausbruch (Zombies), Verrat am Hof (Mittelalter), kinderfreundliches Theme, eigenes Theme mit frei wählbaren Begriffen.

## 7. Geheime Rollenanzeige

1. **Liste:** alle Namen als große Kacheln mit Fortschrittsanzeige („3 / 8“)
2. **Übergabe:** „Gib das Handy an AARON“ → „Ich bin Aaron“. Ein Tippfehler im Namen wird hier bemerkt, bevor eine Rolle sichtbar ist.
3. **Aufdecken:** Die Rolle ist **nur sichtbar, solange die Karte gedrückt gehalten wird**.
4. **„Verstanden – verdecken“** erscheint erst, nachdem die Rolle gesehen wurde.
5. **„Rolle verdeckt – gib das Handy weiter“**, dann zurück zur Liste.

Schutzmaßnahmen:
- **Alle Rollenkarten sehen gleich aus:** gleiche Farbe, Animation und Dauer. So verrät kein roter Lichtschein einen Imposter.
- Der Rolleninhalt steht nur im DOM, solange gedrückt wird.
- Wechselt man die App oder verliert das Fenster den Fokus, wird die Rolle sofort verdeckt.
- Nochmal ansehen geht nur, indem man den eigenen Namen 1,5 s gedrückt hält, plus Warnung „Nur Aaron darf hinschauen!“.
- Während der Verteilung bleibt der Bildschirm an (Wake Lock).
- Wird die Seite neu geladen, geht es an derselben Stelle weiter, ohne neu zu mischen.

## 8. Technik

- **Vite + TypeScript + Svelte 5**, rein statisch, läuft auf GitHub Pages (Workflow in `.github/workflows/deploy.yml`)
- Hash-Routing (`#/spieler`), dadurch kein 404 beim Neuladen auf GitHub Pages
- Zufall über `crypto.getRandomValues` + Fisher-Yates
- Speicher: nur `localStorage`. Kein Server, kein Tracking, keine externen Dienste, Schriften liegen im Projekt selbst.
- Offlinefähig (Service Worker) und installierbar (Web-App-Manifest)
- Tests (Vitest): Verteilung, Anzahlen, Wahrscheinlichkeiten, Gleichverteilung, Grenzen

```
src/
  core/       Spiellogik ohne UI: Rollen, Standardwerte, Balance, Verteilung, Zufall
  lib/        Zustand, Routing, Theme-Texte, Regelkarte
  themes/     ein Ordner pro Theme (index.ts, Scene.svelte, theme.css)
  ui/         Screens, Komponenten, Aufdeck-Karte
```

## 9. Bewusst nicht eingebaut

- Live-Spielsteuerung (Timer, Kill-Erfassung): Das Handy bleibt während des Spiels in der Tasche.
- Abstimmung in der App: Mit dem Finger zeigen macht mehr Spaß.
- Accounts, Online-Räume, Synchronisation zwischen Geräten
- Rollen-Übersicht für den Spielleiter während des Spiels

## 10. Ideen für später

- „Fairer Zufall“: Wer zuletzt Imposter war, wird mit geringerer Wahrscheinlichkeit wieder Imposter.
- Optionaler Nachtstart-Sound mit Countdown zum Verteilen
- Rolle auf dem eigenen Handy ohne Server: QR-Code mit Spielerliste + Zufalls-Seed, jedes Handy berechnet daraus dieselbe Verteilung. Nur für Gruppen, die sich vertrauen.
- Regel-Setup als Link teilen
- Aufgaben-Modus als zweiter Siegweg für die Crew

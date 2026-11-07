# Buddy Buddy

Rollen für ein Live-Deduktionsspiel (à la Werwolf) geheim verteilen – ein Handy wird herumgereicht.
Läuft komplett im Browser, keine Anmeldung, keine Daten verlassen das Gerät.

Konzept, Spielbalance und Architektur: siehe [KONZEPT.md](KONZEPT.md).

## Entwickeln

```bash
npm install
npm run dev      # lokaler Server
npm test         # Tests (Verteilung, Balance)
npm run check    # Typprüfung
npm run build    # statischer Build nach dist/
```

## Veröffentlichen (GitHub Pages)

1. Repo → **Settings → Pages → Source: „GitHub Actions“**
2. Auf `main` pushen – der Workflow `.github/workflows/deploy.yml` testet, baut und veröffentlicht.

## Erweitern

- **Neues Theme:** Ordner in `src/themes/<id>/` mit `index.ts` (Konfiguration), `Scene.svelte` (Hintergrund), `theme.css` (optionale Stil-Details) und in `src/themes/index.ts` eintragen.
- **Neue Rolle:** Eintrag in `src/core/roles.ts`, optional Theme-Namen und Icons unter `roles` im jeweiligen Theme.
- **Neues Icon:** Eintrag in `src/ui/icons/icons.ts` (24×24, Linienstil), danach per Name in Themes und Rollen nutzbar.

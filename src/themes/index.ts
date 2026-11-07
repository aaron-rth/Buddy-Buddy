import type { Theme } from './types';
import mondnacht from './mondnacht';
import dinner from './dinner';
import raumstation from './raumstation';
import meuterei from './meuterei';
import zauberschule from './zauberschule';
import maulwurf from './maulwurf';
import spukhaus from './spukhaus';

/** Neues Theme: Ordner anlegen (index.ts, Scene.svelte, theme.css) und hier eintragen. */
export const THEMES: Theme[] = [mondnacht, dinner, raumstation, meuterei, zauberschule, maulwurf, spukhaus];

export function getTheme(id: string): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

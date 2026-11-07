import type { Component } from 'svelte';

export type Ambient = 'fog' | 'stars' | 'embers' | 'rain' | 'sparkles' | 'dust';
export type RevealStyle = 'card' | 'envelope' | 'terminal' | 'scroll' | 'dossier' | 'mist';

/**
 * Ein Theme = eine Spielwelt. Alles Theme-Spezifische steht hier, nicht im UI-Code.
 * Grammatik-Hinweise:
 *  - imposter: Nominativ Singular, muss nach „ein“ passen („ein Werwolf“)
 *  - imposters/crews: Plural, muss nach „die/alle“ passen
 *  - night/meeting: feminin („die nächste Nacht“, „eine Dorfversammlung“)
 */
export interface Theme {
  id: string;
  name: string;
  genre: string;
  blurb: string;
  terms: {
    imposter: string;
    imposters: string;
    crew: string;
    crews: string;
    night: string;
    meeting: string;
    /** Ruf beim Leichenfund */
    call: string;
    /** Ruf für eine Notfall-Versammlung */
    emergencyCall: string;
    /** Story-Einstieg für die Regelkarte */
    intro: string;
    /** Text auf der verdeckten Karte */
    cover: string;
  };
  /** Rollennamen/Icons je Rollen-ID (crew & imposter kommen aus terms). icon = Name aus src/ui/icons */
  roles: Record<string, { name?: string; icon?: string }>;
  /** Verliebtes Paar: Name, Icon, Satz auf der Karte ({name} = Partner) */
  lovers: { name: string; icon: string; line: string };
  /** Startklang (Web Audio): Grundton in Hz, Wellenform, Akkord in Halbtönen */
  sound: { base: number; wave: OscillatorType; chord: number[] };
  palette: {
    bg: string;
    bg2: string;
    surface: string;
    surface2: string;
    border: string;
    text: string;
    muted: string;
    primary: string;
    onPrimary: string;
    accent: string;
    danger: string;
    warn: string;
    good: string;
  };
  fonts: { display: string; label?: string };
  radius: number;
  ambient: Ambient[];
  reveal: RevealStyle;
  Scene: Component;
}

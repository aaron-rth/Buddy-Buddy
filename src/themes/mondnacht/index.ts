import '@fontsource/cinzel/600.css';
import '@fontsource/cinzel/800.css';
import './theme.css';
import Scene from './Scene.svelte';
import type { Theme } from '../types';

export default {
  id: 'mondnacht',
  name: 'Mondnacht',
  genre: 'Werwolf',
  blurb: 'Ein Rudel lauert mitten im Dorf.',
  terms: {
    imposter: 'Werwolf',
    imposters: 'Werwölfe',
    crew: 'Dorfbewohner',
    crews: 'Dorfbewohner',
    night: 'Nacht',
    meeting: 'Dorfversammlung',
    call: 'Buddy Buddy!',
    emergencyCall: 'Zur Glocke!',
    intro: 'Der Vollmond steigt über das Dorf. Unter euch sind Werwölfe – und sie sehen aus wie Freunde.',
    cover: 'Halte die Karte, um dein Schicksal zu sehen',
  },
  roles: {
    crew: { icon: 'cottage' },
    imposter: { icon: 'wolf' },
    sheriff: { name: 'Jäger', icon: 'bow' },
    detective: { name: 'Seherin', icon: 'orb' },
    accomplice: { name: 'Wolfsjünger', icon: 'paw' },
    jester: { name: 'Dorfnarr', icon: 'jester' },
  },
  lovers: { name: 'Verliebte', icon: 'hearts', line: 'Du bist verliebt in {name}.' },
  sound: { base: 55, wave: 'triangle', chord: [0, 3, 7, 10] },
  palette: {
    bg: '#060a18',
    bg2: '#14224a',
    surface: 'rgba(14, 22, 44, 0.72)',
    surface2: 'rgba(30, 44, 80, 0.78)',
    border: 'rgba(180, 196, 240, 0.18)',
    text: '#eceff8',
    muted: '#9aa6c4',
    primary: '#e6e9f8',
    onPrimary: '#0b1226',
    accent: '#e9b45a',
    danger: '#ff6b6b',
    warn: '#f4c35a',
    good: '#7fd6a6',
  },
  fonts: { display: "'Cinzel', serif" },
  radius: 16,
  ambient: ['fog'],
  reveal: 'card',
  Scene,
} satisfies Theme;

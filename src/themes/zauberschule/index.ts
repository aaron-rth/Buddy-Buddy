import '@fontsource/uncial-antiqua/400.css';
import './theme.css';
import Scene from './Scene.svelte';
import type { Theme } from '../types';

export default {
  id: 'zauberschule',
  name: 'Zauberschule',
  genre: 'Fantasy',
  blurb: 'Dunkle Magie in den Korridoren.',
  terms: {
    imposter: 'Schwarzmagier',
    imposters: 'Schwarzmagier',
    crew: 'Schüler',
    crews: 'Schüler',
    night: 'Nacht',
    meeting: 'Ratsversammlung',
    call: 'Buddy Buddy!',
    emergencyCall: 'Zum Rat!',
    intro: 'Die Kerzen schweben, das Schloss schläft. Doch in den Korridoren sprechen Schwarzmagier ihre Flüche.',
    cover: 'Halte die Karte, um den Zauber zu lösen',
  },
  roles: {
    crew: { icon: 'wand' },
    imposter: { icon: 'hood' },
    sheriff: { name: 'Duellmeisterin', icon: 'bolt' },
    detective: { name: 'Wahrsagerin', icon: 'orb' },
    accomplice: { name: 'Abtrünniger', icon: 'candle' },
    jester: { name: 'Kobold', icon: 'goblin' },
  },
  lovers: { name: 'Seelenbund', icon: 'rings', line: 'Deine Seele ist gebunden an {name}.' },
  sound: { base: 58.3, wave: 'sine', chord: [0, 4, 8, 11] },
  palette: {
    bg: '#0b0516',
    bg2: '#2a1350',
    surface: 'rgba(28, 14, 50, 0.76)',
    surface2: 'rgba(52, 28, 88, 0.8)',
    border: 'rgba(242, 200, 107, 0.3)',
    text: '#f5edff',
    muted: '#b6a6d2',
    primary: '#f2c86b',
    onPrimary: '#23103c',
    accent: '#a77bff',
    danger: '#ff6b8b',
    warn: '#ffd27a',
    good: '#8fe3b9',
  },
  fonts: { display: "'Uncial Antiqua', serif" },
  radius: 20,
  ambient: ['sparkles'],
  reveal: 'card',
  Scene,
} satisfies Theme;

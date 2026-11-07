import '@fontsource/creepster/400.css';
import './theme.css';
import Scene from './Scene.svelte';
import type { Theme } from '../types';

export default {
  id: 'spukhaus',
  name: 'Spukhaus',
  genre: 'Horror',
  blurb: 'Etwas Böses wohnt in diesen Mauern.',
  terms: {
    imposter: 'Dämon',
    imposters: 'Dämonen',
    crew: 'Mensch',
    crews: 'Menschen',
    night: 'Nacht',
    meeting: 'Séance',
    call: 'Buddy Buddy!',
    emergencyCall: 'Geisterstunde!',
    intro: 'Das alte Haus knarzt, die Kerzen flackern. Einige von euch sind nicht mehr allein in ihrem Körper.',
    cover: 'Halte fest, wenn du dich traust',
  },
  roles: {
    crew: { icon: 'candle' },
    imposter: { icon: 'horns' },
    sheriff: { name: 'Exorzistin', icon: 'amulet' },
    detective: { name: 'Medium', icon: 'eye' },
    accomplice: { name: 'Kultist', icon: 'skull' },
    jester: { name: 'Poltergeist', icon: 'ghost' },
  },
  lovers: { name: 'Seelenverwandte', icon: 'flames', line: 'Deine Seele gehört zu {name}.' },
  sound: { base: 36.7, wave: 'sawtooth', chord: [0, 1, 6, 7] },
  palette: {
    bg: '#040705',
    bg2: '#15241b',
    surface: 'rgba(12, 20, 16, 0.82)',
    surface2: 'rgba(26, 40, 32, 0.84)',
    border: 'rgba(166, 243, 181, 0.18)',
    text: '#e4efe6',
    muted: '#8fa597',
    primary: '#a6f3b5',
    onPrimary: '#06120a',
    accent: '#b05cff',
    danger: '#ff5050',
    warn: '#e9d36a',
    good: '#a6f3b5',
  },
  fonts: { display: "'Creepster', cursive" },
  radius: 10,
  ambient: ['fog'],
  reveal: 'mist',
  Scene,
} satisfies Theme;

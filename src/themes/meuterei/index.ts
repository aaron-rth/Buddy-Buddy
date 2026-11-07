import '@fontsource/pirata-one/400.css';
import './theme.css';
import Scene from './Scene.svelte';
import type { Theme } from '../types';

export default {
  id: 'meuterei',
  name: 'Meuterei',
  genre: 'Piraten',
  blurb: 'An Bord gärt die Meuterei.',
  terms: {
    imposter: 'Meuterer',
    imposters: 'Meuterer',
    crew: 'Matrose',
    crews: 'Matrosen',
    night: 'Nacht',
    meeting: 'Versammlung an Deck',
    call: 'Buddy Buddy!',
    intro: 'Mitternacht auf hoher See. Die Laternen schaukeln – und ein paar Matrosen planen die Meuterei.',
    cover: 'Halte die Flaschenpost, um sie zu entrollen',
  },
  roles: {
    crew: { icon: '⚓' },
    imposter: { icon: '🏴‍☠️' },
    sheriff: { name: 'Kapitän', icon: '⚔️' },
    detective: { name: 'Ausguck', icon: '🔭' },
    accomplice: { name: 'Schmuggler', icon: '💰' },
    jester: { name: 'Schiffsnarr', icon: '🦜' },
  },
  palette: {
    bg: '#04121a',
    bg2: '#0e2f3a',
    surface: 'rgba(8, 28, 36, 0.8)',
    surface2: 'rgba(16, 48, 58, 0.82)',
    border: 'rgba(232, 194, 122, 0.3)',
    text: '#f3e8d0',
    muted: '#a9b8b2',
    primary: '#e8c27a',
    onPrimary: '#231507',
    accent: '#4fb3a9',
    danger: '#ee6b55',
    warn: '#f2c66d',
    good: '#7fd3b0',
  },
  fonts: { display: "'Pirata One', serif" },
  radius: 12,
  ambient: ['rain'],
  reveal: 'scroll',
  Scene,
} satisfies Theme;

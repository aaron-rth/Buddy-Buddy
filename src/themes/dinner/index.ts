import '@fontsource/playfair-display/600.css';
import '@fontsource/playfair-display/800-italic.css';
import '@fontsource/playfair-display/800.css';
import './theme.css';
import Scene from './Scene.svelte';
import type { Theme } from '../types';

export default {
  id: 'dinner',
  name: 'Das Dinner',
  genre: 'Krimi',
  blurb: 'Ein Mörder sitzt mit am Tisch.',
  terms: {
    imposter: 'Mörder',
    imposters: 'Mörder',
    crew: 'Gast',
    crews: 'Gäste',
    night: 'Nacht',
    meeting: 'Krisensitzung im Salon',
    call: 'Buddy Buddy!',
    intro: 'Ein altes Anwesen, Kerzenlicht, Champagner. Einer der Gäste ist nicht zum Feiern gekommen.',
    cover: 'Halte den Umschlag, um ihn zu öffnen',
  },
  roles: {
    crew: { icon: '🥂' },
    imposter: { icon: '🗡️' },
    sheriff: { name: 'Kommissar', icon: '🎖️' },
    detective: { name: 'Butler', icon: '🛎️' },
    accomplice: { name: 'Mitwisser', icon: '🤫' },
    jester: { name: 'Hochstapler', icon: '🎭' },
  },
  palette: {
    bg: '#0b0806',
    bg2: '#21170c',
    surface: 'rgba(22, 16, 10, 0.82)',
    surface2: 'rgba(44, 32, 18, 0.85)',
    border: 'rgba(212, 175, 95, 0.38)',
    text: '#f5ead2',
    muted: '#bba983',
    primary: '#d9b464',
    onPrimary: '#1a1208',
    accent: '#a33a3a',
    danger: '#e0675d',
    warn: '#e8c068',
    good: '#9cc98a',
  },
  fonts: { display: "'Playfair Display', serif" },
  radius: 4,
  ambient: ['dust'],
  reveal: 'envelope',
  Scene,
} satisfies Theme;

import '@fontsource/orbitron/600.css';
import '@fontsource/orbitron/800.css';
import '@fontsource/share-tech-mono/400.css';
import './theme.css';
import Scene from './Scene.svelte';
import type { Theme } from '../types';

export default {
  id: 'raumstation',
  name: 'Raumstation',
  genre: 'Sci-Fi',
  blurb: 'Nicht jeder an Bord ist, wer er vorgibt.',
  terms: {
    imposter: 'Imposter',
    imposters: 'Imposter',
    crew: 'Crewmitglied',
    crews: 'Crewmitglieder',
    night: 'Dunkelphase',
    meeting: 'Notfallbesprechung',
    call: 'Buddy Buddy!',
    intro: 'Stromausfall auf Station Kepler-9. Die Notbeleuchtung flackert – und an Bord sind Imposter.',
    cover: 'Halten zum Entschlüsseln',
  },
  roles: {
    crew: { icon: '🧑‍🚀' },
    imposter: { icon: '👾' },
    sheriff: { name: 'Sicherheitschefin', icon: '🛡️' },
    detective: { name: 'Analystin', icon: '📡' },
    accomplice: { name: 'Saboteur', icon: '🔧' },
    jester: { name: 'Glitch', icon: '🤖' },
  },
  palette: {
    bg: '#02040b',
    bg2: '#0a1230',
    surface: 'rgba(6, 14, 34, 0.78)',
    surface2: 'rgba(12, 28, 60, 0.8)',
    border: 'rgba(60, 224, 255, 0.32)',
    text: '#e2f9ff',
    muted: '#86a9ba',
    primary: '#3ce0ff',
    onPrimary: '#021018',
    accent: '#ff3d81',
    danger: '#ff4d6d',
    warn: '#ffd166',
    good: '#4dffb0',
  },
  fonts: { display: "'Orbitron', sans-serif", label: "'Share Tech Mono', monospace" },
  radius: 2,
  ambient: ['stars'],
  reveal: 'terminal',
  Scene,
} satisfies Theme;

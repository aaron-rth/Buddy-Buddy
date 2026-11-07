import '@fontsource/special-elite/400.css';
import './theme.css';
import Scene from './Scene.svelte';
import type { Theme } from '../types';

export default {
  id: 'maulwurf',
  name: 'Maulwurf',
  genre: 'Agenten',
  blurb: 'Das Netzwerk ist unterwandert.',
  terms: {
    imposter: 'Maulwurf',
    imposters: 'Maulwürfe',
    crew: 'Agent',
    crews: 'Agenten',
    night: 'Operation',
    meeting: 'Lagebesprechung',
    call: 'Buddy Buddy!',
    emergencyCall: 'Code Rot!',
    intro: 'Operation Nachtfalke. Das Netzwerk ist kompromittiert – Maulwürfe arbeiten für die Gegenseite.',
    cover: 'Halte die Akte, um sie zu öffnen',
  },
  roles: {
    crew: { icon: 'briefcase' },
    imposter: { icon: 'shades' },
    sheriff: { name: 'Abwehrchefin', icon: 'crosshair' },
    detective: { name: 'Informant', icon: 'folder' },
    accomplice: { name: 'Kontaktmann', icon: 'phone' },
    jester: { name: 'Lockvogel', icon: 'hook' },
  },
  lovers: { name: 'Tandem', icon: 'chain', line: 'Dein Tandem-Partner: {name}.' },
  sound: { base: 46.2, wave: 'square', chord: [0, 1, 6, 10] },
  palette: {
    bg: '#0a0b0d',
    bg2: '#1b1e24',
    surface: 'rgba(20, 22, 26, 0.85)',
    surface2: 'rgba(38, 40, 46, 0.85)',
    border: 'rgba(236, 232, 220, 0.16)',
    text: '#ece8dc',
    muted: '#9d9a90',
    primary: '#ece5d0',
    onPrimary: '#121212',
    accent: '#d63a2f',
    danger: '#e2483c',
    warn: '#e6c06a',
    good: '#9cc7a0',
  },
  fonts: { display: "'Special Elite', monospace" },
  radius: 3,
  ambient: ['rain'],
  reveal: 'dossier',
  Scene,
} satisfies Theme;

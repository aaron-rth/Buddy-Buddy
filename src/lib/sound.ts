/**
 * Klänge werden live per Web Audio erzeugt – keine Sounddateien, offline, lizenzfrei.
 * Alles bewusst leise und kurz.
 */
import type { Theme } from '../themes/types';

let ctx: AudioContext | null = null;

function ac(): AudioContext | null {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function out(c: AudioContext, volume: number): GainNode {
  const g = c.createGain();
  g.gain.value = volume;
  // einfacher Hall über ein Feedback-Delay
  const delay = c.createDelay();
  delay.delayTime.value = 0.23;
  const fb = c.createGain();
  fb.gain.value = 0.32;
  const wet = c.createGain();
  wet.gain.value = 0.35;
  g.connect(c.destination);
  g.connect(delay);
  delay.connect(fb);
  fb.connect(delay);
  delay.connect(wet);
  wet.connect(c.destination);
  return g;
}

function bell(c: AudioContext, dest: AudioNode, freq: number, at: number, len: number, vol: number) {
  // glockenartig: unharmonische Teiltöne mit langem Ausklingen
  for (const [ratio, amp] of [[1, 1], [2.76, 0.4], [5.4, 0.16]] as const) {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sine';
    o.frequency.value = freq * ratio;
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(vol * amp, at + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, at + len / ratio);
    o.connect(g).connect(dest);
    o.start(at);
    o.stop(at + len);
  }
}

/** Mysteriöser Startklang (~3,5 s): anschwellender tiefer Klang + leiser Glockenakkord. */
export function playStart(theme: Theme): void {
  const c = ac();
  if (!c) return;
  const t = c.currentTime + 0.05;
  const master = out(c, 0.22);
  const { base, wave, chord } = theme.sound;

  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(180, t);
  filter.frequency.exponentialRampToValueAtTime(900, t + 1.6);
  filter.frequency.exponentialRampToValueAtTime(200, t + 3.6);
  const pad = c.createGain();
  pad.gain.setValueAtTime(0, t);
  pad.gain.linearRampToValueAtTime(0.5, t + 1.4);
  pad.gain.exponentialRampToValueAtTime(0.0001, t + 3.8);
  filter.connect(pad).connect(master);
  for (const detune of [-8, 0, 7]) {
    for (const mult of [1, 2]) {
      const o = c.createOscillator();
      o.type = wave;
      o.frequency.value = base * mult;
      o.detune.value = detune;
      o.connect(filter);
      o.start(t);
      o.stop(t + 4);
    }
  }
  chord.forEach((semi, i) => bell(c, master, base * 8 * 2 ** (semi / 12), t + 0.9 + i * 0.22, 2.8, 0.18));
}

export function tick(last = false): void {
  const c = ac();
  if (!c) return;
  const t = c.currentTime;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = 'sine';
  o.frequency.value = last ? 660 : 990;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.12, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + 0.1);
}

/** Tiefer Gong: „Licht aus“. */
export function gong(): void {
  const c = ac();
  if (!c) return;
  const t = c.currentTime + 0.02;
  const master = out(c, 0.35);
  bell(c, master, 73.4, t, 6, 0.9);
  bell(c, master, 110, t + 0.01, 4, 0.25);
}

/** Heller, leiser Glockenton. */
export function chime(): void {
  const c = ac();
  if (!c) return;
  const master = out(c, 0.2);
  bell(c, master, 880, c.currentTime + 0.02, 2.5, 0.5);
}

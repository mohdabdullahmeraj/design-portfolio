// Tiny UI sounds, generated in code with the Web Audio API (no audio files).
// On by default (like davemiye.com); browsers only let audio start after the visitor's first
// click / key press, so nothing plays before that. "Sound off" in the header saves "off".
let ctx = null;
let out = null;
const last = new Map();
const listeners = new Set();

export function soundEnabled() {
  try { return localStorage.getItem("am:sound") !== "off"; } catch { return true; }
}
export function setSoundEnabled(on) {
  try { localStorage.setItem("am:sound", on ? "on" : "off"); } catch {}
  listeners.forEach((fn) => fn(on));
}
export function onSoundChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

const activated = () => navigator.userActivation?.hasBeenActive ?? true;

// call from any user gesture so the audio engine is awake before the first sound
export function unlock() {
  if (typeof window === "undefined" || !soundEnabled()) return;
  try { ctx ??= new AudioContext(); if (ctx.state !== "running") ctx.resume(); } catch {}
}

function setup() {
  if (typeof window === "undefined" || !soundEnabled() || !activated()) return null;
  try { ctx ??= new AudioContext(); } catch { return null; }
  if (ctx.state !== "running") ctx.resume();
  if (!out) {
    const gain = ctx.createGain();
    gain.gain.value = 0.9;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.knee.value = 12; comp.ratio.value = 3;
    comp.attack.value = 0.002; comp.release.value = 0.12;
    gain.connect(comp).connect(ctx.destination);
    out = gain;
  }
  return { ctx, out, now: ctx.currentTime };
}

function noiseBuffer(c, length) {
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * length), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

// filtered noise burst; `sweep` = [from, to] moves the filter over the sound's length
function noise({ ctx: c, out: o, now }, { length, type, frequency, sweep, q = 0.8, level, at = 0, attack = 0 }) {
  const t = now + at;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, length);
  const f = c.createBiquadFilter();
  f.type = type; f.Q.value = q;
  if (sweep) { f.frequency.setValueAtTime(sweep[0], t); f.frequency.exponentialRampToValueAtTime(sweep[1], t + length); }
  else f.frequency.value = frequency;
  const g = c.createGain();
  if (attack) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(level, t + attack); }
  else g.gain.setValueAtTime(level, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + length);
  src.connect(f).connect(g).connect(o);
  src.start(t); src.stop(t + length);
}

// short sine/triangle tone with a soft attack; `to` glides the pitch
function tone({ ctx: c, out: o, now }, { freq, to, length, level, at = 0, type = "sine", attack = 0.003 }) {
  const t = now + at;
  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + length);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(level, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + length);
  osc.connect(g).connect(o);
  osc.start(t); osc.stop(t + length + 0.02);
}

const recipes = {
  // soft mouse-press: a papery tap with a little body under it
  click: (a) => {
    noise(a, { length: 0.024, type: "bandpass", frequency: 2300, q: 1, level: 0.15 });
    tone(a, { freq: 175, length: 0.05, level: 0.045 });
    tone(a, { freq: 1350, length: 0.028, level: 0.01 });
  },
  // tiny detent, like a dial notch (rail, dial, sections, hover between cards)
  tick: (a) => {
    noise(a, { length: 0.01, type: "highpass", frequency: 3600, q: 0.7, level: 0.085 });
    tone(a, { freq: 2050, length: 0.018, level: 0.011, attack: 0.002 });
  },
  // chat bubble arriving: a rounded "bloop" that rises
  pop: (a) => {
    tone(a, { freq: 320, to: 470, length: 0.22, level: 0.11, attack: 0.012 });
    tone(a, { freq: 640, to: 940, length: 0.12, level: 0.015, attack: 0.01 });
  },
  // new page: a paper flip and a soft landing
  page: (a) => {
    noise(a, { length: 0.26, type: "bandpass", sweep: [1800, 620], q: 0.7, level: 0.06, attack: 0.07 });
    noise(a, { length: 0.03, type: "lowpass", frequency: 1400, level: 0.07, at: 0.2 });
    tone(a, { freq: 150, length: 0.05, level: 0.03, at: 0.2 });
  },
  // switches (theme, sound): two quick notes
  toggle: (a) => {
    tone(a, { freq: 660, length: 0.06, level: 0.06, type: "triangle" });
    tone(a, { freq: 990, length: 0.08, level: 0.05, at: 0.055, type: "triangle" });
  },
};

const fine = () => typeof window !== "undefined" && matchMedia("(pointer: fine)").matches;

export function play(name, minGap = 40) {
  const now = performance.now();
  if (now - (last.get(name) ?? -Infinity) < minGap) return;
  last.set(name, now);
  // on phones the detent is a tiny buzz instead of a sound
  if (name === "tick" && !fine()) {
    if (soundEnabled() && activated()) navigator.vibrate?.(6);
    return;
  }
  const a = setup();
  if (a) recipes[name]?.(a);
}

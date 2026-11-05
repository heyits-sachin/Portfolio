// Web Audio API + Physical PCM Glass Shatter Sound Engine
// Synthesizes a 44.1kHz stereo physical-modeling glass fracture & shard cascade buffer
// (zero synth pitch-sweeps; uses real Chladni plate inharmonic modes, silica crack transients,
// Poisson shard collisions, and stereo early reflections) + WAV Audio fallback.

interface ShardEvent {
  timeSec: number;
  baseFreq: number;
  amp: number;
  decaySec: number;
  pan: number;
  isMicro: boolean;
}

function encodeStereoWavDataUri(
  left: Float32Array,
  right: Float32Array,
  sampleRate: number
): string {
  const numSamples = left.length;
  const numChannels = 2;
  const bytesPerSample = 2;
  const dataSize = numSamples * numChannels * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true);
  view.setUint16(32, numChannels * bytesPerSample, true);
  view.setUint16(34, 16, true); // 16-bit
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const l = Math.max(-1, Math.min(1, left[i]));
    const r = Math.max(-1, Math.min(1, right[i]));
    view.setInt16(offset, l < 0 ? l * 0x8000 : l * 0x7fff, true);
    view.setInt16(offset + 2, r < 0 ? r * 0x8000 : r * 0x7fff, true);
    offset += 4;
  }

  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return `data:audio/wav;base64,${btoa(binary)}`;
}

/**
 * Generates a realistic 1.35-second stereo PCM glass shattering recording:
 * 1. Initial silica stress-fracture snaps (0 - 28ms) + low-end pane impact thump
 * 2. broadband brittle glass burst with high-frequency air
 * 3. 32 heavy glass plate shards + 68 tinkling micro-shards with fixed Chladni
 *    inharmonic plate modes (no synth pitch slides!) and crisp contact clicks
 * 4. Multi-tap stereo room reflections
 */
function synthesizeRealisticGlassShatterPCM(sampleRate = 44100): {
  left: Float32Array;
  right: Float32Array;
} {
  const durationSec = 1.35;
  const totalSamples = Math.floor(sampleRate * durationSec);
  const left = new Float32Array(totalSamples);
  const right = new Float32Array(totalSamples);

  // Deterministic PRNG so the glass crash is consistently crisp and rich
  let seed = 133742;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };

  // 1. Primary Stress-Fracture Branching Cracks (0 - 30ms)
  const crackTimes = [0.0, 0.0018, 0.0046, 0.0082, 0.0128, 0.0175, 0.0235];
  for (let c = 0; c < crackTimes.length; c++) {
    const startIdx = Math.floor(crackTimes[c] * sampleRate);
    const burstLen = Math.floor(0.011 * sampleRate);
    const pan = (rand() - 0.5) * 0.5;
    const gainL = Math.cos(((pan + 1) * Math.PI) / 4);
    const gainR = Math.sin(((pan + 1) * Math.PI) / 4);

    let prev = 0;
    for (let i = 0; i < burstLen && startIdx + i < totalSamples; i++) {
      const env = Math.exp(-i / (burstLen * 0.22)) * (1 - c * 0.07);
      // Differentiated white noise for sharp high-frequency brittle snap
      const white = rand() * 2 - 1;
      const hp = white - prev * 0.72;
      prev = white;

      // Add high-tension glass body resonance during initial crack
      const t = i / sampleRate;
      const bodyCrack =
        Math.sin(2 * Math.PI * 2840 * t) * 0.35 +
        Math.sin(2 * Math.PI * 5920 * t) * 0.3 +
        Math.sin(2 * Math.PI * 9140 * t) * 0.2;

      const sample = (hp * 0.68 + bodyCrack) * env * 0.55;
      left[startIdx + i] += sample * gainL;
      right[startIdx + i] += sample * gainR;
    }
  }

  // Subtle physical impact thump at t=0 (125Hz -> 52Hz over 24ms) so the break has real weight
  const thumpSamples = Math.floor(0.026 * sampleRate);
  for (let i = 0; i < thumpSamples; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t / 0.0075);
    const thump = Math.sin(2 * Math.PI * (125 - t * 2200) * t) * env * 0.38;
    left[i] += thump;
    right[i] += thump;
  }

  // 2. Build schedule of 32 primary glass chunks + 68 tinkling floor/air shard collisions
  const shardEvents: ShardEvent[] = [];

  // 32 Primary exploding glass chunks (0.003s to 0.32s)
  for (let i = 0; i < 32; i++) {
    const u = i / 32;
    const timeSec = 0.003 + Math.pow(u, 1.35) * 0.28 + rand() * 0.018;
    const baseFreq = 1650 + rand() * 2950; // 1.65kHz - 4.6kHz fundamental plate mode
    const amp = (0.24 - u * 0.11) * (0.75 + rand() * 0.5);
    const decaySec = 0.032 + rand() * 0.075;
    const pan = (rand() * 2 - 1) * 0.85;
    shardEvents.push({ timeSec, baseFreq, amp, decaySec, pan, isMicro: false });
  }

  // 68 High-frequency crystalline micro-shards & secondary bounces (0.015s to 1.15s)
  for (let i = 0; i < 68; i++) {
    const u = i / 68;
    const timeSec = 0.012 + Math.pow(u, 1.85) * 1.08 + rand() * 0.035;
    const baseFreq = 3400 + rand() * 5800; // 3.4kHz - 9.2kHz crisp glass tinkle
    const amp = (0.16 * Math.pow(1 - u, 1.25) + 0.025) * (0.6 + rand() * 0.7);
    const decaySec = 0.014 + rand() * 0.042;
    const pan = (rand() * 2 - 1) * 0.92;
    shardEvents.push({ timeSec, baseFreq, amp, decaySec, pan, isMicro: true });
  }

  // Inharmonic Chladni modal ratios for stiff glass triangles/plates
  const modalRatios = [1.0, 1.58, 2.31, 3.14, 3.89];
  const modalWeights = [0.42, 0.26, 0.17, 0.1, 0.05];

  for (const ev of shardEvents) {
    const startSample = Math.floor(ev.timeSec * sampleRate);
    const durSamples = Math.min(
      totalSamples - startSample,
      Math.floor(ev.decaySec * 4.5 * sampleRate)
    );
    if (durSamples <= 0) continue;

    const gainL = Math.cos(((ev.pan + 1) * Math.PI) / 4);
    const gainR = Math.sin(((ev.pan + 1) * Math.PI) / 4);

    const w0 = (2 * Math.PI * ev.baseFreq) / sampleRate;
    const w1 = w0 * modalRatios[1];
    const w2 = w0 * modalRatios[2];
    const w3 = w0 * modalRatios[3];
    const w4 = w0 * modalRatios[4];

    // Precompute upper Nyquist safety
    const useM2 = ev.baseFreq * modalRatios[2] < sampleRate * 0.45;
    const useM3 = ev.baseFreq * modalRatios[3] < sampleRate * 0.45;
    const useM4 = ev.baseFreq * modalRatios[4] < sampleRate * 0.45;

    const p0 = rand() * Math.PI * 2;
    const p1 = rand() * Math.PI * 2;
    const p2 = rand() * Math.PI * 2;
    const p3 = rand() * Math.PI * 2;

    const tauSamples = ev.decaySec * sampleRate;
    const clickSamples = Math.floor(0.0024 * sampleRate);
    let prevNoise = 0;

    for (let i = 0; i < durSamples; i++) {
      // Fast attack (0.4ms) + exponential modal decay ( higher modes decay faster like real glass )
      const attack = i < 18 ? i / 18 : 1.0;
      const env0 = attack * Math.exp(-i / tauSamples);
      const envFast = attack * Math.exp(-i / (tauSamples * 0.48));

      let modalSum =
        Math.sin(w0 * i + p0) * modalWeights[0] * env0 +
        Math.sin(w1 * i + p1) * modalWeights[1] * env0;

      if (useM2) {
        modalSum += Math.sin(w2 * i + p2) * modalWeights[2] * envFast;
      }
      if (useM3 && !ev.isMicro) {
        modalSum += Math.sin(w3 * i + p3) * modalWeights[3] * envFast;
      }
      if (useM4 && !ev.isMicro) {
        modalSum += Math.sin(w4 * i) * modalWeights[4] * envFast;
      }

      // Sharp brittle edge-collision click in the first 2.4ms of each shard impact
      let click = 0;
      if (i < clickSamples) {
        const n = rand() * 2 - 1;
        const hp = n - prevNoise * 0.82;
        prevNoise = n;
        click = hp * (1 - i / clickSamples) * (ev.isMicro ? 0.55 : 0.75);
      }

      const out = (modalSum + click) * ev.amp;
      left[startSample + i] += out * gainL;
      right[startSample + i] += out * gainR;
    }
  }

  // 3. Add Stereo Early Reflections (simulating hard floor/room acoustics) & soft limiter
  const taps = [
    { delayMs: 11.3, gain: 0.22, swapStereo: true },
    { delayMs: 21.7, gain: 0.15, swapStereo: false },
    { delayMs: 36.4, gain: 0.09, swapStereo: true },
  ];

  for (const tap of taps) {
    const dSamples = Math.floor((tap.delayMs / 1000) * sampleRate);
    for (let i = totalSamples - 1; i >= dSamples; i--) {
      if (tap.swapStereo) {
        left[i] += right[i - dSamples] * tap.gain;
        right[i] += left[i - dSamples] * tap.gain;
      } else {
        left[i] += left[i - dSamples] * tap.gain;
        right[i] += right[i - dSamples] * tap.gain;
      }
    }
  }

  // Normalize & soft-clip so the glass shatter is punchy, loud, and distortion-free
  let peak = 0.01;
  for (let i = 0; i < totalSamples; i++) {
    const al = Math.abs(left[i]);
    const ar = Math.abs(right[i]);
    if (al > peak) peak = al;
    if (ar > peak) peak = ar;
  }
  const normGain = 0.94 / peak;
  for (let i = 0; i < totalSamples; i++) {
    left[i] = Math.tanh(left[i] * normGain * 1.15);
    right[i] = Math.tanh(right[i] * normGain * 1.15);
  }

  return { left, right };
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;
  private ambientGain: GainNode | null = null;
  private ambientOscs: OscillatorNode[] = [];
  private ambientFilter: BiquadFilterNode | null = null;
  private lastHoverTime: number = 0;
  private lastShatterTime: number = 0;
  private shatterCount: number = 0;
  private listeners: Set<(enabled: boolean) => void> = new Set();

  // Pre-synthesized realistic glass shatter PCM + AudioBuffer + WAV fallback
  private shatterPCM: { left: Float32Array; right: Float32Array } | null = null;
  private shatterBuffer: AudioBuffer | null = null;
  private shatterWavUri: string | null = null;
  private pendingShatterOnUnlock: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // Pre-compute the realistic stereo glass shatter waveform once at startup
      try {
        this.shatterPCM = synthesizeRealisticGlassShatterPCM(44100);
        this.shatterWavUri = encodeStereoWavDataUri(
          this.shatterPCM.left,
          this.shatterPCM.right,
          44100
        );
      } catch {
        // Ignore if environment lacks btoa/DataView
      }

      const unlockAudio = () => {
        this.initContext();
        if (this.isEnabled && this.ctx && this.ctx.state === 'running') {
          if (!this.ambientGain) {
            this.startAmbientPad();
          }
          if (this.pendingShatterOnUnlock) {
            this.pendingShatterOnUnlock = false;
            this.triggerWebAudioShatterBuffer();
          }
        }
      };
      window.addEventListener('pointerdown', unlockAudio, { passive: true });
      window.addEventListener('mousedown', unlockAudio, { passive: true });
      window.addEventListener('click', unlockAudio, { passive: true });
      window.addEventListener('pointermove', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio, { passive: true });
      window.addEventListener('touchstart', unlockAudio, { passive: true });
      window.addEventListener('wheel', unlockAudio, { passive: true });
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && !this.shatterBuffer && this.shatterPCM) {
      try {
        const buf = this.ctx.createBuffer(2, this.shatterPCM.left.length, 44100);
        buf.getChannelData(0).set(this.shatterPCM.left);
        buf.getChannelData(1).set(this.shatterPCM.right);
        this.shatterBuffer = buf;
      } catch {
        // ignore
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx
        .resume()
        .then(() => {
          if (this.pendingShatterOnUnlock && this.isEnabled) {
            this.pendingShatterOnUnlock = false;
            this.triggerWebAudioShatterBuffer();
          }
        })
        .catch(() => {});
    }
  }

  public subscribe(listener: (enabled: boolean) => void): () => void {
    this.listeners.add(listener);
    listener(this.isEnabled);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isEnabled));
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  public getShatterCount(): number {
    return this.shatterCount;
  }

  public toggle(): boolean {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
    return this.isEnabled;
  }

  public enable() {
    this.initContext();
    this.isEnabled = true;
    if (this.ctx) {
      this.startAmbientPad();
      this.playEnterChord();
    }
    this.notify();
  }

  public disable() {
    this.isEnabled = false;
    this.pendingShatterOnUnlock = false;
    this.stopAmbientPad();
    this.notify();
  }

  private startAmbientPad() {
    if (!this.ctx || this.ambientGain) return;
    try {
      const now = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.014, now + 2.0);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);
      filter.Q.setValueAtTime(2.5, now);

      filter.connect(masterGain);
      masterGain.connect(this.ctx.destination);

      const freqs = [130.81, 196.0, 246.94, 293.66];
      const oscs: OscillatorNode[] = [];

      freqs.forEach((f, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, now);
        osc.detune.setValueAtTime((idx - 1.5) * 4, now);
        osc.connect(filter);
        osc.start(now);
        oscs.push(osc);
      });

      this.ambientGain = masterGain;
      this.ambientFilter = filter;
      this.ambientOscs = oscs;
    } catch {
      // Ignore audio context restrictions
    }
  }

  private stopAmbientPad() {
    if (!this.ctx || !this.ambientGain) return;
    try {
      const now = this.ctx.currentTime;
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      const oscsToStop = [...this.ambientOscs];
      setTimeout(() => {
        oscsToStop.forEach((o) => {
          try {
            o.stop();
            o.disconnect();
          } catch {
            // ignore
          }
        });
      }, 450);
    } catch {
      // ignore
    }
    this.ambientGain = null;
    this.ambientFilter = null;
    this.ambientOscs = [];
  }

  public playHover() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;
    const nowMs = performance.now();
    if (nowMs - this.lastHoverTime < 65) return;
    this.lastHoverTime = nowMs;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const baseFreq = 780 + Math.random() * 140;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, now + 0.045);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.02, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // ignore
    }
  }

  public playClick() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.028);

        gain.gain.setValueAtTime(0.001, now + i * 0.028);
        gain.gain.linearRampToValueAtTime(0.03, now + i * 0.028 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.028 + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.028);
        osc.stop(now + i * 0.028 + 0.2);
      });
    } catch {
      // ignore
    }
  }

  public playEnterChord() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const chord = [261.63, 329.63, 392.0, 493.88, 587.33];
      chord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.025, now + idx * 0.05 + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 1.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 1.45);
      });
    } catch {
      // ignore
    }
  }

  private triggerWebAudioShatterBuffer(): boolean {
    if (!this.ctx || !this.shatterBuffer) return false;
    try {
      const source = this.ctx.createBufferSource();
      source.buffer = this.shatterBuffer;
      // Slight organic pitch variation (0.96 - 1.04) on each shatter
      source.playbackRate.value = 0.96 + Math.random() * 0.08;

      const masterGain = this.ctx.createGain();
      masterGain.gain.value = 0.92;

      source.connect(masterGain);
      masterGain.connect(this.ctx.destination);
      source.start(0);
      return true;
    } catch {
      return false;
    }
  }

  // Plays the realistic 44.1kHz stereo physical-modeling glass shattering sound
  public playGlassShatter() {
    if (!this.isEnabled) return;
    const nowMs = performance.now();
    if (nowMs - this.lastShatterTime < 280) return;
    this.lastShatterTime = nowMs;
    this.shatterCount += 1;

    this.initContext();

    if (this.ctx && this.ctx.state === 'running') {
      this.pendingShatterOnUnlock = false;
      this.triggerWebAudioShatterBuffer();
      return;
    }

    // If AudioContext is still suspended (e.g., pure mouse hover before any click),
    // try HTMLAudioElement WAV playback AND queue immediate playback when context resumes.
    this.pendingShatterOnUnlock = true;
    if (this.shatterWavUri && typeof Audio !== 'undefined') {
      try {
        const audio = new Audio(this.shatterWavUri);
        audio.volume = 0.88;
        audio
          .play()
          .then(() => {
            this.pendingShatterOnUnlock = false;
          })
          .catch(() => {
            // Browser blocked un-gestured autoplay; pendingShatterOnUnlock will fire on gesture
          });
      } catch {
        // ignore
      }
    }
  }

  // Shimmering reverse-time crystalline chime when the Glass Stone reassembles
  public playGlassRecover() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const healFreqs = [783.99, 1046.5, 1318.51, 1567.98, 2093.0, 2637.02];
      healFreqs.forEach((freq, i) => {
        if (!this.ctx) return;
        const delay = i * 0.032;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);

        gain.gain.setValueAtTime(0.0005, now + delay);
        gain.gain.linearRampToValueAtTime(0.024, now + delay + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.32);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.34);
      });
    } catch {
      // ignore
    }
  }

  public modulateScrollDepth(velocity: number) {
    if (!this.isEnabled || !this.ctx || !this.ambientFilter) return;
    try {
      const clamped = Math.min(Math.abs(velocity), 2000);
      const targetFreq = 320 + (clamped / 2000) * 650;
      this.ambientFilter.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.15);
    } catch {
      // ignore
    }
  }
}

export const soundEngine = new SoundEngine();

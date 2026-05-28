/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

let audioCtx: AudioContext | null = null;
let sfxEnabled = true;

export function setSfxEnabled(enabled: boolean) {
  sfxEnabled = enabled;
}

export function isSfxEnabled(): boolean {
  return sfxEnabled;
}

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Snappy click pop effect
 */
export function playClickSfx() {
  if (!sfxEnabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    console.warn('Audio click failed to play', e);
  }
}

/**
 * Energetic, bouncy tab transition sound
 */
export function playTabSfx() {
  if (!sfxEnabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(640, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    console.warn('Audio tab transition failed to play', e);
  }
}

/**
 * Toggle custom setting double beep
 */
export function playToggleSfx() {
  if (!sfxEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // First beep
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(580, now);
    gain1.gain.setValueAtTime(0.06, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.08);

    // Second beep slightly offset
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.07);
    gain2.gain.setValueAtTime(0.06, now + 0.07);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.07);
    osc2.stop(now + 0.18);
  } catch (e) {
    console.warn('Audio toggle failed to play', e);
  }
}

/**
 * Satisfying checklist click rising chord
 */
export function playChecklistSfx() {
  if (!sfxEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Bright and happy C Major chord!)
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const delay = idx * 0.04;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gain.gain.setValueAtTime(0.04, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.3);
    });
  } catch (e) {
    console.warn('Audio checklist failed to play', e);
  }
}

/**
 * Classic alarm ring structure
 */
export function playAlarmSfx() {
  if (!sfxEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Play multiple pulses to make it sound like an actual cafe bell or digital alarm
    for (let i = 0; i < 3; i++) {
      const pulseDelay = i * 0.35;
      
      const osc = ctx.createOscillator();
      const biquad = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now + pulseDelay);
      osc.frequency.setValueAtTime(660, now + pulseDelay + 0.1);

      biquad.type = 'lowpass';
      biquad.frequency.setValueAtTime(1200, now + pulseDelay);

      gain.gain.setValueAtTime(0.08, now + pulseDelay);
      gain.gain.linearRampToValueAtTime(0.06, now + pulseDelay + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + pulseDelay + 0.3);

      osc.connect(biquad);
      biquad.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + pulseDelay);
      osc.stop(now + pulseDelay + 0.3);
    }
  } catch (e) {
    console.warn('Audio alarm failed to play', e);
  }
}

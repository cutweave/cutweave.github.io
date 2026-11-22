// SPDX-License-Identifier: GPL-3.0-or-later
// Deterministic waveform path for the demo timelines. Pure function of its inputs (no Math.random),
// so builds are reproducible. The path is drawn in a 1000 x 100 box: one vertical stroke per bar.

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * @param seed     any integer; same seed, same wave
 * @param bars     number of vertical strokes across the 1000-unit width
 * @param gain     optional amplitude multiplier at x in 0..1 (use it to flatten silences)
 */
export function wavePath(seed: number, bars: number, gain: (x: number) => number = () => 1): string {
  const rnd = mulberry32(seed);
  const step = 1000 / bars;
  let d = '';
  for (let i = 0; i < bars; i++) {
    const x = (i + 0.5) * step;
    const phrase = 0.45 + 0.55 * Math.abs(Math.sin(i * 0.11 + seed) * Math.sin(i * 0.037 + seed * 2));
    const amp = Math.min(1, phrase * (0.55 + 0.45 * rnd()) * gain(x / 1000));
    const half = Math.max(0.8, amp * 46);
    d += `M${x.toFixed(1)} ${(50 - half).toFixed(1)}V${(50 + half).toFixed(1)}`;
  }
  return d;
}

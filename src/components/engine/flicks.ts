// SPDX-License-Identifier: GPL-3.0-or-later
// Flicks arithmetic for the FlicksExplainer. Used at build time (static table) and in the browser
// (interactive readout), so every number on the page is computed, never typed in.
// Source: docs/01-architecture.md §4.1, ADR-0004. 1 flick = 1/705,600,000 s.

export const FLICKS_PER_SECOND = 705_600_000;

export interface Rate {
  id: string;
  /** Label shown in the picker, such as "29.97 fps". */
  label: string;
  kind: 'video' | 'audio';
  /** The rate as an exact fraction, numerator over denominator, in units per second. */
  num: number;
  den: number;
}

export const RATES: Rate[] = [
  { id: 'v23976', label: '23.976 fps', kind: 'video', num: 24000, den: 1001 },
  { id: 'v24', label: '24 fps', kind: 'video', num: 24, den: 1 },
  { id: 'v25', label: '25 fps', kind: 'video', num: 25, den: 1 },
  { id: 'v2997', label: '29.97 fps', kind: 'video', num: 30000, den: 1001 },
  { id: 'v30', label: '30 fps', kind: 'video', num: 30, den: 1 },
  { id: 'v50', label: '50 fps', kind: 'video', num: 50, den: 1 },
  { id: 'v5994', label: '59.94 fps', kind: 'video', num: 60000, den: 1001 },
  { id: 'v60', label: '60 fps', kind: 'video', num: 60, den: 1 },
  { id: 'v120', label: '120 fps', kind: 'video', num: 120, den: 1 },
  { id: 'a441', label: '44.1 kHz', kind: 'audio', num: 44100, den: 1 },
  { id: 'a48', label: '48 kHz', kind: 'audio', num: 48000, den: 1 },
  { id: 'a96', label: '96 kHz', kind: 'audio', num: 96000, den: 1 },
];

export interface FlicksResult {
  /** Flicks in one frame or sample, when the division is exact. */
  flicks: number;
  /** Remainder of FLICKS_PER_SECOND * den / num. Zero means the rate divides a flick count exactly. */
  remainder: number;
}

/** Flicks per frame or sample: FLICKS_PER_SECOND * den / num, in integer arithmetic. */
export function flicksPerUnit(rate: Rate): FlicksResult {
  const top = FLICKS_PER_SECOND * rate.den; // at most about 7e11: exact in a double
  return { flicks: Math.floor(top / rate.num), remainder: top % rate.num };
}

export interface DriftResult {
  units: number;
  /** Position after `units` frames or samples, in integer flicks: exact. */
  exactFlicks: number;
  /** Position after adding the unit duration as float64 seconds `units` times, converted to flicks. */
  floatFlicks: number;
  /** floatFlicks - exactFlicks. */
  errorFlicks: number;
}

/** Adds one unit duration in float64 seconds, `units` times, and compares with integer flicks. */
export function drift(rate: Rate, seconds: number): DriftResult {
  const units = Math.floor((seconds * rate.num) / rate.den);
  const { flicks } = flicksPerUnit(rate);
  const dt = rate.den / rate.num;
  let t = 0;
  for (let i = 0; i < units; i++) t += dt;
  const exactFlicks = units * flicks;
  const floatFlicks = Math.round(t * FLICKS_PER_SECOND);
  return { units, exactFlicks, floatFlicks, errorFlicks: floatFlicks - exactFlicks };
}

export const nf = new Intl.NumberFormat('en-US');
export const fmt = (n: number): string => nf.format(n);

/** "24,000/1,001" or "24". */
export function fraction(rate: Rate): string {
  return rate.den === 1 ? fmt(rate.num) : `${fmt(rate.num)}/${fmt(rate.den)}`;
}

export const unitWord = (rate: Rate): 'frame' | 'sample' => (rate.kind === 'video' ? 'frame' : 'sample');

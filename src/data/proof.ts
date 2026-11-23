// SPDX-License-Identifier: GPL-3.0-or-later
// Measured results, in two groups with two honesty labels.
//   Spikes (Phase 0 prototypes): docs/content-inventory.md section 9 "Benchmark numbers from spikes" (M0 and each
//   spike README). Label "Measured in a spike", one Windows laptop.
//   Work packages (the real code, since Phase 0): docs/content-inventory.md section 9 "Numbers measured in
//   work-package tests". Label "Measured in a work package test", one dev machine. Sources are merge and commit
//   messages in the product repo; each item carries its WP id.
// GAP-09: all of these are informal. Formal runs on reference hardware (issue #45) and on macOS and Linux are
// pending. Replace with the budget dashboard when WP-7D lands.

export interface ProofItem {
  id: string;
  /** The big number, as text. */
  value: string;
  /** Short unit or qualifier shown beside the number. */
  unit?: string;
  /** What was measured. */
  label: string;
  /** One line on what it means. */
  meaning: string;
  /** Work package, for numbers measured in the real code. */
  source?: string;
  /** Included in the short landing-page variant of its group. */
  featured?: boolean;
}

/** Phase 0 spikes. Throwaway prototypes, not product code. */
export const PROOF: ProofItem[] = [
  { id: 'scrub', value: '49.5', unit: 'ms', label: 'Scrub, p95', featured: true,
    meaning: 'From scrub to pixel on the preview path, against an 80 ms budget.' },
  { id: 'clips', value: '5,000', unit: 'clips', label: 'Timeline at 60 fps', featured: true,
    meaning: 'A Canvas2D timeline stays smooth with 5,000 clips and hit-tests in under 0.1 ms.' },
  { id: 'audio', value: '0', unit: 'underruns', label: 'Audio, 10-minute soak',
    meaning: 'No dropped audio and no real-time allocations, with drift of +11 ppm.' },
  { id: 'sandbox', value: '35/35', label: 'Sandbox escapes contained', featured: true,
    meaning: 'Compositions run in a sandbox, and every attempt to break out was stopped.' },
  { id: 'agent', value: '3/3', label: 'Agent runs, no screenshots', featured: true,
    meaning: 'Claude Code imported, cut and rendered a frame over MCP, three times out of three.' },
  { id: 'gpu', value: '≤ 1', unit: 'code value', label: 'Difference between GPU vendors',
    meaning: 'The same frame on NVIDIA and AMD differs by at most one code value.' },
];

/** The real code, measured in work-package tests since Phase 0. */
export const PROOF_WP: ProofItem[] = [
  { id: 'rtt', value: '26', unit: 'µs', label: 'No-op command, p95', source: 'WP-1B.03', featured: true,
    meaning: 'A do-nothing command through the single-writer document actor. The budget for a full edit round trip is 16 ms.' },
  { id: 'rpc', value: '0.81', unit: 'ms', label: 'Edit over WebSocket, p95', source: 'WP-1I.02',
    meaning: 'A clip.trim and its change event on a 400-item project with a journal, in a debug build on a loaded machine. Budget 16 ms.' },
  { id: 'kill', value: '20', unit: 'random kills', label: 'Crash recovery', source: 'WP-1C.02', featured: true,
    meaning: 'A 500-operation session was killed at 20 random points. Each time, recovery matched the uninterrupted run.' },
  { id: 'audio-wp', value: '0', unit: 'underruns', label: 'Real audio device, 10 minutes', source: 'WP-1G.02', featured: true,
    meaning: 'An eight-source mix through WASAPI: no xruns, no heap use in the callback, and a clock that never went backwards.' },
  { id: 'frame', value: '8.2–8.6', unit: 'ms', label: 'Frame for an agent, p50', source: 'WP-1F.03', featured: true,
    meaning: 'A 1080p frame rendered, read back and encoded to a 768 px JPEG on an RTX 3080 laptop GPU. Budget 150 ms.' },
  { id: 'present', value: '60', unit: 'fps', label: 'Preview into Electron', source: 'WP-1H.03',
    meaning: 'No gaps, and about 0.7 to 0.9 ms to copy a 1080p frame out of shared memory.' },
  { id: 'mcp', value: '3.6k', unit: 'tokens', label: 'MCP tool list, 18 tools', source: 'WP-1J.01',
    meaning: 'The standard profile. The minimal profile is 9 tools in about 1.2k tokens.' },
  { id: 'goldens', value: '≤ 1', unit: 'code value', label: 'GPU against software', source: 'WP-1F.02',
    meaning: 'Each GPU reproduces its own golden frames bit for bit, and every set is within one 8-bit code of the software renderer.' },
];

export const PROOF_LABEL = 'Measured in a spike';
export const PROOF_FOOTNOTE = 'Informal, one Windows laptop. Formal runs pending.';
export const PROOF_WP_LABEL = 'Measured in a work package test';
export const PROOF_WP_FOOTNOTE = 'Informal, one dev machine. Formal runs pending.';
export const PROOF_BLOCKED =
  'Not passed: the S3 spike for decode, seek and hardware acceleration is blocked on FFmpeg. The Phase 0 go/no-go reads go except where FFmpeg is required.';

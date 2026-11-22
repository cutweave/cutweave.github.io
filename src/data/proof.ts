// SPDX-License-Identifier: GPL-3.0-or-later
// Spike results. Source: docs/content-inventory.md section 9 "Benchmark numbers from spikes" (M0 and each spike README).
// GAP-09: informal numbers from one Windows 11 laptop (RTX 3080 laptop GPU and an AMD iGPU). Formal runs on reference
// hardware (issue #45) and on macOS and Linux are pending. Replace with the budget dashboard when WP-7D lands.

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
  /** Included in the four-number landing-page variant. */
  featured?: boolean;
}

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

export const PROOF_LABEL = 'Measured in a spike';
export const PROOF_FOOTNOTE = 'Informal, one Windows laptop. Formal runs pending.';
export const PROOF_BLOCKED =
  'Not passed: the S3 spike for decode, seek and hardware acceleration is blocked on FFmpeg. The Phase 0 go/no-go reads go except where FFmpeg is required.';

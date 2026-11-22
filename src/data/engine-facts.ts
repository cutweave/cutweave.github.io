// SPDX-License-Identifier: GPL-3.0-or-later
// Engineering facts for /how-it-works/. Source: docs/content-inventory.md §9 (which cites the main
// repo's docs/01-architecture.md, ADRs and docs/milestones/M0-go-no-go.md). Status is honest:
// "built" only where the inventory says built; design-only items are "planned".

export type FactStatus = 'built' | 'in-progress' | 'planned';

export const FACT_GROUPS = ['Model', 'Commands', 'Rendering', 'Process and safety'] as const;
export type FactGroup = (typeof FACT_GROUPS)[number];

export interface EngineFact {
  id: string;
  group: FactGroup;
  title: string;
  body: string;
  status: FactStatus;
  /** What exists today, shown under the body. */
  note?: string;
  source: string;
  href: string;
}

const REPO = 'https://github.com/cutweave/cutweave/blob/main';
const ARCH = `${REPO}/docs/01-architecture.md`;

export const DOC_LINKS = {
  architecture: ARCH,
  mcpDesign: `${ARCH}#14-mcp-server-in-cutweave-api`,
  adrIndex: `${REPO}/docs/adr/README.md`,
  spikeReport: `${REPO}/spikes/s5-command-bus/AGENT-RUN-REPORT.md`,
} as const;

export const ENGINE_FACTS: EngineFact[] = [
  {
    id: 'flicks',
    group: 'Model',
    title: 'Time is flicks',
    body: '1/705,600,000 s as an i64. Every common frame rate (23.976 to 120) and audio rate (44.1k, 48k, 96k) divides it exactly, so there is no float drift.',
    status: 'built',
    note: 'In cutweave-model.',
    source: 'arch §4.1, ADR-0004',
    href: ARCH,
  },
  {
    id: 'ids',
    group: 'Model',
    title: 'Entities are addressed by ID, never by index',
    body: 'IDs are prefixed UUIDv7: med_, seq_, trk_, itm_.',
    status: 'built',
    source: 'arch §4.2, ADR-0004',
    href: ARCH,
  },
  {
    id: 'overlaps',
    group: 'Model',
    title: 'No overlaps within a track, ever',
    body: 'Property-tested. Dropping onto an occupied spot creates a track, like CapCut.',
    status: 'built',
    note: 'Model invariants.',
    source: 'arch §4.3',
    href: ARCH,
  },
  {
    id: 'undo',
    group: 'Commands',
    title: 'Every edit is undoable and invertible',
    body: 'Undo applies stored inverse patch ops (RFC 6902). Property tests assert undo(apply(doc)) == doc for every command.',
    status: 'built',
    note: 'Core built in cutweave-commands.',
    source: 'arch §5.2, ADR-0005',
    href: ARCH,
  },
  {
    id: 'actors',
    group: 'Commands',
    title: 'Per-actor history',
    body: 'Actors are user, agent:<label> and plugin:<id>. The actor comes from the credential, never from the client, so you can undo the agent’s last change without touching your own edits.',
    status: 'in-progress',
    note: 'Transaction layer built; the rest is design.',
    source: 'arch §5.2, ADR-0016',
    href: ARCH,
  },
  {
    id: 'idempotent',
    group: 'Commands',
    title: 'Idempotent commands',
    body: 'request_id is deduplicated for 10 minutes, so retries after an engine restart are safe.',
    status: 'planned',
    note: 'Design.',
    source: 'arch §5.1, ADR-0015',
    href: ARCH,
  },
  {
    id: 'det-ids',
    group: 'Commands',
    title: 'Deterministic IDs for tests',
    body: '--deterministic-ids <seed> lets CLI, MCP and RPC paths produce byte-identical project documents.',
    status: 'built',
    note: 'SeededGen.',
    source: 'arch §5.1, M1 exit',
    href: ARCH,
  },
  {
    id: 'deterministic-render',
    group: 'Rendering',
    title: 'Deterministic rendering',
    body: 'render(snapshot, sequence, t, quality) is a pure function. Randomness is seeded from item IDs and there is no wall clock. That enables frame caching, parallel chunked export and golden tests.',
    status: 'in-progress',
    note: 'Spike S4: GPU output within 1 code value across NVIDIA and AMD.',
    source: 'arch §8, M0',
    href: ARCH,
  },
  {
    id: 'linear',
    group: 'Rendering',
    title: 'Linear-light, float rendering',
    body: 'Rgba16Float working space. PQ and HLG are tone-mapped to SDR.',
    status: 'in-progress',
    note: 'Spike S4.',
    source: 'arch §8',
    href: ARCH,
  },
  {
    id: 'one-pipeline',
    group: 'Rendering',
    title: 'Preview and export share one pipeline',
    body: 'What you scrub is what you export.',
    status: 'planned',
    note: 'Design.',
    source: 'brief, principle 4',
    href: `${REPO}/docs/00-product-brief.md`,
  },
  {
    id: 'audio-rt',
    group: 'Rendering',
    title: 'Lock-free real-time audio thread',
    body: 'No allocation on the audio callback. The audio device clock is the master clock; video follows audio.',
    status: 'in-progress',
    note: 'Spike S2: 0 real-time allocations in a 10-minute soak.',
    source: 'arch §9',
    href: ARCH,
  },
  {
    id: 'process',
    group: 'Process and safety',
    title: 'Engine in its own process',
    body: 'A GPU, decoder or plugin crash does not take the UI down. One Rust binary, cutweave, runs as GUI engine, MCP server, CLI or headless renderer.',
    status: 'planned',
    note: 'Design.',
    source: 'arch §2, ADR-0002',
    href: ARCH,
  },
  {
    id: 'saves',
    group: 'Process and safety',
    title: 'Crash-safe saves',
    body: 'Temp file, fsync, rename. Autosave when idle and every 30 s; journal replay on restart.',
    status: 'in-progress',
    note: 'Atomic save and lock built. Journal and autosave pending (WP-1C.02, 1C.03).',
    source: 'arch §17, ADR-0006',
    href: ARCH,
  },
  {
    id: 'frames',
    group: 'Process and safety',
    title: 'Agents get frames, not screenshots',
    body: 'Image tools carry structured metadata: time, items visible, captions on screen.',
    status: 'in-progress',
    note: 'Spike S5.',
    source: 'arch §14',
    href: ARCH,
  },
  {
    id: 'secrets',
    group: 'Process and safety',
    title: 'Secrets never leave the engine',
    body: '#[secret] params are redacted before the journal. Keys are not visible to the renderer, plugins or MCP clients.',
    status: 'planned',
    note: 'Design.',
    source: 'arch §14, §18',
    href: ARCH,
  },
];

/** Performance budgets: targets enforced in CI on reference machines. Not all are measured yet. */
export interface Budget {
  what: string;
  target: string;
}

export const BUDGETS: Budget[] = [
  { what: 'App start', target: '< 2.5 s' },
  { what: 'Open a 1-hour, 400-item project', target: '< 2 s' },
  { what: 'Command round trip', target: 'p95 < 16 ms' },
  { what: 'Scrub, proxy media', target: 'p95 < 80 ms' },
  { what: 'Scrub, 4K long-GOP', target: 'p95 < 150 ms' },
  { what: 'Timeline with 5,000 items', target: '≥ 55 fps' },
  { what: 'Audio/video sync', target: '< 40 ms; drift < 1 frame per 30 min' },
  { what: '1080p H.264 export', target: '≥ 2× realtime' },
  { what: 'Idle memory', target: '< 1.5 GB' },
];

/** Spike results, labelled "Measured in a spike". GAP-09: replace with formal runs. */
export interface SpikeResult {
  spike: string;
  result: string;
}

export const SPIKE_RESULTS: SpikeResult[] = [
  {
    spike: 'S1 preview path',
    result:
      'Electron, Rust sidecar, shared memory and WebGPU: 60.00 fps with 0 skipped frames. Scrub to pixel p95 49.5 ms (budget 80). 0 blank frames over 119 live resizes.',
  },
  {
    spike: 'S1 timeline stress',
    result: '5,000 clips, 50,000 keyframes and 200 thumbnails at 60 fps (vsync-capped). Draw p95 1.3 ms; hit-test under 0.01 ms.',
  },
  {
    spike: 'S2 audio clock',
    result: '10-minute soak: 0 underruns, 0 real-time allocations, callback max 0.29 ms, drift +11 ppm.',
  },
  {
    spike: 'S4 compositor, 1080p',
    result:
      'GPU p50/p95: RTX 3080 laptop 0.7/3.1 ms; AMD iGPU 6.5/8.1 ms (budget 8 ms, borderline). Cross-vendor difference at most 1 code value.',
  },
  {
    spike: 'S4b compositions',
    result: '35 of 35 sandbox escapes contained. 200 fully animated nodes took 2.6 ms against a 1 ms budget: a conditional pass.',
  },
  {
    spike: 'S5 command bus and MCP',
    result: '73 tests. Standard tools/list about 2.7k tokens for 13 tools. Claude Code passed 3 of 3 runs with no screenshots.',
  },
  {
    spike: 'S3 decode, seek, hardware acceleration',
    result: 'Not passed: blocked on FFmpeg.',
  },
];

export const SPIKE_FOOTNOTE = 'Informal, one Windows laptop. Formal runs pending.';

export const STACK = {
  engine: ['Rust (edition 2024)', 'wgpu and WGSL', 'FFmpeg', 'rmcp (official Rust MCP SDK)', 'wasmtime', 'axum'],
  app: ['Electron', 'React 19', 'TypeScript (strict)'],
} as const;

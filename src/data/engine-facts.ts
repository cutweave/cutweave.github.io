// SPDX-License-Identifier: GPL-3.0-or-later
// Engineering facts for /how-it-works/. Source: docs/content-inventory.md §9 (which cites the main
// repo's docs/01-architecture.md, ADRs, docs/milestones/M0-go-no-go.md and merge commits). Status is honest:
// "built" means code and tests exist in the product repo as of HEAD 7728d7c (2026-11-23), not that you can use it.

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
  // Generated from the code by `cargo xtask gen` in the product repo (WP-1N.01). GAP-08: not on a docs site yet.
  commandReference: `${REPO}/docs/reference/commands.md`,
  cliReference: `${REPO}/docs/reference/cli.md`,
  rpcReference: `${REPO}/docs/reference/rpc.md`,
  launchProtocol: `${REPO}/docs/reference/launch-protocol.md`,
  mcpClients: `${REPO}/docs/reference/mcp-clients.md`,
} as const;

export const ENGINE_FACTS: EngineFact[] = [
  {
    id: 'flicks',
    group: 'Model',
    title: 'Time is flicks',
    body: '1/705,600,000 s as an i64. Every common frame rate (23.976 to 120) and audio rate (44.1k, 48k, 96k) divides it exactly, so there is no float drift.',
    status: 'built',
    note: 'In cutweave-model. Commands accept 4s, a frame number or a timecode and snap to the sequence’s frame grid.',
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
    body: 'Property-tested after every random request. An agent’s timeline.insert is refused if it would overlap. The editor’s drag and drop asks for a new track instead, like CapCut.',
    status: 'built',
    note: 'Model invariants and the timeline.insert overlap policy.',
    source: 'arch §4.3',
    href: ARCH,
  },
  {
    id: 'undo',
    group: 'Commands',
    title: 'Every edit is undoable and invertible',
    body: 'Undo applies stored inverse patch ops (RFC 6902). A property harness runs random command sequences over every registered command and checks undo(apply(doc)) == doc.',
    status: 'built',
    note: '43 commands registered. Built in cutweave-commands and cutweave-ops.',
    source: 'arch §5.2, ADR-0005',
    href: ARCH,
  },
  {
    id: 'actors',
    group: 'Commands',
    title: 'Per-actor history',
    body: 'Actors are user, agent:<label> and plugin:<id>. The actor comes from the credential, never from the client, so you can undo the agent’s last change without touching your own edits.',
    status: 'built',
    note: 'Built in the engine: the editor is user and an MCP session is agent:mcp. Undo refuses when a later change touched the same fields.',
    source: 'arch §5.2, ADR-0016',
    href: ARCH,
  },
  {
    id: 'locks',
    group: 'Commands',
    title: 'Soft locks while you drag',
    body: 'An open gesture locks the items it touches. An agent’s edit to the same clip is refused with a retry hint, and edits to other clips go through.',
    status: 'built',
    note: 'Built in the engine. A gesture that goes idle for 30 s is rolled back.',
    source: 'arch §5.2, ADR-0017',
    href: ARCH,
  },
  {
    id: 'idempotent',
    group: 'Commands',
    title: 'Idempotent commands',
    body: 'request_id is deduplicated for 10 minutes, so retries after an engine restart are safe.',
    status: 'built',
    note: 'The window survives a restart through the journal, and the editor resends unacknowledged commands exactly once.',
    source: 'arch §5.1, ADR-0015',
    href: ARCH,
  },
  {
    id: 'det-ids',
    group: 'Commands',
    title: 'Deterministic IDs for tests',
    body: '--deterministic-ids <seed> lets CLI, MCP and RPC paths produce byte-identical project documents.',
    status: 'built',
    note: 'Seeded streams for entities, requests and jobs. A GUI engine refuses the flag.',
    source: 'arch §5.1, M1 exit',
    href: ARCH,
  },
  {
    id: 'deterministic-render',
    group: 'Rendering',
    title: 'Deterministic rendering',
    body: 'render(snapshot, sequence, t, quality) is a pure function. Randomness is seeded from item IDs and there is no wall clock. That enables frame caching, parallel chunked export and golden tests.',
    status: 'built',
    note: 'Built in the production compositor: each GPU reproduces its golden frames bit for bit. Caching and chunked export are not built.',
    source: 'arch §8, WP-1F.02',
    href: ARCH,
  },
  {
    id: 'linear',
    group: 'Rendering',
    title: 'Linear-light, float rendering',
    body: 'Rgba16Float working space. PQ and HLG are tone-mapped to SDR.',
    status: 'built',
    note: 'Built in the compositor. It renders synthetic test cards until media decoding lands.',
    source: 'arch §8, WP-1F.02',
    href: ARCH,
  },
  {
    id: 'one-pipeline',
    group: 'Rendering',
    title: 'Preview and export share one pipeline',
    body: 'What you scrub is what you export.',
    status: 'in-progress',
    note: 'The compositor, the frame readback and the preview transport are built. Export is not.',
    source: 'brief, principle 4',
    href: `${REPO}/docs/00-product-brief.md`,
  },
  {
    id: 'audio-rt',
    group: 'Rendering',
    title: 'Lock-free real-time audio thread',
    body: 'No allocation on the audio callback. The audio device clock is the master clock; video follows audio.',
    status: 'built',
    note: 'Built for generated audio. The mixer render allocates and locks nothing, and an offline mixdown equals the real-time output.',
    source: 'arch §9, WP-1G.01, WP-1G.02',
    href: ARCH,
  },
  {
    id: 'process',
    group: 'Process and safety',
    title: 'Engine in its own process',
    body: 'A crash does not take the UI down. One Rust binary, cutweave, runs as GUI engine, MCP server, CLI or headless renderer.',
    status: 'built',
    note: 'Built: the editor talks to the engine over a local WebSocket, and a supervisor restarts it and recovers from the journal. Decoder and plugin crashes are not exercised yet.',
    source: 'arch §2, ADR-0002, WP-1L.03',
    href: ARCH,
  },
  {
    id: 'saves',
    group: 'Process and safety',
    title: 'Crash-safe saves',
    body: 'Temp file, fsync, rename. Autosave after 2 s idle or every 30 s, with the last ten backups. A journal is replayed on restart.',
    status: 'built',
    note: 'Built in the engine. A kill test stops a 500-operation session at 20 random points and checks that recovery matches.',
    source: 'arch §17, ADR-0006',
    href: ARCH,
  },
  {
    id: 'paths',
    group: 'Process and safety',
    title: 'Agents only touch folders you allow',
    body: 'An agent or CLI path must lie inside the allowed folders or the open project, after symlinks are resolved. Text taken from media files is marked untrusted before an agent sees it.',
    status: 'built',
    note: 'Built in the engine and tested with links and junctions.',
    source: 'arch §14, §18',
    href: ARCH,
  },
  {
    id: 'frames',
    group: 'Process and safety',
    title: 'Agents get frames, not screenshots',
    body: 'Image tools carry structured metadata: time, items visible, captions on screen.',
    status: 'in-progress',
    note: 'render.frame and render.contact_sheet are built in the render crate. They are not on the MCP tool list until WP-1J.02.',
    source: 'arch §14, WP-1F.03',
    href: ARCH,
  },
  {
    id: 'secrets',
    group: 'Process and safety',
    title: 'Secrets never leave the engine',
    body: '#[secret] params are redacted before the journal. Keys are not visible to the renderer, plugins or MCP clients.',
    status: 'in-progress',
    note: 'Redaction before the journal is built and tested. There are no keys yet: the AI gateway and the keychain are not built.',
    source: 'arch §14, §18',
    href: ARCH,
  },
];

/** A measured result, with where it came from. */
export interface Measured {
  text: string;
  kind: 'wp' | 'spike';
}

/** Performance budgets: targets enforced in CI on reference machines. Not all are measured yet. */
export interface Budget {
  what: string;
  target: string;
  /** What has been measured so far, informally. Omitted where nothing has been. */
  measured?: Measured;
}

export const BUDGETS: Budget[] = [
  { what: 'App start', target: '< 2.5 s', measured: { text: 'Engine alone, cold start 64 ms (WP-1I.04)', kind: 'wp' } },
  { what: 'Open a 1-hour, 400-item project', target: '< 2 s' },
  { what: 'Command round trip', target: 'p95 < 16 ms', measured: { text: 'p95 0.81 ms over WebSocket, debug build (WP-1I.02)', kind: 'wp' } },
  { what: 'Scrub, proxy media', target: 'p95 < 80 ms', measured: { text: 'p95 49.5 ms (S1)', kind: 'spike' } },
  { what: 'Scrub, 4K long-GOP', target: 'p95 < 150 ms' },
  { what: 'Timeline with 5,000 items', target: '≥ 55 fps', measured: { text: '60 fps, hit-test under 0.1 ms (WP-1M.05)', kind: 'wp' } },
  { what: 'Audio/video sync', target: '< 40 ms; drift < 1 frame per 30 min' },
  { what: '1080p H.264 export', target: '≥ 2× realtime' },
  { what: 'Idle memory', target: '< 1.5 GB' },
];

/** Results from tests in the real code, labelled "Measured in a work package test". GAP-09: replace with formal runs. */
export interface WpResult {
  wp: string;
  result: string;
}

export const WP_RESULTS: WpResult[] = [
  {
    wp: 'WP-1B.03 document actor',
    result: 'A no-op command round trip on the actor: p95 26 µs. Eight writers submitted 10,000 commands, and the final document equals a sequential replay.',
  },
  {
    wp: 'WP-1I.02 JSON-RPC',
    result: 'A clip.trim round trip over WebSocket, with its change event, on a 400-item project with a journal: p50 0.63 ms, p95 0.81 ms, p99 0.95 ms (debug build, loaded machine). Fifty connections sent 100 pipelined commands each with no deadlock.',
  },
  {
    wp: 'WP-1C.02 journal',
    result: 'A 500-operation session killed at 20 random points: recovery equals the uninterrupted run. Group commit keeps a rename round trip at p95 148 µs, against 788 µs with a sync on every commit.',
  },
  {
    wp: 'WP-1F.02 compositor',
    result: 'Eleven 384×216 golden frames per GPU: each GPU reproduces its own set bit for bit, and every set is within one 8-bit code of the software renderer (PSNR 69 dB or better).',
  },
  {
    wp: 'WP-1F.03 render.frame',
    result: 'A 1080p frame to a 768 px JPEG, end to end with a warm cache, p50: RTX 3080 laptop 8.2 to 8.6 ms, Radeon iGPU 7.8 to 8.2 ms, software 15.7 ms. Budget 150 ms.',
  },
  {
    wp: 'WP-1H.03 preview bridge',
    result: 'The present loop holds 60 fps with no gaps, and copying a 1080p frame out of shared memory takes about 0.7 to 0.9 ms.',
  },
  {
    wp: 'WP-1G.01 mixer',
    result: 'Four overlapping tones match the analytical sum to 4.4e-8. A 44.1 to 48 kHz resample of a 1 kHz sine has THD+N of -136.0 dB. Offline mixdown equals the real-time render within 1e-6.',
  },
  {
    wp: 'WP-1G.02 audio output',
    result: 'On a real WASAPI device at 48 kHz, a 10-minute soak of the eight-source mix: 0 underruns, 0 xruns, 0 heap operations in the callback, max clock residual 0.59 ms. Drift against the system timer is +10.9 ppm, the device crystal, as in S2.',
  },
  {
    wp: 'WP-1J.01 MCP',
    result: '/mcp lists 18 tools in about 3.6k tokens (gate: 19 tools, 5k). /mcp/minimal lists 9 tools in about 1.2k tokens (budget: 12 tools, 3k).',
  },
  {
    wp: 'WP-1L.03 supervision',
    result: 'Three edits, then the engine is killed: the editor recovers in under 5 s and each command applies once.',
  },
];

export const WP_FOOTNOTE = 'Informal, one dev machine. Formal runs pending.';

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
  engine: ['Rust (edition 2024)', 'wgpu and WGSL', 'FFmpeg (not yet in)', 'rmcp (official Rust MCP SDK)', 'wasmtime (planned)', 'axum', 'cpal'],
  app: ['Electron', 'React 19', 'TypeScript (strict)'],
} as const;

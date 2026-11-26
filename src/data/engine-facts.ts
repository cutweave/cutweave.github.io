// SPDX-License-Identifier: GPL-3.0-or-later
// Engineering facts for /how-it-works/. Source: docs/content-inventory.md §9 (which cites the main
// repo's docs/01-architecture.md, ADRs, docs/milestones/M0-go-no-go.md and merge commits). Status is honest:
// "built" means code and tests exist in the product repo as of origin/main e129848 (2026-11-26), not that you can install it.
// Verified on Windows only (R34): macOS and Linux are deferred until those machines exist.

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
    note: '115 commands and queries registered (43 on 23 November). Built in cutweave-commands and cutweave-ops.',
    source: 'arch §5.2, ADR-0005',
    href: ARCH,
  },
  {
    id: 'actors',
    group: 'Commands',
    title: 'Per-actor history',
    body: 'Actors are user, agent:<label> and plugin:<id>. The actor comes from the credential, never from the client, so you can undo the agent’s last change without touching your own edits.',
    status: 'built',
    note: 'Built in the engine: the editor is user and an MCP session is agent:mcp. Undo refuses when a later change touched the same fields. The editor’s own Undo acts on anyone’s latest change and says who made it (ADR-0019), and a History panel lists every step.',
    source: 'arch §5.2, ADR-0016',
    href: ARCH,
  },
  {
    id: 'locks',
    group: 'Commands',
    title: 'Soft locks while you drag',
    body: 'An open gesture locks the items it touches. An agent’s edit to the same clip is refused with a retry hint, and edits to other clips go through.',
    status: 'built',
    note: 'Built in the engine. A gesture that goes idle for 30 s is rolled back. Retry semantics and on-screen lock feedback are WP-2A.12, not merged yet.',
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
    note: 'Built in the production compositor: each GPU reproduces its golden frames bit for bit, and in the M1 gate 18 of 18 golden frames were bit-identical. A frame cache serves scrubbing. Chunked parallel export is not built.',
    source: 'arch §8, WP-1F.02',
    href: ARCH,
  },
  {
    id: 'linear',
    group: 'Rendering',
    title: 'Linear-light, float rendering',
    body: 'Rgba16Float working space. PQ and HLG are tone-mapped to SDR.',
    status: 'built',
    note: 'Built in the compositor, and fed by real decoded video since the engine wiring (WP-1I.05). Position, scale, rotation, crop, flip, opacity and eight blend modes are rendered (WP-2C.04).',
    source: 'arch §8, WP-1F.02',
    href: ARCH,
  },
  {
    id: 'seek',
    group: 'Rendering',
    title: 'Frame-exact seek in real media',
    body: 'Seeking starts at the packet index’s keyframe, decodes forward, and returns exactly the frame you asked for, on variable frame rate, open GOP and rotated clips too.',
    status: 'built',
    note: 'Built on FFmpeg, on Windows: 500 of 500 seeks exact on every corpus file. Hardware decode (NVDEC, D3D11VA) falls back to software. The macOS and Linux paths are written and not run.',
    source: 'arch §7, ADR-0003, WP-1D.03, WP-1D.04',
    href: `${REPO}/docs/adr/0003-media-backend-ffmpeg.md`,
  },
  {
    id: 'proxies',
    group: 'Rendering',
    title: 'Proxies for heavy footage',
    body: 'Long-GOP H.264 or HEVC over 1920 px, footage over 60 fps and 10-bit HEVC get a light copy in the background. Scrubbing uses it, and paused frames, agent frames and exports use the original.',
    status: 'built',
    note: 'Built (policy auto, all or off). Proxy-aware source selection in the UI, relinking and collect are WP-2F.02 to 2F.04, not merged.',
    source: 'ADR-0027, WP-2F.01',
    href: `${REPO}/docs/adr/0027-proxy-policy-in-the-project.md`,
  },
  {
    id: 'one-pipeline',
    group: 'Rendering',
    title: 'Preview and export share one pipeline',
    body: 'What you scrub is what you export.',
    status: 'built',
    note: 'Built and tested: every exported frame is rendered like render.frame, a test checks the two are bit-identical before encoding, and transforms and blend modes render the same in preview and export (WP-2C.04). Audio fades, volume and pan mix the same in both (WP-2E.01).',
    source: 'brief, principle 4, WP-1E.03, WP-2C.04',
    href: `${REPO}/docs/00-product-brief.md`,
  },
  {
    id: 'audio-rt',
    group: 'Rendering',
    title: 'Lock-free real-time audio thread',
    body: 'No allocation on the audio callback. The audio device clock is the master clock; video follows audio.',
    status: 'built',
    note: 'Built, and now playing decoded clip audio. The mixer render allocates and locks nothing, and an offline mixdown equals the real-time output.',
    source: 'arch §9, WP-1G.01, WP-1G.02',
    href: ARCH,
  },
  {
    id: 'process',
    group: 'Process and safety',
    title: 'Engine in its own process',
    body: 'A crash does not take the UI down. One Rust binary, cutweave, runs as GUI engine, MCP server, CLI or headless renderer.',
    status: 'built',
    note: 'Built: the editor talks to the engine over a local WebSocket, and a supervisor restarts it and recovers from the journal. In the M1 gate, 20 engine kills and 20 whole-app kills lost and doubled no commands. Decoder and plugin crashes are not exercised yet.',
    source: 'arch §2, ADR-0002, WP-1L.03',
    href: ARCH,
  },
  {
    id: 'saves',
    group: 'Process and safety',
    title: 'Crash-safe saves',
    body: 'Temp file, fsync, rename. Autosave after 2 s idle or every 30 s, with the last ten backups. A journal is replayed on restart.',
    status: 'built',
    note: 'Built. A kill test stops a 500-operation session at 20 random points and checks that recovery matches, and the M1 gate restores the editor after 20 whole-app kills. Opening a project never drops unsaved work unasked (ADR-0029).',
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
    status: 'built',
    note: 'render_frame returns an image block to the agent (up to 1 MB, with a resource link for larger frames). The contact sheet, filmstrip and waveform images as MCP tools are WP-2I.02, not merged yet.',
    source: 'arch §14, WP-1F.03, WP-1J.02',
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
  { what: 'App start', target: '< 2.5 s', measured: { text: 'Engine alone, cold start 64 ms (WP-1I.04). Full engine with GPU about 1.0 s (WP-1I.05)', kind: 'wp' } },
  { what: 'Open a 1-hour, 400-item project', target: '< 2 s' },
  { what: 'Command round trip', target: 'p95 < 16 ms', measured: { text: 'p95 0.81 ms over WebSocket, debug build (WP-1I.02)', kind: 'wp' } },
  { what: 'Scrub, proxy media', target: 'p95 < 80 ms', measured: { text: 'p95 49.5 ms (S1). A proxy scrubs at p95 1.8 ms (WP-2F.01)', kind: 'spike' } },
  { what: 'Scrub, 4K long-GOP', target: 'p95 < 150 ms', measured: { text: 'Hardware decode p95 102 to 129 ms with a 1 s GOP, 518 to 768 ms with an 8 s GOP (S3). The CPU alone is 282 to 804 ms.', kind: 'spike' } },
  { what: 'Timeline with 5,000 items', target: '≥ 55 fps', measured: { text: '60 fps, hit-test under 0.1 ms (WP-1M.05)', kind: 'wp' } },
  { what: 'Audio/video sync', target: '< 40 ms; drift < 1 frame per 30 min' },
  { what: '1080p H.264 export', target: '≥ 2× realtime', measured: { text: '3.0× with NVENC and 2.9× with AMF, debug build, loaded laptop (WP-1E.03b)', kind: 'wp' } },
  { what: 'Idle memory', target: '< 1.5 GB' },
];

/** Results from tests in the real code, labelled "Measured in a work package test". GAP-09: replace with formal runs. */
export interface WpResult {
  wp: string;
  result: string;
}

export const WP_RESULTS: WpResult[] = [
  {
    wp: 'WP-1O.04 M1 exit suite',
    result: 'The M1 gate on a Windows 11 laptop: the UI cut and a scripted MCP agent export byte-identical 12 s 1080p MP4s (5,907,413 bytes). 40 crash trials (20 engine kills, 20 app kills) lost and doubled no commands. 18 of 18 golden frames were bit-identical, and parity CLI = MCP = RPC passed 8 of 8. Exported frames 30, 150 and 255 matched cutweave render at 48.9, 48.9 and 47.7 dB PSNR in the export’s color space (35.3 to 37.5 dB back in RGB).',
  },
  {
    wp: 'WP-1D.03 frame-exact seek',
    result: '500 of 500 random seeks returned the exact frame on every corpus file and generated edge clip: 4K long-GOP H.264, HEVC 10-bit HDR and SDR, ProRes, variable frame rate, open GOP.',
  },
  {
    wp: 'WP-1E.03b hardware export',
    result: '20 s of 1080p30 exported in 6.6 s with NVENC (3.0×) and 7.0 s with AMF (2.9×) on the reference laptop, in a debug build on a loaded machine. Budget 2×. A failed hardware encode restarts in software from frame 0.',
  },
  {
    wp: 'WP-2F.01 proxies',
    result: 'Proxies generate at 2.0 to 3.3× realtime on 4K sources, resume after a hard kill, and map 502 of 502 variable-frame-rate frames. Scrubbing a proxy: p95 1.8 ms.',
  },
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
    wp: 'WP-1J.01 MCP, at its merge',
    result: '/mcp listed 18 tools in about 3.6k tokens (gate then: 19 tools, 5k; the Phase 2 gate is 36 tools, 8k). /mcp/minimal lists 9 tools in about 1.2k tokens (budget: 12 tools, 3k).',
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
    result: 'Passed on Windows, 2026-11-24: 500 random seeks frame-exact on 16 generated files on the CPU, and NVDEC and D3D11VA bit-exact with software on 18 files, except AMD D3D11VA on open-GOP H.264 after a seek. Cold 4K seek p95 with a 1 s GOP is 102 to 129 ms in hardware against 195 ms on the CPU. macOS and Linux are pending.',
  },
];

export const SPIKE_FOOTNOTE = 'Informal, one Windows laptop. Formal runs pending.';

export const STACK = {
  engine: ['Rust (edition 2024)', 'wgpu and WGSL', 'FFmpeg (ffmpeg-next)', 'rmcp (official Rust MCP SDK)', 'wasmtime (planned)', 'axum', 'cpal'],
  app: ['Electron', 'React 19', 'TypeScript (strict)'],
} as const;

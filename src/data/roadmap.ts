// SPDX-License-Identifier: GPL-3.0-or-later
// Roadmap data. Source: docs/content-inventory.md section 10 ("Roadmap", "Where the project is now") and 3.11.
// State as of product HEAD 7728d7c, 2026-11-23. Durations are rough, and the plan is re-estimated after Phase 0.

export type PhaseState = 'done' | 'current' | 'future';

export interface Phase {
  id: string; // "P0"
  name: string;
  state: PhaseState;
  /** Rough duration. */
  duration: string;
  delivers: string;
  /** Milestone and exit criterion. */
  milestone: string;
  /** Work packages merged out of the total, for the current phase only. */
  progress?: { done: number; total: number };
}

export const CURRENT_PHASE = 'P1';

/** Where the product repo stands. Source: docs/wbs/P1-skeleton.md (60 work packages) and `git log` on main. */
export const AS_OF = {
  /** Short hash of the product repo commit this page was checked against. */
  head: '7728d7c',
  iso: '2026-11-23',
  label: '23 November 2026',
  p1Done: 40,
  p1Total: 60,
  /** Work packages merged after Phase 0 closed, between product commits 6ca1af7 and 7728d7c. */
  recentlyMerged: 28,
} as const;

export const PHASES: Phase[] = [
  { id: 'P0', name: 'Foundations and spikes', state: 'done', duration: 'About 5 weeks',
    delivers: 'Repo, CI, governance, design tokens and the UI package, ADRs 0001–0017, and spikes S1, S2, S4, S4b and S5.',
    milestone: 'M0 go/no-go: provisional go on 2026-11-22. The FFmpeg decode spike (S3) is blocked, and the product-owner sign-off is not yet ticked.' },
  { id: 'P1', name: 'Walking skeleton', state: 'current', duration: 'About 10 weeks',
    delivers: 'Model, command bus, persistence, media probe and decode, H.264 export, preview, MCP v0 with 14 core tools and four generic ones, a CLI, and the Electron shell with a basic UI.',
    milestone: 'M1: the UI and an MCP agent both import, cut and export, the two project documents are byte-identical, and the project recovers after an engine kill.',
    progress: { done: AS_OF.p1Done, total: AS_OF.p1Total } },
  { id: 'P2', name: 'Core editor', state: 'future', duration: 'About 9 weeks',
    delivers: 'Multi-track magnetic timeline, keyframes, speed, audio features, proxies, export presets and queue, dockable workspaces, about 30 MCP tools, and performance benchmarks.',
    milestone: 'M2 dogfood: a non-developer edits a 10-minute YouTube video and a 9:16 short, and 20 forced crashes lose no data.' },
  { id: 'P3', name: 'Text, captions, transcripts', state: 'future', duration: 'About 8 weeks',
    delivers: 'Text engine, compositions, transcripts, at least 25 caption styles, text-based editing, sticker and music packs, Agent Kit v0 and unsigned installers.',
    milestone: 'M3 Public Alpha: a new user makes a captioned, silence-cut 9:16 short in under 5 minutes, and an agent does it from one instruction.' },
  { id: 'P4', name: 'Effects, transitions, color', state: 'future', duration: 'About 9 weeks, in parallel',
    delivers: 'WGSL effect framework, at least 40 transitions, 50 effects and 40 filters, color tools and scopes, masks and keying, stabilization and tracking.',
    milestone: 'M4 creative parity: 10 "CapCut trend" recreations pass design review, and preview equals export.' },
  { id: 'P5', name: 'AI gateway and AI Studio', state: 'future', duration: 'About 12 weeks, in parallel',
    delivers: 'Gateway, signed model catalog, first-wave provider adapters, AI Studio panel, background removal, reframe, text to speech, dubbing, upscale, long-to-shorts, a local AI plugin and stock search.',
    milestone: 'M5 AI Studio: every listed AI feature runs end to end with the cost up front and provenance recorded, and the spending-authority security tests pass.' },
  { id: 'P6', name: 'Plugins, templates, Agent Kit, copilot', state: 'future', duration: 'About 10 weeks, the largest phase',
    delivers: 'Plugin platform and index, at least 30 templates, brand kit, interchange, publishers, Agent Kit v1, evals, the copilot, and MCP parity checks in CI.',
    milestone: 'M6 Beta: a third party ships an effect, a provider adapter and a panel from the docs alone, and agent evals reach 80% on two clients.' },
  { id: 'P7', name: 'Hardening and 1.0', state: 'future', duration: 'About 7 weeks',
    delivers: 'Signed installers, auto-update, crash-free sessions, fuzzing, accessibility (WCAG 2.2 AA), translations, performance budgets, docs, legal review, and the launch website, samples and community.',
    milestone: '1.0: eight gates, including signed installers, budgets green for seven nights, accessibility, docs, legal and security review, and a product-owner go/no-go.' },
];

export interface BuiltItem {
  title: string;
  text: string;
  /** Replaces the word on the status chip, for example "Built · engine". */
  chip?: string;
}

/** What exists in the repo as of AS_OF. Built means code and tests, not something you can use. */
export const BUILT: BuiltItem[] = [
  { title: 'A command bus with undo', text: 'Every change is one of 43 registered commands, applied as a transaction that stores its inverse. Undo and redo are per actor, so an agent’s last change can be undone without touching yours. A property harness runs random command sequences and checks that undo restores the document.', chip: 'Built · engine' },
  { title: 'One writer, many readers', text: 'A single document actor owns the project. Readers get immutable snapshots without locks, each change is a numbered revision, and an open drag soft-locks the clips it touches so another actor’s edit to them is refused.', chip: 'Built · engine' },
  { title: 'Crash recovery', text: 'A journal records every committed change. After a crash the engine replays it, autosave keeps the last ten backups, and a supervisor restarts the engine and resends unacknowledged commands exactly once.', chip: 'Built · engine' },
  { title: 'A local API', text: 'JSON-RPC over WebSocket on 127.0.0.1 with token auth, event subscriptions and backpressure. The editor and tools use the same commands, and a generated reference lists all of them.', chip: 'Built · engine' },
  { title: 'An MCP server, v0', text: 'Tools are derived from the command registry: 14 core tools plus search, describe, execute and query, over HTTP and over stdio with cutweave mcp --attach or --headless. Both MCP spec revisions work. It cannot render a frame or export yet.', chip: 'Built · v0' },
  { title: 'A command line, core only', text: 'cutweave engine, exec, query, commands and describe work, with JSON in and out. cutweave render returns unsupported until the media backend lands.', chip: 'Built · core only' },
  { title: 'The production compositor', text: 'A wgpu compositor in linear light with color conversion, transforms, crop, alpha and tone mapping. Each GPU reproduces its own golden test frames bit for bit. It renders synthetic test cards today, because nothing decodes video yet.', chip: 'Built · test cards' },
  { title: 'Frames for agents', text: 'render.frame and render.contact_sheet return a JPEG or PNG with metadata about what is on screen. They exist in the render crate and are not exposed over MCP yet.', chip: 'Built · not wired' },
  { title: 'Audio mixer and device clock', text: 'A mixer with sample-exact edits, resampling and an offline mixdown that equals real-time output, played through a cpal device with a lock-free master clock. It plays generated tones; decoded clips wait on FFmpeg.', chip: 'Built · generated audio' },
  { title: 'Preview into Electron', text: 'A shared-memory ring carries frames from the engine to the Electron window through a native addon, with a present loop on the preload side. There is no preview panel on top of it yet.', chip: 'Built · transport' },
  { title: 'A live timeline in the editor', text: 'The editor mirrors the engine’s document and shows it on the Canvas2D timeline. You can select, move, trim, split and delete clips with snapping, and each drag is one undo step. Media comes from a dev-only stub backend.', chip: 'Built · stub media' },
  { title: 'A media bin', text: 'Import dialog, drag and drop from the OS, cards, removal and keyboard control, and dropping a clip onto the timeline. Thumbnails are placeholders until the media endpoints land.', chip: 'Built · stub media' },
  { title: 'The project model and atomic save', text: 'Projects, tracks and clips in frame-exact flicks, addressed by ID, saved to a folder through a temp file, fsync and rename, with a lock file.' },
  { title: 'Design system and editor shell', text: 'packages/ui has 22 components, generated tokens, a contrast gate and Storybook with visual regression. The shell has a dockable layout, themes and a hardened Electron window.' },
];

export interface NextItem {
  title: string;
  text: string;
  /** Work package ids, for the reader who wants to follow them. */
  wps: string;
  blocked?: boolean;
}

/** Still to merge in Phase 1: 20 of 60 work packages. Together these finish M1. */
export const NEXT_IN_P1: NextItem[] = [
  { title: 'Real media', text: 'Probe, decode, frame-exact seek, thumbnails and waveforms from real files. This waits on the FFmpeg spike (S3).', wps: 'WP-1D.01 to 1D.06', blocked: true },
  { title: 'Export', text: 'H.264 and AAC MP4, with hardware encoders and a software fallback. Also waits on S3.', wps: 'WP-1E.01 to 1E.03', blocked: true },
  { title: 'Transport and A/V sync', text: 'Play, pause, scrub and step, with video following the audio clock. It is being built against synthetic frames first.', wps: 'WP-1H.01' },
  { title: 'Preview, inspector and dialogs', text: 'The preview panel, the inspector, undo and redo in the UI, save and open, the recovery dialog and the export dialog.', wps: 'WP-1M.04, 1M.07, 1M.08' },
  { title: 'Engine wiring', text: 'Media, render, audio and playback attached to the engine, and media thumbnails and frames over HTTP.', wps: 'WP-1I.03, 1I.05' },
  { title: 'Frames and export over MCP', text: 'render_frame returns an image to an agent, and export_start joins the tool list when export lands.', wps: 'WP-1J.02, 1E.03' },
  { title: 'M1 acceptance', text: 'Golden-frame infrastructure, the CLI, MCP and RPC parity test, MCP conformance with a scripted agent, and the exit suite that proves the UI and an agent produce the same edit.', wps: 'WP-1O.01 to 1O.04' },
];

export interface MergedItem {
  wp: string;
  title: string;
  text: string;
  /** ISO date of the merge on the product repo's main branch. */
  date: string;
  /** Short hashes of the merge commits. */
  commits: string[];
}

export interface MergedGroup {
  id: string;
  title: string;
  items: MergedItem[];
}

/**
 * Work packages merged since Phase 0 closed, grouped by area, newest first within a group.
 * Source: `git log --first-parent` on the product repo's main branch (merge commits), 6ca1af7..7728d7c, plus
 * docs/wbs/P1-skeleton.md for titles. Dates are the merge dates. 28 work packages.
 */
export const RECENTLY_MERGED: MergedGroup[] = [
  {
    id: 'engine',
    title: 'Engine core',
    items: [
      { wp: 'WP-1N.02', title: 'TypeScript protocol package', text: 'Generated types, a typed RPC client and a patch applier, so the editor and scripts speak the same protocol.', date: '2026-11-23', commits: ['5e92362'] },
      { wp: 'WP-1N.01', title: 'Schema emission', text: 'cargo xtask gen writes the JSON Schemas and a generated command reference, and the check fails when a committed file is stale.', date: '2026-11-23', commits: ['f634210'] },
      { wp: 'WP-1D.07', title: 'Job manager and import jobs', text: 'Background jobs with progress and cancellation, and media.import with analysis jobs, built without FFmpeg.', date: '2026-11-23', commits: ['a1d87bd'] },
      { wp: 'WP-1C.03', title: 'Autosave and backups', text: 'Autosave after 2 s idle or every 30 s, the last ten backups, and project events.', date: '2026-11-23', commits: ['69bac6d'] },
      { wp: 'WP-1C.02', title: 'Command journal and crash recovery', text: 'An append-only, checksummed journal with replay. A kill test stops the process at random points and checks that recovery matches.', date: '2026-11-23', commits: ['55130b8'] },
      { wp: 'WP-1B.09', title: 'Transaction ownership and soft locks', text: 'A transaction belongs to its connection and rolls back if the connection drops. An open drag locks the clips it touches.', date: '2026-11-23', commits: ['a1b485f'] },
      { wp: 'WP-1B.08', title: 'Deterministic-ID mode', text: 'Seeded ID streams so two runs produce byte-identical documents, for tests.', date: '2026-11-23', commits: ['d9acbe3'] },
      { wp: 'WP-1B.07', title: 'Property harness', text: 'Random command sequences over every registered command, checking undo and redo identity, round trips and invariants.', date: '2026-11-23', commits: ['e754253'] },
      { wp: 'WP-1B.06', title: 'Clip editing commands', text: 'clip.split, clip.trim, item.move, item.delete, item.set_props and item.get.', date: '2026-11-23', commits: ['989daff'] },
      { wp: 'WP-1B.05', title: 'Project, media and track commands', text: 'project.*, media.*, track.*, timeline.insert and timeline.get, with linked video and audio clips.', date: '2026-11-23', commits: ['2cbe927'] },
      { wp: 'WP-1B.04', title: 'Undo history', text: 'Per-actor undo and redo, checkpoints and conflict detection.', date: '2026-11-23', commits: ['bfb6e46'] },
      { wp: 'WP-1B.03', title: 'Document actor', text: 'One writer, lock-free snapshot reads, revisions, events and request-id deduplication.', date: '2026-11-22', commits: ['d6cc82e'] },
    ],
  },
  {
    id: 'api',
    title: 'API, agents and CLI',
    items: [
      { wp: 'WP-1J.03', title: 'Stdio MCP', text: 'cutweave mcp --attach proxies into a running engine, so you can watch the agent edit. --headless runs an engine in the process.', date: '2026-11-23', commits: ['3ce9ccf'] },
      { wp: 'WP-1K.01', title: 'The cutweave CLI, core only', text: 'engine, exec, query, commands and describe. render and worker are not built.', date: '2026-11-23', commits: ['8542aa4'] },
      { wp: 'WP-1J.01', title: 'MCP server', text: 'Tools derived from the command registry, cutweave_execute for batches and dry runs, and both MCP spec revisions.', date: '2026-11-23', commits: ['c74300f'] },
      { wp: 'WP-1I.04', title: 'Engine root and launch protocol', text: 'Session lifecycle, the launch handshake, exit codes, an agent path policy and the event fan-out.', date: '2026-11-23', commits: ['7ab71c8'] },
      { wp: 'WP-1I.02', title: 'JSON-RPC over WebSocket', text: 'Commands as methods, event subscriptions, backpressure and a revision-gap resync protocol.', date: '2026-11-23', commits: ['27c31e5'] },
      { wp: 'WP-1I.01', title: 'Local API server', text: 'A loopback server with token credentials, Host and Origin checks and a run-file.', date: '2026-11-23', commits: ['2f46f72'] },
    ],
  },
  {
    id: 'render-audio',
    title: 'Rendering, preview and audio',
    items: [
      { wp: 'WP-1G.02', title: 'Audio output and master clock', text: 'cpal output with device-change supervision, a lock-free master clock and level meters.', date: '2026-11-23', commits: ['e97ed82'] },
      { wp: 'WP-1G.01', title: 'Mixer graph', text: 'Per-track lanes, sample-exact hand-offs and an offline mixdown that equals real-time output.', date: '2026-11-23', commits: ['42f7fbc'] },
      { wp: 'WP-1H.03', title: 'Preview bridge', text: 'A native addon reads the shared-memory ring, and a present loop runs in the preload.', date: '2026-11-23', commits: ['ef61e8e'] },
      { wp: 'WP-1F.03', title: 'Quality ladder and render.frame', text: 'Quality levels, asynchronous readback, render.frame and render.contact_sheet.', date: '2026-11-23', commits: ['f23d206'] },
      { wp: 'WP-1H.02', title: 'Shared-memory ring publisher', text: 'The engine side of the preview transport, with a versioned layout and crash handling.', date: '2026-11-22', commits: ['29f56e2'] },
      { wp: 'WP-1F.02', title: 'Production compositor', text: 'wgpu, linear light, color conversion, transforms, golden frames per GPU and device-loss recovery.', date: '2026-11-22', commits: ['c6cef43'] },
    ],
  },
  {
    id: 'desktop',
    title: 'Desktop and editor',
    items: [
      { wp: 'WP-1M.03', title: 'Media bin', text: 'Import dialog, OS drag and drop, cards and removal, and dropping media onto the timeline.', date: '2026-11-23', commits: ['d0ab5d2'] },
      { wp: 'WP-1M.06', title: 'Timeline interactions', text: 'A state machine for select, move, trim, split, delete and snapping, with one undo step per gesture.', date: '2026-11-23', commits: ['41fe7cd'] },
      { wp: 'WP-1L.03', title: 'Engine supervision', text: 'Restart after a crash, automatic recovery, exactly-once resend and a failed dialog. Two merges: the main process, then the renderer.', date: '2026-11-23', commits: ['043114c', '149370d'] },
      { wp: 'WP-1M.02', title: 'Live timeline from the engine', text: 'An RPC connection, a document mirror and stores, so the editor shows the engine’s project.', date: '2026-11-23', commits: ['5fbf6f5'] },
    ],
  },
];

export const AFTER_1_0: string[] = [
  'Browser "lite" editor',
  'Real-time collaboration',
  'CLAP, then VST3 plugin hosting',
  'HDR output',
  'Multicam',
  'Face and body effects',
  'Screen and webcam recording',
  'Region-prompt generative edits',
  'Node compositing view',
  'Distributed rendering',
  'Mobile companion',
  'OFX bridge',
];

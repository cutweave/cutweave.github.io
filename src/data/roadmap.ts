// SPDX-License-Identifier: GPL-3.0-or-later
// Roadmap data. Source: docs/content-inventory.md section 10 ("Roadmap", "Where the project is now") and 3.11.
// State as of HEAD 6ca1af7, 2026-11-22. Durations are rough, and the plan is re-estimated after Phase 0.

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
}

export const CURRENT_PHASE = 'P1';

export const PHASES: Phase[] = [
  { id: 'P0', name: 'Foundations and spikes', state: 'done', duration: 'About 5 weeks',
    delivers: 'Repo, CI, governance, design tokens and the UI package, ADRs 0001–0017, and spikes S1, S2, S4, S4b and S5.',
    milestone: 'M0 go/no-go: provisional go on 2026-11-22. The FFmpeg decode spike (S3) is blocked, and the product-owner sign-off is not yet ticked.' },
  { id: 'P1', name: 'Walking skeleton', state: 'current', duration: 'About 10 weeks',
    delivers: 'Model, command bus, persistence, media probe and decode, H.264 export, preview, MCP v0 with 15 core tools, a CLI, and the Electron shell with a basic UI.',
    milestone: 'M1: the UI and an MCP agent both import, cut and export, the two project documents are byte-identical, and the project recovers after an engine kill.' },
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
}

export const BUILT: BuiltItem[] = [
  { title: 'Rust crates with real code', text: 'The project model, the command layer, the engine (project I/O and UI state) and timeline evaluation. Thirteen other crates are still stubs.' },
  { title: 'Command bus with undo', text: 'Registered commands apply as transactions, and each stores its inverse. Per-actor history is in the library. Property tests check that undo restores the document.' },
  { title: 'Atomic save', text: 'Projects save to a folder through a temp file, fsync and rename, with a lock file. The journal and autosave are not built.' },
  { title: 'View commands', text: 'view.get, view.select, view.set, view.set_playhead and view.set_zoom, with debounced UI-state persistence. These are the only commands registered today.' },
  { title: 'Design system package', text: 'packages/ui: 22 components, generated tokens, a contrast gate, bundled fonts and Storybook with dark and light visual regression.' },
  { title: 'Canvas2D timeline', text: 'A virtualized timeline renderer with hit-testing, filmstrips and waveforms. It draws 5,000 clips at 60 fps.' },
  { title: 'Editor shell', text: 'Asset browser, preview, inspector, timeline and transport panels with empty states. A shell: nothing in it edits yet.' },
  { title: 'Hardened Electron scaffold', text: 'A window factory, CSP, navigation and permission guards, validated IPC with sender checks, fuses and a security test suite. No media can be imported, played or exported.' },
];

export const NEXT_IN_P1: BuiltItem[] = [
  { title: 'Media', text: 'Probe and decode. This waits on the FFmpeg spike (S3).' },
  { title: 'Export', text: 'H.264 and AAC MP4. Also waits on S3.' },
  { title: 'Playback', text: 'Audio clock, clip audio, and the preview path.' },
  { title: 'API server', text: 'The engine’s interface for the UI and for tools.' },
  { title: 'MCP v0', text: '15 core tools over stdio and HTTP.' },
  { title: 'CLI', text: 'The command line, including cutweave render.' },
  { title: 'M1 acceptance', text: 'The suite that proves the UI and an agent produce the same edit.' },
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

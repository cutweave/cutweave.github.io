// SPDX-License-Identifier: GPL-3.0-or-later
// Roadmap data. Source: docs/content-inventory.md section 10 ("Roadmap", "Where the project is now") and 3.11.
// State as of product origin/main e129848, 2026-11-26. Durations are rough, and the plan is re-estimated after each phase.
// Phase 1 is done: the owner signed off M1 as GO on 2026-11-25 (docs/milestones/M1-exit.md, verified on Windows only, R34).
// Phase 2 counts come from docs/wbs/P2-core-editor.md (82 work package headings) and the product repo's merge history.

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

export const CURRENT_PHASE = 'P2';

/** Where the product repo stands. Source: docs/wbs/P2-core-editor.md (82 work packages) and `git log` on origin/main. */
export const AS_OF = {
  /** Short hash of the product repo commit this page was checked against. */
  head: 'e129848',
  iso: '2026-11-26',
  label: '26 November 2026',
  /** Phase 2 work packages merged, counted from the merge history since M1 (see RECENTLY_MERGED_P2). */
  p2Done: 26,
  p2Total: 82,
  /** M1 sign-off. */
  m1Iso: '2026-11-25',
  m1Label: '25 November 2026',
  /** The previous site update was pinned to this product commit (2026-11-23). */
  previousHead: '981e5a2',
  /** Commits and merges on origin/main between previousHead and head. */
  commitsSince: 543,
  mergesSince: 113,
} as const;

export const PHASES: Phase[] = [
  { id: 'P0', name: 'Foundations and spikes', state: 'done', duration: 'About 5 weeks',
    delivers: 'Repo, CI, governance, design tokens and the UI package, ADRs 0001–0017, and spikes S1, S2, S4, S4b and S5.',
    milestone: 'M0 go/no-go: go with changes, signed off on 23 November 2026. The FFmpeg decode spike (S3) passed on Windows on 24 November: decode is frame-exact on every test file, and hardware decode matches software on NVIDIA and AMD, except AMD on open-GOP H.264 after a seek, which starting one keyframe earlier fixes.' },
  { id: 'P1', name: 'Walking skeleton', state: 'done', duration: 'About 10 weeks',
    delivers: 'Model, command bus, persistence, real media probe, decode and export, preview and playback, MCP v0 and its first real frames, a CLI, and the Electron shell with an editor for import, cut and export.',
    milestone: 'M1 signed off as GO on 25 November 2026. The UI and a scripted agent both import three clips, cut and export a 1080p MP4, and the two exports are byte-identical. Verified on Windows only; macOS and Linux are deferred until those machines exist, not dropped.' },
  { id: 'P2', name: 'Core editor', state: 'current', duration: 'About 9 weeks',
    delivers: 'Multi-track magnetic timeline, keyframes, speed, audio features, proxies, export presets and queue, dockable workspaces, about 30 MCP tools, and performance benchmarks.',
    milestone: 'M2 dogfood: a non-developer edits a 10-minute YouTube video and a 9:16 short, and 20 forced crashes lose no data.',
    progress: { done: AS_OF.p2Done, total: AS_OF.p2Total } },
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

/** What the M1 sign-off proved. Source: docs/milestones/M1-exit.md and docs/milestones/m1-evidence/ (report.md, compare.json). */
export interface Proved {
  title: string;
  text: string;
}

export const M1_PROVED: Proved[] = [
  { title: 'In the real editor', text: 'A scripted run of the desktop app imports three clips, places and trims them, splits one, and exports a 1080p H.264 MP4 with sound. The file is 12.000 s long, exactly the timeline, and a browser plays it. The test media is self-generated: H.264 1080p60, HEVC 10-bit, and a rotated variable-frame-rate phone clip.' },
  { title: 'Over MCP, headless', text: 'A scripted agent makes the same edit using only MCP tools, with no window open. The two projects are equal once ids are normalized, and the two exported MP4s are byte-identical (5,907,413 bytes).' },
  { title: 'Crashes lose nothing', text: '40 crash trials: 20 engine kills and 20 whole-app kills, at different points in a 30-command edit. 0 lost commands and 0 doubled commands. The editor was back online 0.9 to 1.9 s after an engine kill (median 0.9 s).' },
  { title: 'Frames and surfaces agree', text: '18 of 18 golden frames are bit-identical, and the CLI, MCP and RPC produce byte-identical documents in 8 of 8 parity tests.' },
];

export const M1_CAVEATS: string[] = [
  'Verified on one Windows 11 machine only. macOS and Linux are deferred until those machines exist, and "CI green on three operating systems" is deferred with them.',
  'The evidence is a local run of just m1-gate, not a CI run. A manual CI run is approved and not yet dispatched.',
  'The suite found six issues. Three were fixed as Phase 1 bugs, one early in Phase 2, and two are noted for later: a stale unsaved dot after a crash restore, and a misleading reason in one notice.',
];

export interface BuiltItem {
  title: string;
  text: string;
  /** Replaces the word on the status chip, for example "Built · Windows only". */
  chip?: string;
}

/** What exists in the repo as of AS_OF. Built means code and tests, on Windows, in a pre-alpha with no installer. */
export const BUILT: BuiltItem[] = [
  { title: 'Real media', text: 'An FFmpeg backend probes files (variable frame rate, rotation, color tags), seeks frame-exactly (500 of 500 seeks on every corpus file, including 4K long-GOP, HEVC 10-bit and ProRes), and decodes in hardware with a software fallback. Thumbnails, filmstrips and waveforms are cached on disk.', chip: 'Built · Windows only' },
  { title: 'Export', text: 'H.264 and AAC MP4 through x264, or through NVENC, AMF or QSV with a software restart if the hardware encoder fails. Each exported frame is rendered like render.frame, so preview and export match. A built-in preset pack and custom presets exist. HEVC, AV1, ProRes, GIF and the background queue do not yet.', chip: 'Built · Windows only' },
  { title: 'Preview and playback', text: 'A preview panel draws on a WebGPU canvas from a shared-memory ring. Play, pause, scrub, step and J K L follow the audio clock. A Source view plays a clip from the bin before it is on the timeline. Preview handles move, scale, rotate and crop a clip, with snapping, safe areas and grids.', chip: 'Built · Windows only' },
  { title: 'An editor you can cut in', text: 'Import with real thumbnails, search, filters and folders (including Import folder). A timeline with select, move, trim, split and delete. An inspector built from the command schemas, with keyframe diamonds. Save, open, recent projects and a recovery dialog. A custom title bar, and an export dialog with progress.', chip: 'Built · Windows only' },
  { title: 'Undo you can see', text: 'A History panel lists every undo step and who made it. Undo and redo act on anyone’s latest change, labelled with who made it. Checkpoints are saved restore points that survive crashes and reopening.', chip: 'Built · Windows only' },
  { title: 'Keyboard, palette and menus', text: 'A command palette on Ctrl+K lists every command. A shortcut editor with NLE and CapCut presets (some CapCut bindings are marked unverified). Context menus on the timeline, bin, tracks, preview and panels. Panels can be closed and reopened per workspace.', chip: 'Built · Windows only' },
  { title: 'Timeline edit semantics', text: 'Insert, overwrite, move, lift, extract and ripple delete. Trim, ripple trim, roll, slip and slide. Linked clips, attached clips and groups that move, trim and delete together. The rules are a written spec with over 120 fixtures, and every edit reports what it changed.', chip: 'Built · engine' },
  { title: 'Sequences and keyframes', text: 'Several sequences per project, with aspect and frame-rate presets that reframe and retime the timeline. Keyframes on clip properties with every easing, evaluated bit-exactly on native and wasm, and keys that follow splits and trims.', chip: 'Built · engine' },
  { title: 'Transforms and blend modes', text: 'The compositor renders position, scale, rotation, crop, flip, opacity and eight blend modes, with preview and export identical. Each GPU reproduces its own golden frames bit for bit.', chip: 'Built · Windows only' },
  { title: 'Audio', text: 'Decoded clip audio plays through the device clock. Fades with four curves, keyframed volume and pan are applied the same way in preview and export. Buses, a limiter, loudness and ducking are not built.', chip: 'Built · Windows only' },
  { title: 'Proxies', text: 'Heavy media (long-GOP H.264 or HEVC over 1920 px, over 60 fps, or 10-bit HEVC) gets a light copy made in the background, which scrubs smoothly while exports keep the original. Policy is auto, all or off.', chip: 'Built · Windows only' },
  { title: 'An agent interface that sees', text: 'MCP over HTTP and stdio, with 115 commands and queries in the registry. render_frame returns an image to the agent, export_start runs an export, agents can choose among several running engines, and result schemas describe what an agent really receives. Setup snippets for five clients are in Settings.', chip: 'Built · tested on Windows' },
  { title: 'Crash recovery', text: 'A journal replayed after a crash, autosave with ten backups, a supervisor that restarts the engine and resends unacknowledged commands once, and a restore dialog after an app kill. Opening a project never drops unsaved work unasked.', chip: 'Built · Windows only' },
  { title: 'A command line', text: 'cutweave engine, exec, query, commands, describe, mcp and render. The M1 gate compares exported frames with frames rendered by cutweave render from the saved project.', chip: 'Built · tested on Windows' },
  { title: 'The project model and format', text: 'Projects, sequences, tracks and clips in frame-exact flicks, addressed by ID, saved to an open folder format through a temp file, fsync and rename. Media folders are part of the project document.' },
  { title: 'Design system and editor shell', text: 'packages/ui has generated tokens, a contrast gate and Storybook with visual regression, and the shell has a dockable layout, themes and a hardened Electron window.' },
];

export interface NextItem {
  title: string;
  text: string;
  /** Work package ids, for the reader who wants to follow them. */
  wps: string;
  /** Number of work packages in the group. */
  n: number;
}

/** Still to merge in Phase 2: 56 of 82 work packages (docs/wbs/P2-core-editor.md minus the merge history). */
export const NEXT_IN_P2: NextItem[] = [
  { title: 'Timeline tools, clipboard and edit locks', text: 'The interaction state machine and the tools in the editor (razor, ripple, roll, slip, slide), copy and paste, replace clip, the snapping engine, a faster timeline renderer, source marks and three-point editing, edit-lock retry and on-screen feedback, and the Editing and Timeline settings.', wps: 'WP-2A.06 to 2A.14', n: 9 },
  { title: 'Compound clips and sequence tabs', text: 'Nested sequences as clips, background fill (color, blur, image), and tabs and a settings dialog for sequences.', wps: 'WP-2B.02 to 2B.05', n: 4 },
  { title: 'Keyframe lanes and the graph editor', text: 'Keyframe lanes on the timeline, a bezier graph editor, the shared wasm math module, and layouts for several clips: side by side, picture in picture, grids.', wps: 'WP-2C.05 to 2C.08', n: 4 },
  { title: 'Speed', text: 'Constant speed, reverse and freeze frame, with pitch-preserving audio.', wps: 'WP-2D.01, 2D.02', n: 2 },
  { title: 'Audio features', text: 'Track buses, a master limiter and meters, loudness normalization, extract audio, voiceover recording, auto-ducking, voice effects, the mixer UI and the Audio settings page.', wps: 'WP-2E.02 to 2E.08', n: 7 },
  { title: 'Media management', text: 'Proxy-aware source selection, relinking missing media, collect and archive, image and image-sequence import, and tags, ratings and collections.', wps: 'WP-2F.02 to 2F.06', n: 5 },
  { title: 'Export queue and codecs', text: 'A background export queue with range and marker-set export, the queue panel, HEVC, AV1, ProRes, GIF and audio-only, and advanced encode controls.', wps: 'WP-2G.02 to 2G.05', n: 4 },
  { title: 'Workspace UI', text: 'Inspector sections for audio, speed and sequence, project settings, the Appearance and Playback settings pages, detached panels in their own windows (decided in ADR-0031, now unblocked), and the human UX design review.', wps: 'WP-2H.03b, 2H.07 to 2H.10, 2H.14, 2H.15', n: 7 },
  { title: 'MCP core tool set', text: 'About 30 core tools, contact sheet, filmstrip and waveform images, expected_rev on every edit, tool profiles, and a scripted agent that edits a YouTube video and a 9:16 short over MCP only.', wps: 'WP-2I.01, 2I.02, 2I.04 to 2I.06', n: 5 },
  { title: 'Benchmarks, crash harness and the M2 exit', text: 'Benchmarks in CI, 20 forced crashes with no data loss, a background render cache, the two dogfood edits by a non-developer, and the M2 exit review.', wps: 'WP-2J.01 to 2J.09', n: 9 },
];

export interface MergedItem {
  wp: string;
  title: string;
  text: string;
  /** ISO date of the merge on the product repo's main branch. */
  date: string;
  /** Short hashes of the merge commits (or the commit, where the work landed without a merge commit). */
  commits: string[];
}

export interface MergedGroup {
  id: string;
  title: string;
  items: MergedItem[];
}

/**
 * Phase 2 work packages merged to the product repo's main branch, 25 and 26 November 2026, newest first within an
 * area. Source: `git log --first-parent` on origin/main (merge commits) 981e5a2..e129848, and docs/wbs/P2-core-editor.md
 * for titles. 26 work packages. WP-2H.02 landed as a commit (3416d54), WP-2H.11 through merge 838ce19.
 */
export const MERGED_P2: MergedGroup[] = [
  {
    id: 'timeline',
    title: 'Timeline editing',
    items: [
      { wp: 'WP-2A.05', title: 'Linked clips and groups', text: 'Link, unlink, attach to a main clip, detach. Members move, trim and delete together.', date: '2026-11-26', commits: ['2a6bc5f'] },
      { wp: 'WP-2A.04', title: 'Trim family', text: 'Trim, ripple trim, roll, slip and slide, clamped at media and neighbours, one undo step each.', date: '2026-11-25', commits: ['69c9075'] },
      { wp: 'WP-2A.03', title: 'Placement core', text: 'Insert, overwrite, move, lift, extract and ripple delete, with the Phase 2 MCP budget set.', date: '2026-11-25', commits: ['68bf40f'] },
      { wp: 'WP-2A.02', title: 'Model additions', text: 'The v2 timeline model: markers, in and out ranges, attached clips and track height, track reorder and magnetic commands, and a report of what each edit changed. Project format v2.', date: '2026-11-25', commits: ['8d01c08'] },
      { wp: 'WP-2A.01', title: 'Timeline edit semantics spec', text: 'A written spec with over 120 fixtures and a checker, accepted as ADR-0023.', date: '2026-11-25', commits: ['be7894e'] },
    ],
  },
  {
    id: 'sequences-keyframes',
    title: 'Sequences, keyframes and transforms',
    items: [
      { wp: 'WP-2B.01', title: 'Several sequences per project', text: 'Create, duplicate, rename and delete sequences. Aspect and frame-rate presets, and changing the format reframes and retimes the timeline.', date: '2026-11-26', commits: ['ccb2073'] },
      { wp: 'WP-2C.04', title: 'Render transforms', text: 'Position, scale, rotation, crop, flip, opacity and eight blend modes in the compositor. Preview and export are identical.', date: '2026-11-26', commits: ['4d0b926'] },
      { wp: 'WP-2C.03', title: 'Keyframe and property commands', text: 'Set, move, delete, ease, copy and paste keys. Crop, flip, blend mode and pan. Reset properties. Keys follow splits and trims.', date: '2026-11-26', commits: ['7046c35'] },
      { wp: 'WP-2C.02', title: 'Interpolation core', text: 'Every easing, bit-exact on native and wasm, with fast evaluation.', date: '2026-11-25', commits: ['01e9acc'] },
      { wp: 'WP-2C.01', title: 'Keyframe and easing spec', text: 'A written spec, a reference evaluator and test vectors, accepted as ADR-0024.', date: '2026-11-25', commits: ['66912db'] },
    ],
  },
  {
    id: 'audio-media',
    title: 'Audio, media and export',
    items: [
      { wp: 'WP-2E.01', title: 'Fades, volume and pan', text: 'Four fade curves, keyframed volume and pan, click-free. Preview and export mix the same.', date: '2026-11-26', commits: ['8597145'] },
      { wp: 'WP-2F.09', title: 'Import a folder', text: 'Import folder… and folder drops keep the folder structure, with progress, a summary and one undo step.', date: '2026-11-26', commits: ['cd4b1a1'] },
      { wp: 'WP-2F.08', title: 'Folders in the Media tab', text: 'Browse, breadcrumb, new folder, rename, drag to move, and delete with keep-media.', date: '2026-11-25', commits: ['434be89'] },
      { wp: 'WP-2F.07', title: 'Media folders', text: 'Nested folders in the project document, with create, rename, move and delete, all undoable (ADR-0020).', date: '2026-11-25', commits: ['eade087'] },
      { wp: 'WP-2F.01', title: 'Proxy generation', text: 'Background proxies for heavy media, a policy of auto, all or off, and jobs that pause while the preview is busy (ADR-0027).', date: '2026-11-25', commits: ['0bfe09d', '6e409bf'] },
      { wp: 'WP-2G.01', title: 'Export presets', text: 'A built-in preset pack and custom presets on top of a base, with rate control.', date: '2026-11-25', commits: ['2d365d6'] },
    ],
  },
  {
    id: 'workspace',
    title: 'Workspace UI',
    items: [
      { wp: 'WP-2H.06', title: 'Preview handles and guides', text: 'Move, scale, rotate and crop clips in the preview with snapping. Safe areas, thirds and grids. Fit, Fill and Center.', date: '2026-11-26', commits: ['e696360'] },
      { wp: 'WP-2H.03a', title: 'Inspector wiring', text: 'Sections built from the command schemas: transform, crop, flip, opacity and blend with keyframes, clip info and track. Several clips at once, and +10, *2 and 50% typed in number fields.', date: '2026-11-26', commits: ['671828f'] },
      { wp: 'WP-2H.13', title: 'Context menus', text: 'On the timeline, bin, tracks, preview and panels.', date: '2026-11-25', commits: ['9f7d1a8'] },
      { wp: 'WP-2H.12', title: 'Context-menu framework', text: 'Menus built from commands, per named surface, with keyboard support (ADR-0026).', date: '2026-11-25', commits: ['e77dc44'] },
      { wp: 'WP-2H.11', title: 'History panel', text: 'Every undo step and who made it, from Edit > History and the Undo and Redo menus.', date: '2026-11-25', commits: ['838ce19'] },
      { wp: 'WP-2H.05', title: 'Keyboard shortcuts', text: 'A keymap engine, NLE and CapCut presets, and a shortcut editor in Settings.', date: '2026-11-25', commits: ['0cbc2ad'] },
      { wp: 'WP-2H.04', title: 'Command palette', text: 'Ctrl+K: every command, fuzzy search, recent first, argument forms and settings rows.', date: '2026-11-25', commits: ['3bca87f'] },
      { wp: 'WP-2H.02', title: 'Schema-driven forms', text: 'The Inspector and dialogs render from the command schemas, with 35 widget fixtures and keyframe diamonds.', date: '2026-11-25', commits: ['3416d54'] },
      { wp: 'WP-2H.01', title: 'Close and reopen panels', text: 'Tab close, View > Panels, a closed set per workspace, an empty dock, and a Short-form suggestion for new projects.', date: '2026-11-25', commits: ['5388e09'] },
    ],
  },
  {
    id: 'agents',
    title: 'Agents',
    items: [
      { wp: 'WP-2I.03', title: 'Checkpoints', text: 'Saved restore points, journaled and carried over saves, so they survive crashes and reopening. edit.delete_checkpoint, and a checkpoint option on cutweave_execute.', date: '2026-11-25', commits: ['8d844e8'] },
    ],
  },
  {
    id: 'fixes',
    title: 'Fixes found by using the app',
    items: [
      { wp: 'Issue #143', title: 'Engine ready sooner under load', text: 'The app judges an engine start by liveness, not a fixed 10 s (ADR-0025).', date: '2026-11-25', commits: ['03050c2'] },
      { wp: 'Issue #146', title: 'MCP result schemas', text: 'cutweave_describe_command describes the shape an agent really gets, including untrusted-text wrappers and image blocks (ADR-0028).', date: '2026-11-25', commits: ['f89cdab'] },
      { wp: 'ADR-0029', title: 'Opening never drops unsaved work', text: 'Opening or closing a project with unsaved changes is refused unless you say so, and the app shows the open in progress.', date: '2026-11-25', commits: ['a6b550c'] },
      { wp: 'Issues #148, #165', title: 'Failed edits say so', text: 'After an engine restart a failed edit says so. Save As names an untitled project after its folder.', date: '2026-11-25', commits: ['7520ccb'] },
    ],
  },
];

/**
 * The end of Phase 1, 24 and 25 November 2026: real media, preview and export, then the M1 exit suite.
 * Source: `git log --first-parent` on origin/main (merge commits) 981e5a2..e129848 and docs/wbs/P1-skeleton.md.
 */
export const MERGED_P1_LATE: MergedGroup[] = [
  {
    id: 'acceptance',
    title: 'M1 acceptance',
    items: [
      { wp: 'WP-1O.04', title: 'M1 exit suite', text: 'just m1-gate: UI cut and 1080p export, a scripted MCP agent with a byte-identical export, 40 crash trials, golden frames and parity. Evidence in docs/milestones/m1-evidence.', date: '2026-11-25', commits: ['1215877'] },
      { wp: 'Demo', title: 'Recorded M1 run', text: 'just m1-demo records the M1 UI run as a video. It is the clip on the home page.', date: '2026-11-25', commits: ['b0d7281'] },
      { wp: 'WP-1O.01', title: 'Golden-frame infrastructure', text: 'Reference frames for the software, NVIDIA and AMD adapters, with a negative test that must fail.', date: '2026-11-25', commits: ['d97d283'] },
      { wp: 'WP-1O.05', title: 'User-flow end-to-end suite', text: 'Flows driven like a person: real input, real dialogs (ADR-0018).', date: '2026-11-24', commits: ['7ef8da2'] },
      { wp: 'WP-1O.03', title: 'MCP conformance suite', text: 'Stdio and HTTP, both MCP revisions, live output-schema validation and a scripted agent.', date: '2026-11-24', commits: ['8a0372b'] },
      { wp: 'WP-1O.02', title: 'CLI = MCP = RPC parity', text: 'Byte-identical documents across four surfaces, and every registry entry reachable.', date: '2026-11-23', commits: ['341564c'] },
    ],
  },
  {
    id: 'media-export',
    title: 'Real media, preview and export',
    items: [
      { wp: 'WP-1I.05', title: 'Engine wiring', text: 'FFmpeg media, the wgpu compositor, audio and playback attached to the engine and the preview ring. media.capabilities.', date: '2026-11-24', commits: ['04346d8'] },
      { wp: 'WP-1D.04', title: 'Hardware decode', text: 'NVDEC and D3D11VA (and, unrun here, VideoToolbox and VA-API) on the CPU-upload path, with a transparent software fallback.', date: '2026-11-24', commits: ['bf26fec'] },
      { wp: 'WP-1E.03b', title: 'Hardware encoders in export', text: 'export.start takes hw auto, off or a forced encoder, and restarts in software from frame 0 if a hardware encoder fails mid-export.', date: '2026-11-24', commits: ['fe05661'] },
      { wp: 'WP-1D.05', title: 'Frame cache and thumbnails', text: 'A RAM frame cache, JPEG thumbnails and filmstrips in a size-capped disk cache, and a prefetch job.', date: '2026-11-24', commits: ['479cab8'] },
      { wp: 'WP-1D.06', title: 'Waveforms', text: 'Waveform peaks with a level-of-detail pyramid and PNG rendering.', date: '2026-11-24', commits: ['851ec43'] },
      { wp: 'WP-1E.02', title: 'Hardware encoders', text: 'NVENC, AMF, QSV, VideoToolbox and VA-API behind one setting, with a software fallback.', date: '2026-11-24', commits: ['b9ecca4'] },
      { wp: 'WP-1E.03', title: 'Export job', text: 'export.start renders each frame like render.frame, mixes audio offline at 48 kHz stereo, and encodes. Cancel removes the partial file.', date: '2026-11-24', commits: ['9d154bb'] },
      { wp: 'WP-1D.03', title: 'Frame-exact seek', text: '500 of 500 seeks exact on every corpus file and generated edge clip: 4K long-GOP H.264, HEVC 10-bit, ProRes, variable frame rate, open GOP.', date: '2026-11-24', commits: ['dcbc215'] },
      { wp: 'WP-1E.01', title: 'Software H.264 and AAC', text: 'x264 with CRF or bitrate, native AAC, BT.709 tags, faststart and exact 30 fps constant frame rate. Cancel supported.', date: '2026-11-24', commits: ['affb4b3'] },
      { wp: 'WP-1D.02', title: 'FFmpeg probe', text: 'Streams, duration, variable frame rate, rotation and color tags, checked against ffprobe on the corpus.', date: '2026-11-24', commits: ['abcd2b8'] },
      { wp: 'S3', title: 'Spike S3 on Windows', text: 'Frame-exact seek 500/500 on 16 generated files, and NVDEC and D3D11VA bit-exact on 18 files. ADR-0003 accepted with a fallback.', date: '2026-11-24', commits: ['add5052', 'def3767'] },
      { wp: 'WP-1D.01', title: 'Media backend trait', text: 'probe, decoders, encoder and capabilities behind one trait, with a fake backend for tests.', date: '2026-11-24', commits: ['e1cb9a2'] },
      { wp: 'WP-1H.04', title: 'Source preview', text: 'The preview plays a media item outside any sequence (ADR-0022).', date: '2026-11-25', commits: ['bee6245'] },
      { wp: 'WP-1H.01', title: 'Transport and A/V sync', text: 'Play, pause, scrub, step and J K L, with exact latest-wins scrubbing.', date: '2026-11-24', commits: ['a95ffdf'] },
    ],
  },
  {
    id: 'editor-agents',
    title: 'Editor, settings and agents',
    items: [
      { wp: 'WP-1M.15', title: 'Source view in the Preview', text: 'Its own timecode, Insert, Back to timeline, and play from bin cards and the Inspector.', date: '2026-11-25', commits: ['020a8b5'] },
      { wp: 'WP-1M.14', title: 'Hover-scrub on bin cards', text: 'A scrubbable picture in the bin and the Inspector, and a Media and import settings page.', date: '2026-11-25', commits: ['2b62679'] },
      { wp: 'WP-1J.05', title: 'Settings for agents and MCP', text: 'Folders agents may use, and copyable setups for each client.', date: '2026-11-25', commits: ['1a4855c'] },
      { wp: 'WP-1D.08', title: 'Cache and hardware settings', text: 'Settings pages for cache and storage, and for performance and hardware.', date: '2026-11-24', commits: ['1a57fe4'] },
      { wp: 'WP-1M.13', title: 'Export and shortcut settings', text: 'Export defaults and a shortcuts page. File > Export… starts an export.', date: '2026-11-24', commits: ['bc246a9'] },
      { wp: 'WP-1M.11', title: 'Settings framework', text: 'One preferences file with a shared schema, tabbed pages with search, reset, import and export.', date: '2026-11-24', commits: ['14b6e81'] },
      { wp: 'WP-1J.04', title: 'Agents choose an engine', text: 'Several engines can run at once. An agent picks by project, or the focused window (ADR-0021).', date: '2026-11-24', commits: ['18552cd'] },
      { wp: 'WP-1J.02', title: 'render_frame over MCP', text: 'A frame as MCP image content, up to 1 MB, with resource links for larger ones.', date: '2026-11-24', commits: ['6cdf63d'] },
      { wp: 'WP-1I.03', title: 'Media over HTTP', text: 'Thumbnails, filmstrips, waveforms and frames at signed, expiring URLs. The editor shows real ones.', date: '2026-11-24', commits: ['c668426'] },
      { wp: 'WP-1M.12', title: 'Find media in the bin', text: 'Search, filters and sort, shared with the engine’s media.list.', date: '2026-11-24', commits: ['74ae37b'] },
      { wp: 'WP-1M.10', title: 'Autosave settings', text: 'A Saving page and a save-status indicator.', date: '2026-11-24', commits: ['54dfb3c'] },
      { wp: 'WP-1M.08', title: 'Export dialog', text: 'File > Export…, progress with fps and ETA, cancel, and reveal in folder.', date: '2026-11-24', commits: ['3536da5'] },
      { wp: 'WP-1M.09', title: 'Custom title bar', text: 'OS-drawn window controls and an in-app menu bar on Windows and Linux.', date: '2026-11-24', commits: ['eaec2df'] },
      { wp: 'WP-1M.07', title: 'Inspector, undo, save and open', text: 'Clip properties, undo and redo in the UI, save, open, save as, recent projects and a window-close guard.', date: '2026-11-24', commits: ['caaf900'] },
      { wp: 'WP-1M.04', title: 'Preview panel', text: 'A WebGPU presenter on the shared-memory ring, with a JPEG fallback.', date: '2026-11-24', commits: ['0dda193'] },
      { wp: 'ADR-0019', title: 'Undo covers every actor', text: 'The editor’s Undo and Redo act on anyone’s latest change, labelled with who made it.', date: '2026-11-24', commits: ['c29a123'] },
    ],
  },
];

/**
 * Phase 1 work packages merged between Phase 0 closing and 23 November 2026, kept from the previous update.
 * Source: `git log --first-parent` on the product repo's main branch (merge commits), 6ca1af7..7728d7c, plus
 * docs/wbs/P1-skeleton.md for titles. 28 work packages. Some of what these say is not built has since been built.
 */
export const MERGED_P1_EARLY: MergedGroup[] = [
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

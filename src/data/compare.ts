// SPDX-License-Identifier: GPL-3.0-or-later
// Comparison rows. Source: docs/content-inventory.md section 4 (derived from docs/03-feature-parity.md in the main repo).
// CapCut statements are limited to what the inventory lists. The Cutweave column is the 1.0 plan, not what exists.

export type CellStatus = 'built' | 'in-progress' | 'planned' | 'later' | 'not-planned';

export type GroupId =
  | 'ownership'
  | 'editing'
  | 'captions'
  | 'effects'
  | 'ai'
  | 'agents'
  | 'extensibility'
  | 'platforms';

export interface CompareRow {
  id: string;
  group: GroupId;
  /** What a creator cares about. */
  topic: string;
  /** What CapCut does, as listed in the inventory. */
  capcut: string;
  cutweave: {
    status: CellStatus;
    /** Phase or milestone for planned items, e.g. "P2" or "M1". Shown in the chip. */
    phase?: string;
    text: string;
  };
  /** Shown in the landing-page teaser (6-8 high-signal rows). */
  teaser?: boolean;
}

export const AS_OF = 'November 2026';
export const AS_OF_ISO = '2026-11';

export const GROUPS: { id: GroupId; title: string }[] = [
  { id: 'ownership', title: 'Ownership and privacy' },
  { id: 'editing', title: 'Editing' },
  { id: 'captions', title: 'Captions and text' },
  { id: 'effects', title: 'Effects and color' },
  { id: 'ai', title: 'AI' },
  { id: 'agents', title: 'Agents and automation' },
  { id: 'extensibility', title: 'Extensibility' },
  { id: 'platforms', title: 'Platforms and publishing' },
];

export const ROWS: CompareRow[] = [
  // Ownership and privacy
  { id: 'account', group: 'ownership', topic: 'Account required', capcut: 'Yes', teaser: true,
    cutweave: { status: 'planned', phase: 'P1', text: 'No account. No telemetry by default.' } },
  { id: 'price', group: 'ownership', topic: 'Price and tiers', capcut: 'Free tier, Pro paywall',
    cutweave: { status: 'built', text: 'No tiers. The core is GPL-3.0, and the license is in the repo today.' } },
  { id: 'watermark', group: 'ownership', topic: 'Export watermark', capcut: 'Yes, on some paths', teaser: true,
    cutweave: { status: 'planned', phase: 'M1', text: 'None. There is no paid tier to gate it behind.' } },
  { id: 'resolution', group: 'ownership', topic: 'Export resolution limits', capcut: 'Tier-gated',
    cutweave: { status: 'planned', phase: 'P2', text: 'Up to 4K and beyond, with no gating.' } },
  { id: 'offline', group: 'ownership', topic: 'Offline use', capcut: 'Needs an account and internet for AI',
    cutweave: { status: 'planned', phase: 'P5', text: 'Local-first. Local AI arrives as a plugin.' } },
  { id: 'format', group: 'ownership', topic: 'Project format', capcut: 'Proprietary draft', teaser: true,
    cutweave: { status: 'built', text: 'Open JSON folder, with atomic save. OpenTimelineIO import and export is planned for P6.' } },
  { id: 'crash', group: 'ownership', topic: 'Crash safety', capcut: 'Local drafts',
    cutweave: { status: 'in-progress', phase: 'P1', text: 'Journal replay and rotating backups. Atomic save is built; the journal is not.' } },
  { id: 'cloud', group: 'ownership', topic: 'Cloud storage and team spaces', capcut: 'Yes',
    cutweave: { status: 'not-planned', text: 'Deliberately not offered. Use any synced folder. Collaboration is a later question.' } },

  // Editing
  { id: 'multitrack', group: 'editing', topic: 'Multi-track, magnetic main track, snapping', capcut: 'Yes',
    cutweave: { status: 'planned', phase: 'P2', text: 'Yes.' } },
  { id: 'ripple', group: 'editing', topic: 'Ripple, roll, slip, slide', capcut: 'Partial',
    cutweave: { status: 'planned', phase: 'P2', text: 'Yes.' } },
  { id: 'keyframes', group: 'editing', topic: 'Keyframes and graph editor', capcut: 'Yes',
    cutweave: { status: 'planned', phase: 'P2', text: 'Yes.' } },
  { id: 'compound', group: 'editing', topic: 'Compound clips', capcut: 'Yes',
    cutweave: { status: 'planned', phase: 'P2', text: 'Yes, as nested sequences.' } },
  { id: 'multicam', group: 'editing', topic: 'Multicam', capcut: 'Pro',
    cutweave: { status: 'later', text: 'After 1.0.' } },

  // Captions and text
  { id: 'captions', group: 'captions', topic: 'Auto captions', capcut: 'Yes (account, and credits for some)',
    cutweave: { status: 'planned', phase: 'P3', text: 'Cloud or local whisper.cpp, offline-capable and free.' } },
  { id: 'caption-styles', group: 'captions', topic: 'Caption styles, karaoke, keyword highlight', capcut: 'Large library',
    cutweave: { status: 'planned', phase: 'P3', text: 'At least 25 styles. CapCut’s library is larger.' } },
  { id: 'text-editing', group: 'captions', topic: 'Text-based editing, filler and silence removal', capcut: 'Yes',
    cutweave: { status: 'planned', phase: 'P3', text: 'Yes, with a review step before anything is cut.' } },
  { id: 'templates', group: 'captions', topic: 'Animated text and templates', capcut: 'Large marketplace',
    cutweave: { status: 'planned', phase: 'P6', text: 'At least 30 first-party templates, an open index and no revenue share. Far fewer than CapCut.' } },

  // Effects and color
  { id: 'effects', group: 'effects', topic: 'Effects and transitions', capcut: 'Hundreds', teaser: true,
    cutweave: { status: 'planned', phase: 'P4', text: 'At least 50 effects and 40 transitions, plus plugins. The count gap is real.' } },
  { id: 'filters', group: 'effects', topic: 'Filters and LUTs', capcut: 'Yes',
    cutweave: { status: 'planned', phase: 'P4', text: 'At least 40, plus .cube import.' } },
  { id: 'color', group: 'effects', topic: 'Color: wheels, curves, scopes', capcut: 'Some Pro-locked',
    cutweave: { status: 'planned', phase: 'P4', text: 'All of it, scopes included, with no lock.' } },
  { id: 'masks', group: 'effects', topic: 'Masks and chroma key', capcut: 'Yes',
    cutweave: { status: 'planned', phase: 'P4', text: 'Yes.' } },
  { id: 'tracking', group: 'effects', topic: 'Stabilization and motion tracking', capcut: 'Yes',
    cutweave: { status: 'planned', phase: 'P4', text: 'Yes, in a basic form.' } },

  // AI
  { id: 'reframe', group: 'ai', topic: 'Auto reframe and background removal', capcut: 'Yes',
    cutweave: { status: 'planned', phase: 'P5', text: 'Yes, in the cloud or locally with ONNX.' } },
  { id: 'generation', group: 'ai', topic: 'AI image and video generation', capcut: 'Closed models, credits', teaser: true,
    cutweave: { status: 'planned', phase: 'P5', text: 'Any leading model through your own keys. The cost is shown before it runs.' } },
  { id: 'voice', group: 'ai', topic: 'Text to speech, voice changer, dubbing, translation', capcut: 'Yes',
    cutweave: { status: 'planned', phase: 'P5', text: 'Yes, in the cloud, with a local text-to-speech fallback.' } },
  { id: 'upscale', group: 'ai', topic: 'Upscale and frame interpolation', capcut: 'Yes',
    cutweave: { status: 'planned', phase: 'P5', text: 'Yes.' } },
  { id: 'shorts', group: 'ai', topic: 'Long video to shorts', capcut: 'Yes',
    cutweave: { status: 'planned', phase: 'P5', text: 'Yes. This is a headline feature of the plan.' } },
  { id: 'stock', group: 'ai', topic: 'Stock library', capcut: 'Built in',
    cutweave: { status: 'planned', phase: 'P5', text: 'Pexels and Pixabay-class search, with the license shown per asset.' } },
  { id: 'assistant', group: 'ai', topic: 'Natural-language edit assistant', capcut: 'EditPilot (credits)',
    cutweave: { status: 'planned', phase: 'P6', text: 'A built-in copilot, or any MCP agent you already use.' } },

  // Agents and automation
  { id: 'mcp', group: 'agents', topic: 'Drive it from an external agent', capcut: 'One ChatGPT plugin', teaser: true,
    cutweave: { status: 'in-progress', phase: 'P1', text: 'Full MCP: every command is a tool. A spike passed; the production server is under way.' } },
  { id: 'cli', group: 'agents', topic: 'Headless and command-line rendering', capcut: 'None',
    cutweave: { status: 'planned', phase: 'P1–P2', text: 'cutweave render, from the same binary as the editor.' } },

  // Extensibility
  { id: 'plugins', group: 'extensibility', topic: 'Plugins', capcut: 'None on desktop', teaser: true,
    cutweave: { status: 'planned', phase: 'P6', text: 'Data, GPU, TypeScript, WASM and UI layers, through a signed index.' } },

  // Platforms and publishing
  { id: 'maturity', group: 'platforms', topic: 'Maturity', capcut: 'A finished, polished product',
    cutweave: { status: 'in-progress', text: 'Pre-alpha. No download yet. Phase 1 of 7.' } },
  { id: 'platforms', group: 'platforms', topic: 'Platforms', capcut: 'Windows, Mac, mobile and web', teaser: true,
    cutweave: { status: 'planned', phase: 'P3', text: 'Windows, macOS and Linux desktop. Unsigned alpha builds in P3, signed installers in P7.' } },
  { id: 'mobile', group: 'platforms', topic: 'Mobile app, AI avatars, face and AR effects, beauty', capcut: 'Yes',
    cutweave: { status: 'later', text: 'Not in 1.0.' } },
  { id: 'upload', group: 'platforms', topic: 'Direct upload', capcut: 'Yes',
    cutweave: { status: 'planned', phase: 'P6', text: 'YouTube. TikTok may slip.' } },
];

export const CAPCUT_BETTER: { title: string; text: string }[] = [
  { title: 'It is a finished app', text: 'CapCut ships on desktop, mobile and web today. Cutweave is a pre-alpha project with nothing to download.' },
  { title: 'A far larger library', text: 'CapCut has hundreds of effects and a large template marketplace. Cutweave plans fewer, and plugins to close the gap over time.' },
  { title: 'Generation is bundled', text: 'CapCut includes AI generation in the app. Cutweave will ask you to bring your own provider keys.' },
  { title: 'Polish', text: 'CapCut is a finished product. Cutweave has a design system and an editor shell, and no working editor yet.' },
];

export const DIFFERENCES: { title: string; text: string; status: CellStatus; phase?: string; statusLabel?: string }[] = [
  { title: 'No account, no watermark', text: 'You open the app and edit. Exports carry nothing of ours.', status: 'planned', phase: 'P1' },
  { title: 'An open project format', text: 'A folder with a JSON document, a journal and backups, documented so other tools can read it.', status: 'built', statusLabel: 'Built · format' },
  { title: 'Your keys instead of credits', text: 'You pay providers directly. The cost is shown before anything runs.', status: 'planned', phase: 'P5' },
  { title: 'MCP first', text: 'Every command is a tool, so an agent you already use can edit the same timeline you do.', status: 'in-progress', phase: 'P1' },
  { title: 'Plugins at every layer', text: 'Data packs, GPU effects, compositions, WASM and UI panels. Built-in features use the same interfaces.', status: 'planned', phase: 'P6' },
  { title: 'Undo per actor', text: 'You can undo the agent’s last change without touching yours. Command logs can be replayed.', status: 'built', statusLabel: 'Built · library only' },
  { title: 'A headless CLI', text: 'Render from a script or a server with the same binary as the editor.', status: 'planned', phase: 'P1–P2' },
];

export const NOT_YET: { title: string; text: string }[] = [
  { title: 'Anyone who needs a working editor today', text: 'You cannot import, play or export a video in Cutweave yet. Use CapCut, Kdenlive or Shotcut for real work.' },
  { title: 'People who edit on a phone', text: 'A mobile app is not in 1.0.' },
  { title: 'People who rely on the template marketplace', text: 'Cutweave plans at least 30 first-party templates. That is not a marketplace.' },
  { title: 'Teams that need cloud collaboration', text: 'Cloud storage and team spaces are deliberately not offered. Real-time collaboration is a later question.' },
];

export const GLOSSARY: { capcut: string; cutweave: string }[] = [
  { capcut: 'Draft', cutweave: 'Project' },
  { capcut: 'Track Magnet', cutweave: 'Magnetic main track' },
  { capcut: 'Auto cutout', cutweave: 'Matting' },
  { capcut: 'AI credits', cutweave: 'Provider cost estimates, paid to the provider with your key' },
  { capcut: 'Pro, or a watermark', cutweave: 'None. There are no tiers.' },
];

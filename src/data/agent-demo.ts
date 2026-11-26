// SPDX-License-Identifier: GPL-3.0-or-later
/**
 * Script for the "Watch an agent edit" demo (components/demo/AgentDemo.astro).
 *
 * ILLUSTRATIVE. The tool names are real or planned (the MCP catalog in src/data/mcp-tools.ts): project_info,
 * media_list, cutweave_execute, render_frame and export_start exist today; caption_generate, caption_style,
 * render_contact_sheet and the silence.remove, filler.remove and caption.generate steps are planned. The contact sheet
 * here is "of the proposed cut": render_frame renders the committed document only, so previewing an open proposal is planned. Every value
 * (ids, counts, durations, costs) is invented, and the proposal flow is the plan. Costs use the brand format
 * "~$0.04 · <model> via <provider>" with provider names from the inventory (section 6.2).
 *
 * GAP-03: this stays illustrative because captions, silence removal and the proposal and cost flow are planned.
 * A real recorded session with real media, a rendered frame and an export is in src/data/mcp-real-run.json
 * (scripts/capture-mcp-run.mjs). Replace this file with a generated transcript when those exist. Keep the shape
 * below and the component needs no change:
 * a run recorder only has to emit `DemoScript` (steps of transcript entries, each with the timeline state after it).
 * The Phase 0 spike ran a real four-call version with frames: 3 of 3 runs, no screenshots
 * (spikes/s5-command-bus/AGENT-RUN-REPORT.md in the main repo).
 */

// ---------- Transcript entries ----------

/** The person's request, typed in any MCP client. Not agent content. */
export interface UserEntry {
  type: 'user';
  client: string;
  text: string;
}
/** A line of agent prose. */
export interface AgentEntry {
  type: 'agent';
  text: string;
}
/** A tool call: tool name plus short JSON args (one line, for display). */
export interface CallEntry {
  type: 'call';
  tool: string;
  args: string;
}
/** A short text result. `cost` renders as an AI cost chip in the brand format. */
export interface ResultEntry {
  type: 'result';
  text: string;
  cost?: string;
}
/** An MCP image block: a contact sheet of small frames (pose picks the drawn frame, time labels it). */
export interface ImageEntry {
  type: 'image';
  mime: string;
  alt: string;
  caption: string;
  frames: { pose: number; time: string }[];
}
export type Entry = UserEntry | AgentEntry | CallEntry | ResultEntry | ImageEntry;

// ---------- Timeline state ----------

/**
 * What the timeline shows after a step.
 *  - silences: 'none' original clip, 'detected' dashed outlines only (dry run, nothing proposed yet),
 *    'ghost' dashed hatched agent-blue regions (open proposal), 'committed' removed and rippled (accepted)
 *  - captions: 'none', 'ghost' (proposed), 'solid' (accepted)
 */
export interface TimelineState {
  silences: 'none' | 'detected' | 'ghost' | 'committed';
  captions: 'none' | 'ghost' | 'solid';
}

export interface DemoStep {
  id: string;
  /** Polite live-region text announced when the step is reached. */
  summary: string;
  /** Text description of the timeline after this step (the visual itself is aria-hidden). */
  timelineSummary: string;
  entries: Entry[];
  timeline: TimelineState;
  /** Autoplay dwell on this step, ms (default 2800). */
  dwell?: number;
}

export interface DemoProposal {
  id: string;
  /** Brand-book phrasing, shown verbatim in the proposal bar. */
  title: string;
  changes: number;
  /** Cost line: brand format. */
  cost: string;
  budget: string;
  actor: string;
  undoSteps: number;
  historyText: string;
  rejectText: string;
}

export interface DemoScript {
  id: string;
  sequence: { name: string; before: string; after: string };
  steps: DemoStep[];
  proposal: DemoProposal;
  /** Cuts over the original clip, percent of its duration, sorted and non-overlapping. */
  cuts: Cut[];
  /** Caption texts laid over the cut timeline, in order. */
  captions: string[];
}

// ---------- Cuts (deterministic, so builds are reproducible) ----------

export interface Cut {
  kind: 'silence' | 'filler';
  start: number;
  len: number;
}

/**
 * 23 cuts: 14 silences (sum 19.6% of the clip) and 9 filler words (sum 3.15%).
 * 11:42 x 22.75% = 2:40, so the sequence goes from 11:42 to 9:02.
 */
function buildCuts(): Cut[] {
  const silences = [1.8, 1.2, 1.5, 1.1, 2.0, 1.3, 1.6, 1.0, 1.4, 1.7, 1.2, 1.5, 1.1, 1.2];
  const fillers = [0.4, 0.3, 0.35, 0.4, 0.3, 0.35, 0.4, 0.3, 0.35];
  const first = 3; // lead-in before the first cut, percent
  const slot = 96 / 23;
  const cuts: Cut[] = [];
  let si = 0;
  let fi = 0;
  for (let i = 0; i < 23; i++) {
    const isFiller = i % 5 === 2 || i % 5 === 4;
    const len = (isFiller ? fillers[fi++] : silences[si++]) ?? 0;
    const jitter = ((i * 7) % 13) / 13;
    const offset = 0.5 + jitter * (slot - len - 1);
    cuts.push({ kind: isFiller ? 'filler' : 'silence', start: first + i * slot + offset, len });
  }
  return cuts;
}

const cuts = buildCuts();

// ---------- The script ----------

export const agentDemo: DemoScript = {
  id: 'cut-and-caption',
  sequence: { name: 'interview_A', before: '11:42', after: '9:02' },
  cuts,
  captions: [
    'So here is the thing',
    'nobody told me',
    'the edit was the easy part',
    'the hard part was',
    'knowing what to cut',
    'and what to keep',
    'I used to cut by ear',
    'now I read the waveform',
    'every pause has a job',
    'some of them are dead air',
    'and those can go',
    'the rest is rhythm',
  ],
  proposal: {
    id: 'prop_7f3a',
    title: 'Agent proposes 6 changes: remove 14 silences, add captions',
    changes: 6,
    cost: '~$0.04 · Scribe via ElevenLabs',
    budget: 'Within your $1.00 agent budget',
    actor: 'agent:claude-code',
    undoSteps: 1,
    historyText: 'Removed 14 silences and 9 fillers, added captions. 11:42 to 9:02.',
    rejectText: 'Proposal rejected. Rolled back; nothing in your project changed.',
  },
  steps: [
    {
      id: 'ask',
      summary: 'You ask for the dead air cut and captions, under $1.',
      timelineSummary: 'Timeline: one interview clip, 11 minutes 42 seconds, with its audio below.',
      timeline: { silences: 'none', captions: 'none' },
      entries: [
        {
          type: 'user',
          client: 'any MCP client',
          text: 'Cut the dead air from this interview and caption it for Shorts. Keep it under $1.',
        },
        { type: 'agent', text: 'I will look at the project and its media first.' },
      ],
    },
    {
      id: 'inspect',
      summary: 'The agent reads the project and finds the interview.',
      timelineSummary: 'Timeline unchanged: one interview clip with its audio.',
      timeline: { silences: 'none', captions: 'none' },
      entries: [
        { type: 'call', tool: 'project_info', args: '{}' },
        { type: 'result', text: 'Harbor interview · 1 sequence · rev 41 · 30 fps' },
        { type: 'call', tool: 'media_list', args: '{}' },
        { type: 'result', text: 'med_3k9x interview_A.mov · 11:42 · speech detected' },
      ],
    },
    {
      id: 'estimate',
      summary: 'The agent asks what captions cost. Nothing has run yet.',
      timelineSummary: 'Timeline unchanged. No captions yet.',
      timeline: { silences: 'none', captions: 'none' },
      entries: [
        {
          type: 'call',
          tool: 'caption_generate',
          args: '{ "media": "med_3k9x", "language": "en" }',
        },
        {
          type: 'result',
          text: 'Estimate only, nothing ran. confirm_token issued.',
          cost: '~$0.04 · Scribe via ElevenLabs',
        },
        { type: 'agent', text: 'Well under $1. A dry run of the cuts next.' },
      ],
    },
    {
      id: 'dry-run',
      summary: 'A dry run finds 14 silences and 9 fillers. Nothing changed.',
      timelineSummary: 'Timeline: 14 silences and 9 filler words outlined with dashed lines on the interview clip. Nothing is removed.',
      timeline: { silences: 'detected', captions: 'none' },
      entries: [
        {
          type: 'call',
          tool: 'cutweave_execute',
          args: '{ "dry_run": true, "steps": [{ "cmd": "silence.remove" }, { "cmd": "filler.remove" }] }',
        },
        { type: 'result', text: 'Dry run: remove 14 silences (2:11) and 9 fillers (0:29). Saves 2:40. Nothing changed.' },
      ],
    },
    {
      id: 'checkpoint',
      summary: 'The agent saves a checkpoint before cutting.',
      timelineSummary: 'Timeline unchanged; the dashed outlines remain.',
      timeline: { silences: 'detected', captions: 'none' },
      entries: [
        {
          type: 'call',
          tool: 'cutweave_execute',
          args: '{ "steps": [{ "cmd": "edit.checkpoint", "args": { "name": "before-cuts" } }] }',
        },
        { type: 'result', text: 'Checkpoint before-cuts saved at rev 41.' },
      ],
    },
    {
      id: 'propose',
      summary: 'The agent opens a proposal. The changes appear as ghosts, not applied.',
      timelineSummary:
        'Timeline: the 14 silences and 9 fillers are dashed, hatched agent-blue ghost regions on the interview clip and its audio. A captions track appears as a dashed proposal. Nothing is applied yet.',
      timeline: { silences: 'ghost', captions: 'ghost' },
      dwell: 3400,
      entries: [
        {
          type: 'call',
          tool: 'cutweave_execute',
          args: '{ "expected_rev": 41, "steps": [{ "cmd": "silence.remove" }, { "cmd": "filler.remove" }, { "cmd": "caption.generate" }] }',
        },
        { type: 'result', text: 'Proposal prop_7f3a open · 6 changes · interview_A soft-locked · not applied.' },
        { type: 'agent', text: 'Proposed, not applied. Checking it visually before you see it.' },
      ],
    },
    {
      id: 'review',
      summary: 'The agent checks the proposed cut in a contact sheet of rendered frames.',
      timelineSummary: 'Timeline unchanged: ghost regions and proposed captions.',
      timeline: { silences: 'ghost', captions: 'ghost' },
      dwell: 3400,
      entries: [
        { type: 'call', tool: 'render_contact_sheet', args: '{ "frames": 6, "proposal": "prop_7f3a" }' },
        {
          type: 'image',
          mime: 'image/jpeg',
          alt: 'Contact sheet of six rendered frames from the proposed cut, each showing the interviewee with a caption.',
          caption: 'image/jpeg · 6 frames · captions on screen: 6 of 6',
          frames: [
            { pose: 0, time: '0:00' },
            { pose: 1, time: '1:48' },
            { pose: 2, time: '3:31' },
            { pose: 3, time: '5:12' },
            { pose: 4, time: '6:55' },
            { pose: 5, time: '8:40' },
          ],
        },
        { type: 'agent', text: 'Cuts land between breaths and no word is clipped.' },
      ],
    },
    {
      id: 'style',
      summary: 'The agent styles the captions. A proposal is waiting for you.',
      timelineSummary:
        'Timeline: ghost regions and proposed captions. A proposal bar above the timeline reads: Agent proposes 6 changes, remove 14 silences, add captions. Accept or reject.',
      timeline: { silences: 'ghost', captions: 'ghost' },
      dwell: 3600,
      entries: [
        { type: 'call', tool: 'caption_style', args: '{ "style": "shorts-bold" }' },
        { type: 'result', text: 'Style applied to the proposed captions.' },
        { type: 'agent', text: 'Ready for review in Cutweave. Accept or reject; your own edits stay untouched.' },
      ],
    },
  ],
};

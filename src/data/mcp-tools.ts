// SPDX-License-Identifier: GPL-3.0-or-later
// The MCP catalog. The built tools are the 18 that `tools/list` returned from the engine's standard profile
// (`cutweave mcp --headless`; see docs/captures/ and src/data/mcp-real-run.json). Which of them the minimal
// profile lists comes from the product repo's tools/list snapshots (crates/cutweave-api/tests/snapshots).
// The commands reached through `cutweave_execute` are the "catalog" rows of docs/reference/commands.md.
// Planned names are from docs/01-architecture.md section 14 and the work breakdown, with the work package
// or phase that adds them.
// GAP-08: replace the hand-kept lists with a link to the generated command reference once it is published.

export interface McpTool {
  name: string;
  /** One line, plain. The engine's own description, lightly shortened. */
  does: string;
  /** Also listed on the minimal profile (`--profile minimal`). */
  minimal?: boolean;
  /** Returns an image block plus structured metadata. */
  image?: boolean;
  /** Planned tools: the work package or phase that adds them. */
  when?: string;
}

export interface McpToolGroup {
  id: string;
  title: string;
  tools: McpTool[];
}

/** Listed by `tools/list` today on the standard profile (14 tools). */
export const CORE_TOOL_GROUPS: McpToolGroup[] = [
  {
    id: 'project',
    title: 'Project',
    tools: [
      { name: 'project_open', does: 'Open a project folder or .cutweave file.' },
      { name: 'project_info', does: 'Get project name, default format and a summary of its sequences.', minimal: true },
    ],
  },
  {
    id: 'media',
    title: 'Media',
    tools: [
      { name: 'media_import', does: 'Import media files: probe and register them now, return media ids and analysis job ids.' },
      { name: 'media_list', does: 'List the project’s media, paged.', minimal: true },
    ],
  },
  {
    id: 'timeline',
    title: 'Timeline and clips',
    tools: [
      { name: 'timeline_get', does: 'Get a sequence: summary, tracks, or tracks with items.', minimal: true },
      { name: 'timeline_insert', does: 'Insert a media clip at a time on a track. Video with sound adds linked audio.' },
      { name: 'clip_split', does: 'Split a clip, and its linked partners, at a timeline time.' },
      { name: 'clip_trim', does: 'Trim the start or end edge of a clip. No ripple.' },
      { name: 'item_move', does: 'Move an item in time or to another track. Linked partners follow.' },
      { name: 'item_delete', does: 'Delete items and their linked partners. No ripple.' },
      { name: 'item_set_props', does: 'Set an item’s name, enabled, opacity, audio gain or transform.' },
    ],
  },
  {
    id: 'jobs',
    title: 'Jobs',
    tools: [
      { name: 'job_status', does: 'Get a background job’s state, progress and error.' },
      { name: 'job_wait', does: 'Wait up to 60 s for a background job to finish.', minimal: true },
    ],
  },
  {
    id: 'history',
    title: 'History',
    tools: [{ name: 'edit_undo', does: 'Undo your last change, or another actor’s.', minimal: true }],
  },
];

/** The four generic tools. All listed on both profiles. */
export const GENERIC_TOOLS: McpTool[] = [
  { name: 'cutweave_search_commands', does: 'Find commands and queries by keyword, including ones not listed as tools.', minimal: true },
  { name: 'cutweave_describe_command', does: 'Get one command’s docs, annotations and full input and output schemas.', minimal: true },
  {
    name: 'cutweave_execute',
    does: 'Run commands as one all-or-nothing transaction and one undo step. Takes dry_run and expected_rev; steps can reference earlier results with $ref.',
    minimal: true,
  },
  { name: 'cutweave_query', does: 'Run a read-only query by name, such as item.get or edit.history.', minimal: true },
];

/** Commands the engine registers that are not tools. Run them with `cutweave_execute` (or `cutweave_query` for reads). */
export const CATALOG_COMMAND_GROUPS: { id: string; title: string; commands: string[] }[] = [
  {
    id: 'project',
    title: 'Project',
    commands: ['project.new', 'project.rename', 'project.save', 'project.save_as', 'project.close', 'project.recover', 'project.discard_recovery'],
  },
  {
    id: 'tracks',
    title: 'Tracks, media and jobs',
    commands: ['track.add', 'track.remove', 'track.set', 'media.remove', 'item.get', 'job.list', 'job.cancel'],
  },
  {
    id: 'history',
    title: 'History and transactions',
    commands: ['edit.redo', 'edit.history', 'edit.checkpoint', 'edit.list_checkpoints', 'edit.restore', 'edit.begin_tx', 'edit.commit_tx', 'edit.cancel_tx', 'edit.locks'],
  },
  {
    id: 'view',
    title: 'View state',
    commands: ['view.get', 'view.set', 'view.select', 'view.set_playhead', 'view.set_zoom'],
  },
];

/** Named in the architecture or the work breakdown; not in `tools/list` yet. */
export const PLANNED_TOOL_GROUPS: McpToolGroup[] = [
  {
    id: 'see',
    title: 'See the result',
    tools: [
      { name: 'render_frame', does: 'Render one frame as an image plus metadata.', image: true, when: 'WP-1J.02' },
      { name: 'render_contact_sheet', does: 'Render a grid of frames as one image.', image: true, when: 'Phase 2' },
      { name: 'media_filmstrip', does: 'Filmstrip of a media file.', image: true, when: 'Phase 2' },
      { name: 'audio_waveform', does: 'Waveform of an audio source.', image: true, when: 'Phase 2' },
    ],
  },
  {
    id: 'export',
    title: 'Export',
    tools: [{ name: 'export_start', does: 'Start an export job.', when: 'WP-1E.03' }],
  },
  {
    id: 'text',
    title: 'Text, captions, motion and audio',
    tools: [
      { name: 'text_add', does: 'Add a text item.', when: 'Phase 3' },
      { name: 'caption_generate', does: 'Transcribe media into captions.', when: 'Phase 3' },
      { name: 'caption_style', does: 'Style captions.', when: 'Phase 3' },
      { name: 'keyframe_set', does: 'Set a keyframe.', when: 'Phase 2' },
      { name: 'audio_set', does: 'Set audio properties.', when: 'Phase 2' },
    ],
  },
  {
    id: 'ai',
    title: 'AI',
    tools: [
      { name: 'ai_generate', does: 'Generate media. Priced before it runs.', when: 'Phase 5' },
      { name: 'ai_models', does: 'List the models the gateway can use.', when: 'Phase 5' },
    ],
  },
];

/** Not served yet: the engine advertises tools only. */
export const MCP_RESOURCES: string[] = [
  'cutweave://project',
  'cutweave://sequence/{id}/timeline',
  'cutweave://transcript/{id}',
  'cutweave://catalog/models',
];

export const MCP_PROMPTS: string[] = [
  'make-short',
  'caption-pass',
  'rough-cut',
  'tighten',
  'add-broll',
  'script-to-video',
  'dub',
  'audio-polish',
  'color-match',
  'review-cut',
  'brand-apply',
  'export-for',
  'explain-project',
];

export interface McpTransport {
  name: string;
  command: string;
  note: string;
}

export const MCP_TRANSPORTS: McpTransport[] = [
  {
    name: 'Streamable HTTP',
    command: 'http://127.0.0.1:<port>/mcp',
    note: 'Served by a running engine on localhost, with an agent token from its run-file. /mcp/minimal and /mcp/full pick the profile.',
  },
  {
    name: 'Attach to the app',
    command: 'cutweave mcp --attach',
    note: 'A stdio proxy to the running engine, so the agent edits the project you have open and you watch it happen.',
  },
  {
    name: 'Headless',
    command: 'cutweave mcp --headless --allow-root <folder>',
    note: 'An engine inside the MCP process, no GUI. For CI, servers and scripted runs.',
  },
];

export const AGENT_KIT_SKILLS: string[] = [
  'cutweave-basics',
  'transcript-editing',
  'shorts-from-longform',
  'captions-and-styling',
  'b-roll-insertion',
  'script-to-storyboard',
  'generate-shots',
  'dubbing-and-translation',
  'audio-polish',
  'color-and-look-matching',
  'reframe-and-aspect',
  'brand-kit-apply',
  'review-and-critique',
  'export-and-delivery',
];

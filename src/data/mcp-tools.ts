// SPDX-License-Identifier: GPL-3.0-or-later
// The planned MCP catalog. Names are from docs/01-architecture.md §14, §5.1 and §14b, via
// docs/content-inventory.md §5.2. Nothing here is runnable yet.
// GAP-08: replace with a link to the generated command reference once the codegen (WP-1N) and the
// reference docs (WP-7E.03) exist.

export interface McpTool {
  name: string;
  /** One line, plain. Derived from the command's namespace and verb; not a published schema. */
  does: string;
  /** Returns an image block plus structured metadata. */
  image?: boolean;
}

export interface McpToolGroup {
  id: string;
  title: string;
  tools: McpTool[];
}

export const CORE_TOOL_GROUPS: McpToolGroup[] = [
  {
    id: 'project',
    title: 'Project',
    tools: [
      { name: 'project_open', does: 'Open a project.' },
      { name: 'project_info', does: 'Read project metadata and the current revision.' },
    ],
  },
  {
    id: 'media',
    title: 'Media',
    tools: [
      { name: 'media_import', does: 'Import a file into the media library.' },
      { name: 'media_list', does: 'List media in the project.' },
    ],
  },
  {
    id: 'timeline',
    title: 'Timeline and clips',
    tools: [
      { name: 'timeline_get', does: 'Read the timeline as structured state.' },
      { name: 'timeline_insert', does: 'Place media on the timeline.' },
      { name: 'clip_split', does: 'Split a clip at a time.' },
      { name: 'clip_trim', does: 'Trim a clip.' },
      { name: 'clip_move', does: 'Move a clip.' },
      { name: 'item_delete', does: 'Delete an item.' },
      { name: 'item_set_props', does: 'Set properties on any item.' },
    ],
  },
  {
    id: 'text',
    title: 'Text and captions',
    tools: [
      { name: 'text_add', does: 'Add a text item.' },
      { name: 'caption_generate', does: 'Transcribe media into captions.' },
      { name: 'caption_style', does: 'Style captions.' },
    ],
  },
  {
    id: 'effects',
    title: 'Effects, motion and audio',
    tools: [
      { name: 'effect_add', does: 'Add an effect.' },
      { name: 'transition_add', does: 'Add a transition.' },
      { name: 'keyframe_set', does: 'Set a keyframe.' },
      { name: 'audio_set', does: 'Set audio properties.' },
      { name: 'composition_create', does: 'Author a composition and get compile diagnostics.' },
    ],
  },
  {
    id: 'see',
    title: 'See the result',
    tools: [
      { name: 'render_frame', does: 'Render one frame as an image plus metadata.', image: true },
      { name: 'render_contact_sheet', does: 'Render a grid of frames as one image.', image: true },
      // Named in architecture §14 as image-returning tools; not among the ~30 always-listed names.
      { name: 'media_filmstrip', does: 'Filmstrip of a media file.', image: true },
      { name: 'audio_waveform', does: 'Waveform of an audio source.', image: true },
    ],
  },
  {
    id: 'jobs',
    title: 'Jobs and export',
    tools: [
      { name: 'export_start', does: 'Start an export job.' },
      { name: 'job_status', does: 'Check a job.' },
      { name: 'job_wait', does: 'Wait for a job to finish.' },
    ],
  },
  {
    id: 'history',
    title: 'History',
    tools: [
      { name: 'edit_undo', does: 'Undo, per actor.' },
      { name: 'edit_checkpoint', does: 'Name a checkpoint you can restore.' },
    ],
  },
  {
    id: 'ai',
    title: 'AI',
    tools: [
      { name: 'ai_generate', does: 'Generate media. Priced before it runs.' },
      { name: 'ai_models', does: 'List the models the gateway can use.' },
    ],
  },
  {
    id: 'view',
    title: 'View state',
    tools: [
      { name: 'view_get', does: 'Read playhead, zoom and selection.' },
      { name: 'view_set', does: 'Set playhead, zoom and selection.' },
    ],
  },
];

export const GENERIC_TOOLS: McpTool[] = [
  { name: 'cutweave_search_commands', does: 'Search the full command registry by text.' },
  { name: 'cutweave_describe_command', does: 'Get one command’s schema.' },
  {
    name: 'cutweave_execute',
    does: 'Run steps as one transaction. Takes dry_run and expected_rev; steps can reference earlier results.',
  },
  { name: 'cutweave_query', does: 'Run a read-only query by name.' },
];

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
    note: 'Served by the running app on localhost, with token auth.',
  },
  {
    name: 'Attach to the app',
    command: 'cutweave mcp --attach',
    note: 'A stdio proxy into the running app, so you watch the agent edit live.',
  },
  {
    name: 'Headless',
    command: 'cutweave mcp --headless --project X',
    note: 'No GUI. For CI and servers.',
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

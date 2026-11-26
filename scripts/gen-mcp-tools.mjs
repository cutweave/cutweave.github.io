// SPDX-License-Identifier: GPL-3.0-or-later
/**
 * Generate src/data/mcp-tools.ts from the product repo's generated files (GAP-08, catalog part).
 *
 * Usage (read the product repo without checking it out):
 *   git -C <product repo> show origin/main:schema/mcp-tools.json        > mcp-tools.json
 *   git -C <product repo> show origin/main:docs/reference/commands.md   > commands.md
 *   node scripts/gen-mcp-tools.mjs --schema mcp-tools.json --commands commands.md --commit e129848 \
 *        --render-frame-description "<description from tools/list>"
 *
 * What is generated: the listed tools (schema/mcp-tools.json: name, command, description), the commands reached through
 * `cutweave_execute` (the `catalog` rows of commands.md) and their counts. What is written here, because no generated file has it:
 *   - the groups and the order of the listed tools,
 *   - `render_frame` (the engine registers `render.frame` only with a renderer, so the schema file and commands.md leave it out;
 *     its description is the one the recorded `tools/list` shows),
 *   - the minimal profile (MINIMAL_CORE in crates/cutweave-api/src/mcp/catalog.rs: project.info, media.list, timeline.get,
 *     render.frame, job.wait, edit.undo, plus the four generic tools),
 *   - the four generic tools and the planned tools with their work packages (docs/wbs/*.md).
 * It stops if a tool in the schema file has no group, so a new tool cannot go missing silently.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (n) => {
  const i = process.argv.indexOf(`--${n}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
};
const schemaPath = arg('schema');
const commandsPath = arg('commands');
const commit = arg('commit');
const renderFrameDescription = arg('render-frame-description');
if (!schemaPath || !commandsPath || !commit || !renderFrameDescription) {
  console.error('usage: node scripts/gen-mcp-tools.mjs --schema <mcp-tools.json> --commands <commands.md> --commit <sha> --render-frame-description <text>');
  process.exit(2);
}

const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
const byName = new Map(schema.tools.map((t) => [t.name, t.description]));
byName.set('render_frame', renderFrameDescription);

const MINIMAL = new Set(['project_info', 'media_list', 'timeline_get', 'render_frame', 'job_wait', 'edit_undo']);
const IMAGE = new Set(['render_frame']);
const GROUPS = [
  ['project', 'Project', ['project_open', 'project_info']],
  ['media', 'Media', ['media_import', 'media_list']],
  ['timeline', 'Timeline and clips', ['timeline_get', 'timeline_insert', 'clip_split', 'clip_trim', 'item_move', 'item_delete', 'item_set_props']],
  ['sequences', 'Sequences', ['sequence_create', 'sequence_set_format']],
  ['motion', 'Keyframes and audio', ['keyframe_set', 'audio_set']],
  ['see', 'See the result', ['render_frame']],
  ['export', 'Export', ['export_start']],
  ['jobs', 'Jobs', ['job_status', 'job_wait']],
  ['history', 'History', ['edit_undo']],
];
const grouped = new Set(GROUPS.flatMap((g) => g[2]));
const missing = [...byName.keys()].filter((n) => !grouped.has(n));
if (missing.length) {
  console.error(`gen-mcp-tools: no group for ${missing.join(', ')}; add it to GROUPS`);
  process.exit(1);
}
for (const n of grouped) if (!byName.has(n)) throw new Error(`gen-mcp-tools: ${n} is not in the schema file`);

// commands.md rows: | ns | `cmd` | summary | flags | mcp |
const catalogByNs = new Map();
let catalogCount = 0;
let totalCommands = 0;
for (const line of readFileSync(commandsPath, 'utf8').split('\n')) {
  const m = line.match(/^\| (\w+) \| `([\w.]+)` \| .*? \| [^|]* \| (core|catalog|hidden) \|$/);
  if (!m) continue;
  totalCommands++;
  if (m[3] !== 'catalog') continue;
  if (!catalogByNs.has(m[1])) catalogByNs.set(m[1], []);
  catalogByNs.get(m[1]).push(m[2]);
  catalogCount++;
}
const NS_TITLES = {
  audio: 'Audio',
  clip: 'Clips',
  edit: 'History, checkpoints and transactions',
  export: 'Export presets',
  item: 'Items',
  job: 'Jobs',
  keyframe: 'Keyframes',
  media: 'Media',
  project: 'Project',
  sequence: 'Sequences',
  timeline: 'Timeline',
  track: 'Tracks',
  view: 'View state',
};
for (const ns of catalogByNs.keys()) if (!NS_TITLES[ns]) throw new Error(`gen-mcp-tools: no title for namespace ${ns}`);

const q = (s) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const clean = (s) => s.replace(/'/g, '’');
const toolLine = (n) => {
  const parts = [`name: ${q(n)}`, `does: ${q(clean(byName.get(n)))}`];
  if (MINIMAL.has(n)) parts.push('minimal: true');
  if (IMAGE.has(n)) parts.push('image: true');
  return `      { ${parts.join(', ')} },`;
};

const groupsTs = GROUPS.map(
  ([id, title, tools]) => `  {\n    id: ${q(id)},\n    title: ${q(title)},\n    tools: [\n${tools.map(toolLine).join('\n')}\n    ],\n  },`,
).join('\n');
const catalogTs = [...catalogByNs.entries()]
  .map(([ns, cmds]) => `  { id: ${q(ns)}, title: ${q(NS_TITLES[ns])}, commands: [${cmds.map(q).join(', ')}] },`)
  .join('\n');
const listedCount = grouped.size;

const out = `// SPDX-License-Identifier: GPL-3.0-or-later
// GENERATED by scripts/gen-mcp-tools.mjs. Do not edit by hand: change the script and run it again.
// Source: the product repo at origin/main ${commit}: schema/mcp-tools.json (the tools), docs/reference/commands.md
// (the commands reached through cutweave_execute), crates/cutweave-api/src/mcp/catalog.rs (the minimal profile).
// \`render_frame\` is added by the script: the engine registers it only with a renderer. Planned tools are named in
// the script, with the work package from docs/wbs/ of the product repo that adds them.

export interface McpTool {
  name: string;
  /** One line, plain. The engine's own description. */
  does: string;
  /** Also listed on the minimal profile (\`--profile minimal\`). */
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

/** Source revision of the catalog below. */
export const CATALOG_COMMIT = ${q(commit)};
/** Commands and queries the engine registers (commands.md header total). */
export const REGISTERED_COMMANDS = ${totalCommands};

/** Listed by \`tools/list\` on the standard profile (${listedCount} tools, plus the 4 generic ones). */
export const CORE_TOOL_GROUPS: McpToolGroup[] = [
${groupsTs}
];

/** The four generic tools. All listed on both profiles. */
export const GENERIC_TOOLS: McpTool[] = [
  { name: 'cutweave_search_commands', does: 'Find commands and queries by keyword, including ones not listed as tools.', minimal: true },
  { name: 'cutweave_describe_command', does: 'Get one command\\u2019s docs, annotations and full input and output schemas.', minimal: true },
  {
    name: 'cutweave_execute',
    does: 'Run commands as one all-or-nothing transaction and one undo step. Takes dry_run and expected_rev; steps can reference earlier results with $ref.',
    minimal: true,
  },
  { name: 'cutweave_query', does: 'Run a read-only query by name, such as item.get or edit.history.', minimal: true },
];

/** Commands the engine registers that are not tools (\`catalog\` in commands.md). Run them with \`cutweave_execute\` (or \`cutweave_query\` for reads). */
export const CATALOG_COMMAND_GROUPS: { id: string; title: string; commands: string[] }[] = [
${catalogTs}
];

/** Named in the architecture or the work breakdown; not in \`tools/list\` yet. */
export const PLANNED_TOOL_GROUPS: McpToolGroup[] = [
  {
    id: 'see',
    title: 'See more',
    tools: [
      { name: 'render_contact_sheet', does: 'Render a grid of frames as one image.', image: true, when: 'WP-2I.02' },
      { name: 'media_filmstrip', does: 'Filmstrip of a media file.', image: true, when: 'WP-2I.02' },
      { name: 'audio_waveform', does: 'Waveform image of an audio source.', image: true, when: 'WP-2I.02' },
    ],
  },
  {
    id: 'text',
    title: 'Text and captions',
    tools: [
      { name: 'text_add', does: 'Add a text item.', when: 'WP-3A.01' },
      { name: 'caption_generate', does: 'Transcribe media into captions.', when: 'WP-3E.01' },
      { name: 'caption_style', does: 'Style captions.', when: 'WP-3E.01' },
    ],
  },
  {
    id: 'ai',
    title: 'AI',
    tools: [
      { name: 'ai_generate', does: 'Generate media. Priced before it runs.', when: 'WP-5A.10' },
      { name: 'ai_models', does: 'List the models the gateway can use.', when: 'WP-5A.10' },
    ],
  },
];

/** Served over MCP: read-only views an agent can read and subscribe to (crates/cutweave-api/src/mcp/resources.rs). */
export const MCP_RESOURCES: string[] = [
  'cutweave://project',
  'cutweave://sequence/{id}/timeline',
  'cutweave://catalog/commands',
  'cutweave://frame/{rev}/{t}',
];

/** Named in the architecture; not served yet. */
export const MCP_RESOURCES_PLANNED: string[] = ['cutweave://transcript/{id}', 'cutweave://catalog/models'];

/** Planned. The engine serves no MCP prompts yet. */
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
`;
writeFileSync(resolve(root, 'src/data/mcp-tools.ts'), out);
console.error(`gen-mcp-tools: ${listedCount} listed tools, ${catalogCount} catalog commands of ${totalCommands}`);

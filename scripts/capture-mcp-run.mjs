// SPDX-License-Identifier: GPL-3.0-or-later
/**
 * Capture a real MCP session against `cutweave mcp --headless` (GAP-03).
 *
 * Usage:
 *   node scripts/capture-mcp-run.mjs --bin <path to cutweave> --footage <neutral folder>
 *        [--commit <product commit>] [--date YYYY-MM-DD] [--seed 1] [--out-dir docs/captures]
 *
 * It starts the binary as a stdio MCP server, speaks newline-delimited JSON-RPC to it, and writes:
 *   - docs/captures/<date>-headless-run.jsonl   a header line, then every message in order, raw
 *   - src/data/mcp-real-run.json                the same run shaped for reading on /agents/
 *
 * No network, no dependencies. The output carries no timestamps, so a re-run is byte-identical.
 * Machine-specific paths: the binary path never appears in the output (the header records the
 * command as `cutweave ...`), the placeholder media live in the neutral folder given by --footage,
 * and the script fails if a user profile path, a user name, or anything that looks like a credential shows up in the capture.
 */
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir, userInfo } from 'node:os';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : fallback;
}
const bin = arg('bin');
const footage = arg('footage');
const commit = arg('commit', 'unknown');
const date = arg('date', new Date().toISOString().slice(0, 10));
const seed = arg('seed', '1');
const outDir = resolve(root, arg('out-dir', 'docs/captures'));
if (!bin || !footage) {
  console.error('usage: node scripts/capture-mcp-run.mjs --bin <cutweave> --footage <neutral folder> [--commit sha] [--date YYYY-MM-DD]');
  process.exit(2);
}
const slash = (p) => p.split('\\').join('/');

// ---- placeholder media: small, distinct (the engine dedups by content), in a neutral folder ----
mkdirSync(footage, { recursive: true });
const clips = [
  { file: 'interview_a.mp4', fill: 0x61 },
  { file: 'broll_harbor.mp4', fill: 0x62 },
];
for (const c of clips) writeFileSync(join(footage, c.file), Buffer.alloc(2048, c.fill));
const footageAbs = resolve(footage);
const mediaPath = (f) => slash(join(footageAbs, f));

const version = spawnSync(bin, ['--version'], { encoding: 'utf8' }).stdout.trim();
const serverArgs = ['mcp', '--headless', '--dev-stub-media', '--deterministic-ids', seed, '--allow-root', footageAbs, '--no-log'];
const command = ['cutweave', ...serverArgs].join(' ');

// ---- transport ----
const child = spawn(bin, serverArgs, { stdio: ['pipe', 'pipe', 'pipe'], cwd: footageAbs });
const log = []; // { dir: 'client' | 'server', msg }
const waiting = new Map();
let stderr = '';
let buf = '';
child.stderr.on('data', (d) => { stderr += d; });
child.stdout.on('data', (d) => {
  buf += d;
  let i;
  while ((i = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, i).trim();
    buf = buf.slice(i + 1);
    if (!line) continue;
    const msg = JSON.parse(line);
    log.push({ dir: 'server', msg });
    if (msg.id !== undefined && waiting.has(msg.id)) waiting.get(msg.id)(msg);
  }
});
const killTimer = setTimeout(() => { console.error('capture: timed out'); child.kill(); process.exit(1); }, 60000);

let nextId = 0;
function send(method, params, notification = false) {
  const msg = { jsonrpc: '2.0', method, ...(params ? { params } : {}) };
  if (notification) {
    log.push({ dir: 'client', msg });
    child.stdin.write(JSON.stringify(msg) + '\n');
    return Promise.resolve(null);
  }
  msg.id = ++nextId;
  log.push({ dir: 'client', msg });
  return new Promise((res) => {
    waiting.set(msg.id, res);
    child.stdin.write(JSON.stringify(msg) + '\n');
  });
}
const call = (name, args) => send('tools/call', { name, arguments: args });
const data = (r) => r.result?.structuredContent;
function need(v, what) {
  if (v === undefined || v === null) throw new Error(`capture: missing ${what}`);
  return v;
}

// ---- the session: look, set up, import, place, cut, check, undo ----
await send('initialize', { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'capture-mcp-run', version: '1' } });
await send('notifications/initialized', undefined, true);
await send('tools/list', {});

await call('project_info', {});
await call('cutweave_search_commands', { query: 'new project' });
await call('cutweave_describe_command', { name: 'project.new' });
const created = await call('cutweave_execute', { steps: [{ cmd: 'project.new', args: { name: 'Harbor interview' } }] });
const seq = need(data(created)?.steps?.[0]?.output, 'project.new output');
const imported = await call('media_import', { paths: clips.map((c) => mediaPath(c.file)) });
const [interview, harbor] = need(data(imported)?.media_ids, 'media ids');
await call('media_list', {});
const placed = await call('timeline_insert', { sequence: seq.sequence, track: seq.video_track, media: interview, at: 0 });
const interviewVideo = need(data(placed)?.clips?.[0], 'interview clip');
await call('timeline_insert', { sequence: seq.sequence, track: seq.video_track, media: harbor, at: '10s' });
const split = await call('clip_split', { item: interviewVideo, at: '4s' });
const rightPiece = need(data(split)?.right, 'split right piece');
await call('item_delete', { items: [rightPiece] });
await call('timeline_get', { sequence: seq.sequence, depth: 2 });
await call('edit_undo', {});
await call('timeline_get', { sequence: seq.sequence, depth: 2 });

child.stdin.end();
await new Promise((res) => child.on('close', res));
clearTimeout(killTimer);

// ---- checks: no machine-specific paths, no secrets ----
const header = {
  capture: {
    what: 'A real MCP session over stdio, recorded as newline-delimited JSON-RPC. One line per message; dir says who sent it.',
    command,
    binary_version: version,
    product_commit: commit,
    date,
    protocol_revision: '2025-11-25',
    footage_folder: slash(footageAbs),
    server_stderr: stderr.trim(),
    notes: [
      'Media are 2 KB placeholder files. Probe data (10 s, video and audio) is made up by --dev-stub-media; there is no real decoding yet.',
      'Ids are deterministic (--deterministic-ids ' + seed + ') and the clock is frozen, so the same script gives the same output.',
      'Scrubbed: the binary path is not recorded, the footage folder is a neutral path outside any user profile, and the script refuses to write a capture that contains a user profile path, a user name or anything that looks like a credential. Nothing was replaced or edited by hand.',
    ],
    script: 'scripts/capture-mcp-run.mjs',
  },
};
const lines = [header, ...log].map((l) => JSON.stringify(l));
const text = lines.join('\n') + '\n';

const forbidden = [
  [/[A-Za-z]:\\\\Users\\\\/i, 'Windows user path'],
  [/[A-Za-z]:\/Users\//i, 'Windows user path'],
  [/\/Users\/[^/]+\//, 'macOS user path'],
  [/\/home\/[^/]+\//, 'Linux user path'],
  [/AppData/i, 'AppData path'],
  [/api[_-]?key|secret|bearer|password|authorization/i, 'secret-like word'],
  [/\btoken\b/i, 'token'],
];
const names = [userInfo().username, homedir().split(/[\\/]/).pop()].filter((n) => n && n.length > 2);
for (const [re, what] of forbidden) {
  const m = text.match(re);
  if (m) throw new Error(`capture: ${what} found in output: ${m[0]}`);
}
for (const n of names) {
  if (text.toLowerCase().includes(n.toLowerCase())) throw new Error('capture: the user name appears in the output');
}

// ---- display shaping for the /agents/ page ----
// Values stay verbatim. Trimming only drops whole keys, cuts arrays and cuts long strings, and every
// cut is shown as "..." in the text and listed in `trimmed` so the page can say so.
const ELLIPSIS = '\u2026';
function trim(value, opts, notes, depth = 0) {
  const { omit = [], maxItems = 3, maxString = 140 } = opts;
  if (Array.isArray(value)) {
    const kept = value.slice(0, maxItems).map((v) => trim(v, opts, notes, depth + 1));
    if (value.length > maxItems) {
      kept.push(ELLIPSIS);
      notes.add(`lists cut to ${maxItems} entries`);
    }
    return kept;
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (omit.includes(k)) {
        notes.add(`${k} omitted`);
        continue;
      }
      out[k] = trim(v, opts, notes, depth + 1);
    }
    return out;
  }
  if (typeof value === 'string' && value.length > maxString) {
    notes.add('long text cut');
    return value.slice(0, maxString) + ELLIPSIS;
  }
  return value;
}
const show = (v) => JSON.stringify(v).replace(/"\u2026"/g, ELLIPSIS);

const sentence = (s) => (s.match(/^.*?[.!?](?=\s|$)(?:\s+.*?[.!?](?=\s|$))?/) || [s])[0];

const responseFor = new Map();
const requestFor = new Map();
for (const { dir, msg } of log) {
  if (dir === 'client' && msg.id !== undefined) requestFor.set(msg.id, msg);
  if (dir === 'server' && msg.id !== undefined) responseFor.set(msg.id, msg);
}

const tuning = {
  cutweave_search_commands: { omit: ['call', 'transactional', 'read_only'], maxItems: 2 },
  cutweave_describe_command: { omit: ['input_schema', 'output_schema', 'input', 'output', 'inputSchema', 'outputSchema'], maxItems: 3 },
  media_import: { omit: [], maxItems: 2 },
  media_list: { omit: ['has_video', 'has_audio'], maxItems: 2 },
  timeline_get: { omit: ['format', 'muted', 'hidden', 'locked', 'solo', 'gain', 'enabled', 'linked_group', 'name', 'item_count', 'end', 'track_count'], maxItems: 4 },
  cutweave_execute: { omit: [], maxItems: 3 },
};

function tidy(notes) {
  const omitted = [...notes].filter((n) => n.endsWith(' omitted')).map((n) => n.slice(0, -8));
  const rest = [...notes].filter((n) => !n.endsWith(' omitted'));
  return omitted.length ? [`omitted: ${omitted.join(', ')}`, ...rest] : rest;
}

const steps = [];
for (const [id, req] of requestFor) {
  const res = responseFor.get(id);
  if (!res) throw new Error(`capture: no response to request ${id}`);
  const notes = new Set();
  if (req.method === 'initialize') {
    const r = res.result;
    steps.push({
      id,
      kind: 'handshake',
      label: 'initialize',
      args: show({ protocolVersion: req.params.protocolVersion, clientInfo: req.params.clientInfo }),
      summary: `Server: ${r.serverInfo.name} ${r.serverInfo.version}, protocol ${r.protocolVersion}`,
      result: show({ capabilities: r.capabilities, instructions: sentence(r.instructions) + ELLIPSIS }),
      trimmed: ['instructions cut to the first sentences'],
      isError: false,
    });
  } else if (req.method === 'tools/list') {
    const names = res.result.tools.map((t) => t.name);
    steps.push({
      id,
      kind: 'list',
      label: 'tools/list',
      args: '{}',
      summary: `${names.length} tools`,
      result: names.join(', '),
      tools: names,
      trimmed: ['input schemas and annotations omitted'],
      isError: false,
    });
  } else if (req.method === 'tools/call') {
    const tool = req.params.name;
    const sc = res.result?.structuredContent;
    const text0 = res.result?.content?.[0]?.text ?? '';
    const shaped = trim(sc ?? {}, tuning[tool] ?? {}, notes);
    steps.push({
      id,
      kind: 'call',
      label: tool,
      tool,
      args: show(req.params.arguments),
      summary: text0,
      result: show(shaped),
      trimmed: tidy(notes),
      isError: Boolean(res.result?.isError),
    });
  }
}

const page = {
  generated_by: 'scripts/capture-mcp-run.mjs',
  command,
  binary_version: version,
  product_commit: commit,
  date,
  capture_file: `docs/captures/${date}-headless-run.jsonl`,
  tools_listed: steps.find((s) => s.kind === 'list')?.tools ?? [],
  call_count: steps.filter((s) => s.kind === 'call').length,
  error_count: steps.filter((s) => s.isError).length,
  steps,
};

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, `${date}-headless-run.jsonl`), text);
writeFileSync(join(root, 'src/data/mcp-real-run.json'), JSON.stringify(page, null, 2) + '\n');
console.error(`capture: ${log.length} messages, ${page.call_count} tool calls, ${page.error_count} errors`);

// SPDX-License-Identifier: GPL-3.0-or-later
/**
 * Capture a real MCP session against `cutweave mcp --headless` (GAP-03).
 *
 * Usage:
 *   node scripts/capture-mcp-run.mjs --bin <path to FFmpeg-enabled cutweave> --clips <folder with the three M1 corpus clips>
 *        --footage <neutral folder> [--commit <product commit>] [--date YYYY-MM-DD] [--seed 42] [--out-dir docs/captures]
 *
 * It copies the three self-generated M1 corpus clips into the neutral footage folder, starts the binary as a stdio MCP
 * server (real FFmpeg media, no --dev-stub-media), speaks newline-delimited JSON-RPC to it, and writes:
 *   - docs/captures/<date>-real-media-run.jsonl   a header line, then every message in order, raw
 *   - src/data/mcp-real-run.json                  the same run shaped for reading on /agents/
 *   - src/assets/agents/render-frame-<t>.jpg      the image block of render_frame, decoded from its base64
 * The session follows the M1 scripted agent (crates/cutweave-cli/tests/mcp_conformance/m1.rs in the product repo): import
 * three clips, wait for analysis, place and trim them, split and move, read the timeline, render a frame, export.
 *
 * Images: the base64 of an image block is replaced in the jsonl by a marker with its byte count and sha256, so the file stays
 * small; the bytes themselves are the asset above. Everything else is raw.
 *
 * No network, no dependencies. The output carries no timestamps. A re-run gives the same frame bytes and export size, but background
 * analysis jobs race, so a few job ids, the order of the job_wait calls and one proxy field can differ (the header says so). The binary path never appears in the output, and the script fails if a user profile path, a user
 * name or anything that looks like a credential shows up in the capture.
 * The export goes to <footage>/export/ and is never published. Run it under the product's GPU lock.
 * The 2026-11-23 capture (stub media, no frames) was made by the earlier version of this script and is kept as history.
 */
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, copyFileSync, statSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
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
const seed = arg('seed', '42');
const clipsDir = arg('clips');
const outDir = resolve(root, arg('out-dir', 'docs/captures'));
if (!bin || !footage || !clipsDir) {
  console.error('usage: node scripts/capture-mcp-run.mjs --bin <cutweave> --clips <corpus clips folder> --footage <neutral folder> [--commit sha] [--date YYYY-MM-DD]');
  process.exit(2);
}
const slash = (p) => p.split('\\').join('/');

// ---- media: the three self-generated M1 corpus clips (testdata/corpus.toml: license = "self-generated"), copied to a neutral folder ----
const footageAbs = resolve(footage);
const mediaDir = join(footageAbs, 'media');
const exportDir = join(footageAbs, 'export');
mkdirSync(mediaDir, { recursive: true });
rmSync(exportDir, { recursive: true, force: true }); // a fresh run must not find the last export
mkdirSync(exportDir, { recursive: true });
const CLIPS = ['h264_1080p60.mp4', 'hevc_10bit_sdr.mp4', 'vfr_phone_rotated90.mp4'];
for (const f of CLIPS) copyFileSync(join(resolve(clipsDir), f), join(mediaDir, f));
const mediaPath = (f) => slash(join(mediaDir, f));
const exportPath = slash(join(exportDir, 'm1-cut.mp4'));
const SEC = 705_600_000; // flicks per second

const version = spawnSync(bin, ['--version'], { encoding: 'utf8' }).stdout.trim();
const serverArgs = ['mcp', '--headless', '--deterministic-ids', seed, '--allow-root', footageAbs, '--no-log'];
const command = ['cutweave', ...serverArgs].join(' ');

// ---- transport ----
const child = spawn(bin, serverArgs, { stdio: ['pipe', 'pipe', 'pipe'], cwd: footageAbs });
const log = []; // { dir: 'client' | 'server', msg }
const waiting = new Map();
let stderr = '';
const images = []; // decoded image blocks, in order
function takeImages(msg) {
  for (const block of msg.result?.content ?? []) {
    if (block.type !== 'image') continue;
    const bytes = Buffer.from(block.data, 'base64');
    const sha256 = createHash('sha256').update(bytes).digest('hex');
    images.push({ bytes, mime: block.mimeType, sha256 });
    block.data = `<base64 omitted: ${bytes.length} bytes, sha256 ${sha256}>`;
  }
}
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
    takeImages(msg);
    log.push({ dir: 'server', msg });
    if (msg.id !== undefined && waiting.has(msg.id)) waiting.get(msg.id)(msg);
  }
});
const killTimer = setTimeout(() => { console.error('capture: timed out'); child.kill(); process.exit(1); }, 20 * 60 * 1000);

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
  if (v === undefined || v === null) {
    const last = log[log.length - 1];
    throw new Error(`capture: missing ${what}; last message: ${JSON.stringify(last).slice(0, 1500)}`);
  }
  return v;
}

// ---- the session: the M1 scripted agent, without the checks ----
// Clips go on V1 back to back and are trimmed to 0-4 s, 4-7 s and 7-10 s; the first is split at 2 s and its right half
// moves to the end (10 s). The timeline is 12 s. A frame at 5 s shows the second clip. Then the cut is exported.
const PLACED = [[0, 4], [4, 7], [7, 10]];
async function wait(job) {
  // job_wait returns after at most 60 s; ask again while the job runs.
  for (;;) {
    const r = await call('job_wait', { job_id: job, timeout_ms: 60000 });
    const state = data(r)?.state;
    if (state !== 'queued' && state !== 'running') return r;
  }
}
const errors = [];
const ok = (r, what) => { if (r.result?.isError || r.error) errors.push(what); return r; };

await send('initialize', { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'capture-mcp-run', version: '1' } });
await send('notifications/initialized', undefined, true);
await send('tools/list', {});

const created = ok(await call('cutweave_execute', { steps: [{ cmd: 'project.new', args: { name: 'M1 cut' } }] }), 'project.new');
const seq = need(data(created)?.steps?.[0]?.output, 'project.new output');
const imported = ok(await call('media_import', { paths: CLIPS.map(mediaPath) }), 'media_import');
const media = need(data(imported)?.media_ids, 'media ids');
if (process.env.CAPTURE_DEBUG) console.error(JSON.stringify(imported).slice(0, 2500));
for (const job of need(data(imported)?.job_ids, 'analysis job ids')) {
  const done = await wait(job);
  if (data(done)?.state !== 'succeeded') throw new Error('capture: analysis job did not succeed');
}
const placed = [];
for (const [i, [at, end]] of PLACED.entries()) {
  const ins = ok(await call('timeline_insert', { sequence: seq.sequence, track: seq.video_track, media: media[i], at: at * SEC }), 'timeline_insert');
  const clip = need(data(ins)?.clips?.[0], 'inserted clip');
  placed.push(clip);
  ok(await call('clip_trim', { item: clip, edge: 'end', to: end * SEC }), 'clip_trim');
}
const split = ok(await call('clip_split', { item: placed[0], at: 2 * SEC }), 'clip_split');
ok(await call('item_move', { item: need(data(split)?.right, 'split right piece'), start: 10 * SEC }), 'item_move');
ok(await call('timeline_get', { sequence: seq.sequence, depth: 2 }), 'timeline_get');
if (process.env.CAPTURE_STOP_BEFORE_FRAME) { console.error('capture: stopped before render_frame (debug)'); child.kill(); process.exit(0); }
ok(await call('render_frame', { t: '5s' }), 'render_frame');
if (images.length !== 1) throw new Error(`capture: expected one image block, got ${images.length}`);
const started = ok(await call('export_start', { path: exportPath, hw: 'off' }), 'export_start');
const exported = await wait(need(data(started)?.job_id, 'export job id'));
if (data(exported)?.state !== 'succeeded') throw new Error('capture: export did not succeed');
if (errors.length) throw new Error(`capture: tool errors in ${errors.join(', ')}`);
const exportBytes = statSync(exportPath).size;

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
      'Real media: the three self-generated M1 corpus clips (h264_1080p60.mp4, hevc_10bit_sdr.mp4, vfr_phone_rotated90.mp4; license "self-generated" in testdata/corpus.toml) decoded by FFmpeg. No --dev-stub-media.',
      'The picture of render_frame is an MCP image block. Its base64 is replaced here by a marker with the byte count and the sha256 of the decoded bytes, to keep this file small; the bytes are the site asset named in the page data, decoded from the base64 exactly as the agent received it. Nothing else was replaced.',
      'Ids come from --deterministic-ids ' + seed + ' and the clock is frozen. The analysis jobs run on background threads, so the ids and order of the job_wait calls after the first clip, and the proxy field of media_import (queued or ready), can differ between runs. In two recorded runs only those lines differed; the rendered frame and the export size were identical.',
      'Scrubbed: the binary path is not recorded, the footage folder is a neutral path outside any user profile, and the script refuses to write a capture that contains a user profile path, a user name or anything that looks like a credential. Nothing was edited by hand.',
      'The export (software H.264 encoder, hw off) was written to the footage folder and is not published.',
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

// ---- write the raw capture and the frame before anything else can fail ----
const frame = images[0];
const frameExt = frame.mime === 'image/png' ? 'png' : 'jpg';
const frameFile = `render-frame-5s.${frameExt}`;
mkdirSync(outDir, { recursive: true });
mkdirSync(join(root, 'src/assets/agents'), { recursive: true });
writeFileSync(join(outDir, `${date}-real-media-run.jsonl`), text);
writeFileSync(join(root, 'src/assets/agents', frameFile), frame.bytes);

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
  render_frame: { omit: [], maxItems: 4 },
  export_start: { omit: [], maxItems: 4 },
  job_wait: { omit: [], maxItems: 4 },
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
      ...(tool === 'render_frame' ? { image: { file: frameFile, mime: frame.mime, bytes: frame.bytes.length, sha256: frame.sha256 } } : {}),
    });
  }
}

// The analysis waits are one job_wait per job (3 per clip). Show the first and say how many there were; every one is in the capture.
const waitIdx = steps.map((s, i) => (s.tool === 'job_wait' && s.result.includes('"kind":"analysis"') ? i : -1)).filter((i) => i >= 0);
let shownSteps = steps;
if (waitIdx.length > 1) {
  const first = steps[waitIdx[0]];
  const merged = {
    ...first,
    label: `job_wait ×${waitIdx.length}`,
    trimmed: [`the other ${waitIdx.length - 1} job_wait calls, one per analysis job (index, thumbnails, waveform for each clip), are not shown; all ${waitIdx.length} returned state succeeded`, ...first.trimmed],
  };
  shownSteps = steps.filter((_, i) => !waitIdx.includes(i) || i === waitIdx[0]).map((st) => (st === first ? merged : st));
}

const page = {
  generated_by: 'scripts/capture-mcp-run.mjs',
  command,
  binary_version: version,
  product_commit: commit,
  date,
  capture_file: `docs/captures/${date}-real-media-run.jsonl`,
  footage: CLIPS,
  export_bytes: exportBytes,
  tools_listed: steps.find((s) => s.kind === 'list')?.tools ?? [],
  call_count: steps.filter((s) => s.kind === 'call').length,
  error_count: steps.filter((s) => s.isError).length,
  steps: shownSteps,
};

writeFileSync(join(root, 'src/data/mcp-real-run.json'), JSON.stringify(page, null, 2) + '\n');
console.error(`capture: ${log.length} messages, ${page.call_count} tool calls, ${page.error_count} errors`);

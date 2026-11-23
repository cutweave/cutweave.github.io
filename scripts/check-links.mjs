// SPDX-License-Identifier: GPL-3.0-or-later
// Crawls dist/ HTML and fails on broken internal links, missing assets and missing #anchors.
// Dependency-free and offline. Usage: pnpm build && pnpm test:links
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const origin = 'https://cutweave.app';

if (!existsSync(dist)) {
  console.error('dist/ not found. Run "pnpm build" first.');
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const htmlFiles = walk(dist).filter((f) => f.endsWith('.html'));
const idCache = new Map();

function idsOf(file) {
  if (!idCache.has(file)) {
    const html = readFileSync(file, 'utf8');
    const ids = new Set();
    for (const m of html.matchAll(/\s(?:id|name)=["']?([^\s"'>]+)/g)) ids.add(m[1]);
    idCache.set(file, ids);
  }
  return idCache.get(file);
}

/** Map a URL path (already without query/hash) to a file in dist, or null. */
function resolveTarget(urlPath) {
  const clean = decodeURIComponent(urlPath);
  const base = join(dist, clean);
  const candidates = clean.endsWith('/') ? [join(base, 'index.html')] : [base, join(base, 'index.html'), `${base}.html`];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) ?? null;
}

const problems = [];
let checked = 0;

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const pagePath = '/' + relative(dist, file).split(sep).join('/').replace(/index\.html$/, '');
  const refs = [...html.matchAll(/\s(?:href|src)=["']?([^\s"'>]+)/g)].map((m) => m[1]);

  for (const raw of refs) {
    const ref = raw.replaceAll('&amp;', '&');
    if (/^(mailto:|tel:|data:|javascript:)/i.test(ref)) continue;
    let url;
    try {
      url = new URL(ref, new URL(pagePath, origin));
    } catch {
      problems.push(`${pagePath}: invalid URL "${ref}"`);
      continue;
    }
    if (url.origin !== origin) continue; // external: not checked (no network)
    checked++;
    const target = resolveTarget(url.pathname);
    if (!target) {
      problems.push(`${pagePath}: broken link "${ref}" (no file for ${url.pathname})`);
      continue;
    }
    if (url.hash.length > 1 && target.endsWith('.html')) {
      const id = decodeURIComponent(url.hash.slice(1));
      if (!idsOf(target).has(id)) problems.push(`${pagePath}: missing anchor "${ref}" (no id="${id}" in ${url.pathname})`);
    }
  }
}

if (problems.length) {
  console.error(`Found ${problems.length} problem(s):\n` + [...new Set(problems)].map((p) => `  - ${p}`).join('\n'));
  process.exit(1);
}
console.log(`Checked ${checked} internal references in ${htmlFiles.length} pages: all resolve.`);

// SPDX-License-Identifier: GPL-3.0-or-later
/**
 * make-og.mjs: one-off dev script that generates the social and icon PNGs. Not part of the build.
 *   - public/og.png               1200 x 630, a screenshot of /og-card/ (src/pages/og-card.astro)
 *   - public/apple-touch-icon.png 180 x 180, the mark on surface-0 with padding
 *   - public/favicon-32.png       32 x 32, the mark on a transparent background
 * (GAP-13: replace og.png with a card that uses real editor screenshots once GAP-01 closes.)
 *
 * It adds no dependency and downloads nothing. It borrows Playwright and its installed Chromium from the main
 * repo. Run:
 *   pnpm build && pnpm preview --port 4341      (in another terminal)
 *   node scripts/make-og.mjs
 * Environment:
 *   SITE_URL         default http://localhost:4341
 *   PLAYWRIGHT_PATH  path to a `playwright` or `playwright-core` package folder (default: searched in the main repo)
 *   CHROMIUM_PATH    path to a chromium executable (default: Playwright's own cache)
 */
import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = path.join(root, 'public');
const site = process.env.SITE_URL ?? 'http://localhost:4341';

function findPlaywright() {
  const candidates = [
    process.env.PLAYWRIGHT_PATH,
    path.join(root, 'node_modules', 'playwright-core'),
    'D:/projects/Vidai/node_modules/.pnpm/playwright-core@1.65.1/node_modules/playwright-core',
    'D:/projects/Vidai/node_modules/.pnpm/playwright@1.65.1/node_modules/playwright',
  ].filter(Boolean);
  for (const c of candidates) if (existsSync(c)) return c;
  throw new Error('Playwright not found. Set PLAYWRIGHT_PATH to a playwright or playwright-core folder.');
}
const { chromium } = createRequire(import.meta.url)(findPlaywright());

// surface-0 in the dark theme (src/styles/tokens.css). A script cannot read CSS variables before a page loads.
const SURFACE_0 = '#111111';
const markSvg = readFileSync(path.join(pub, 'brand', 'cutweave-mark.svg'), 'utf8');
const markUri = `data:image/svg+xml;base64,${Buffer.from(markSvg).toString('base64')}`;

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
try {
  // 1. Social card.
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(`${site}/og-card/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(pub, 'og.png'), clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await page.close();

  // 2. Icons: render the mark SVG in a small page and screenshot it.
  async function icon(file, size, { background, padding }) {
    const p = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    const inner = size - padding * 2;
    await p.setContent(
      `<html><body style="margin:0;width:${size}px;height:${size}px;display:grid;place-items:center;background:${background}">` +
        `<img src="${markUri}" width="${inner}" height="${inner}" alt=""></body></html>`,
    );
    await p.screenshot({ path: path.join(pub, file), omitBackground: background === 'transparent' });
    await p.close();
  }
  await icon('apple-touch-icon.png', 180, { background: SURFACE_0, padding: 28 });
  await icon('favicon-32.png', 32, { background: 'transparent', padding: 0 });
} finally {
  await browser.close();
}
console.log('Wrote public/og.png, public/apple-touch-icon.png, public/favicon-32.png');

// SPDX-License-Identifier: GPL-3.0-or-later
// Re-copies the generated design tokens from the main Cutweave repo, byte for byte.
// Usage: pnpm sync-tokens [path/to/tokens.css]   (default: ../Vidai/design/tokens.css)
import { copyFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(process.argv[2] ?? resolve(root, '../Vidai/design/tokens.css'));
const target = resolve(root, 'src/styles/tokens.css');

if (!existsSync(source)) {
  console.error(`Tokens not found at ${source}. Pass the path to design/tokens.css as an argument.`);
  process.exit(1);
}
copyFileSync(source, target);
console.log(`Copied ${source} to ${target}. Review the diff and commit; never hand-edit the copy.`);

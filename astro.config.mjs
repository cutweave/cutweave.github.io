// SPDX-License-Identifier: GPL-3.0-or-later
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static site served from the root of https://cutweave.app/ (base stays "/").
export default defineConfig({
  site: 'https://cutweave.app',
  base: '/',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap({ filter: (page) => !page.includes('/styleguide/') && !page.includes('/og-card/') })],
});

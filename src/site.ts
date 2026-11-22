// SPDX-License-Identifier: GPL-3.0-or-later
// Site-wide constants: nav, external links and metadata defaults. Pages import from here so links stay consistent.

export const SITE = {
  name: 'Cutweave',
  url: 'https://cutweave.github.io',
  tagline: 'An open-source video editor for creators and the AI agents that work with them.',
  description:
    'Cutweave is an open-source desktop video editor in development: CapCut-class editing, full MCP control for AI agents, your own AI keys and plugins at every layer.',
} as const;

const REPO = 'https://github.com/cutweave/cutweave';

export const LINKS = {
  org: 'https://github.com/cutweave',
  repo: REPO,
  docs: `${REPO}/tree/main/docs`,
  designSystem: `${REPO}/blob/main/docs/07-design-system.md`,
  issues: `${REPO}/issues`,
  license: `${REPO}/blob/main/LICENSE`,
  contributing: `${REPO}/blob/main/CONTRIBUTING.md`,
  siteRepo: 'https://github.com/cutweave/cutweave.github.io',
} as const;

export const NAV = [
  { label: 'Agents', href: '/agents/' },
  { label: 'How it works', href: '/how-it-works/' },
  { label: 'Compare', href: '/compare/' },
  { label: 'Roadmap', href: '/roadmap/' },
  { label: 'Open source', href: '/open-source/' },
] as const;

export const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'Agents and MCP', href: '/agents/' },
      { label: 'How it works', href: '/how-it-works/' },
      { label: 'Compare', href: '/compare/' },
      { label: 'Roadmap', href: '/roadmap/' },
    ],
  },
  {
    title: 'Open source',
    links: [
      { label: 'Why open source', href: '/open-source/' },
      { label: 'Source code', href: LINKS.repo, external: true },
      { label: 'Documentation', href: LINKS.docs, external: true },
      { label: 'Design system', href: LINKS.designSystem, external: true },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'GitHub organization', href: LINKS.org, external: true },
      { label: 'Report an issue', href: LINKS.issues, external: true },
      { label: 'Contributing', href: LINKS.contributing, external: true },
      { label: 'License', href: LINKS.license, external: true },
    ],
  },
] as const;

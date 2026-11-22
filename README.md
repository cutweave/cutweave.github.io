# Cutweave website

Source of [cutweave.github.io](https://cutweave.github.io/), the public site for [Cutweave](https://github.com/cutweave/cutweave): an open-source (GPL-3.0) desktop video editor for creators and their AI agents.

Built with [Astro](https://astro.build/) (static output), TypeScript (strict) and pnpm. The site makes **zero third-party requests** at runtime: fonts and icons are self-hosted, there are no analytics and no cookies. Privacy is a product pillar, so keep it that way.

## Run it

Requires Node 24 (see `.nvmrc`) and pnpm (`packageManager` in `package.json`).

| Task | Command |
|---|---|
| Install | `pnpm install` |
| Dev server | `pnpm dev` |
| Type and template check | `pnpm check` |
| Production build to `dist/` | `pnpm build` |
| Preview the build | `pnpm preview` |
| Check internal links and anchors in `dist/` | `pnpm test:links` (run after `pnpm build`) |
| Re-copy design tokens | `pnpm sync-tokens [path/to/tokens.css]` |

## Layout

```
src/
  layouts/BaseLayout.astro   SEO, theme script, skip link, header, <main id="content">, footer
  components/                Header, Footer, Logo, ThemeToggle (site chrome)
  components/ui/             Base components (props documented in each file's top comment)
  pages/                     Routes; /styleguide/ is a hidden review page (noindex)
  styles/                    tokens.css (copied), site-tokens.css, fonts.css, global.css
  site.ts                    Nav, footer links, external URLs and metadata defaults
scripts/                     sync-tokens.mjs, check-links.mjs
public/                      robots.txt, favicon.svg, brand/ (logo SVGs)
```

Open `/styleguide/` (run `pnpm dev`) to see every base component in both states and both themes.

## Design tokens and the no-literal-values rule

The design system lives in the main repo (`design/`: brand book in `design/README.md`, rules in [docs/07-design-system.md](https://github.com/cutweave/cutweave/blob/main/docs/07-design-system.md)).

- `src/styles/tokens.css` is a **verbatim copy** of the generated `design/tokens.css`. Never hand-edit it. Resync with `pnpm sync-tokens` (default source `../Vidai/design/tokens.css`, or pass a path). The copy carries no SPDX header on purpose, so it stays byte-identical to its source.
- Values the design system lacks (section spacing, content width, marketing display sizes, hero glows) go in `src/styles/site-tokens.css`, each with a usage note and built from existing tokens where possible. If a value would help the product too, propose it upstream in `design/tokens.json`.
- **Components and pages use `var(--token)` only**: no literal colors, no font stacks. Small literal font sizes in px exist for the 11 to 17px UI scale; prefer a token when one fits.
- Brand rules: marigold means "here" and the primary action only; agent blue marks AI and agent content only (use `AgentBadge`); dark-first true-neutral surfaces; sentence case; no emoji; no exclamation marks; status is always icon plus word.
- Known literals outside the token system: the two `theme-color` meta values in `BaseLayout.astro` (a meta tag cannot read CSS variables) mirror `surface-0` in dark and light.

## Theme

Dark is the default. On first visit `prefers-color-scheme` is respected; the header toggle stores the choice in `localStorage` (key `cutweave-theme`, wrapped in try/catch). An inline script in `<head>` applies it before first paint to avoid a flash.

## Deploy flow

- Pull requests run `.github/workflows/ci.yml`: install, `pnpm check`, `pnpm build`, `pnpm test:links`. No network is needed by the link checker.
- Pushes to `main` run `.github/workflows/deploy.yml`: build, upload `dist/` as a Pages artifact, deploy through the `github-pages` environment. GitHub Pages is set to the "GitHub Actions" build type and the site is served from the root (`base: '/'`).
- Run `pnpm check && pnpm build && pnpm test:links` locally before opening a PR.

## Known gaps

- `public/og.png` (1200 x 630 Open Graph image) does not exist yet; `BaseLayout` already points at `/og.png`.
- The favicon is SVG only (`public/favicon.svg`, the marigold mark). Add a 32 px PNG/ICO fallback and an `apple-touch-icon` when exported from a final logo.
- Fonts ship the Latin subset only.

## Dependencies

| Package | Why |
|---|---|
| `astro` (MIT) | Static site framework |
| `@astrojs/sitemap` (MIT) | Generates `sitemap-index.xml`; `/styleguide/` is filtered out |
| `@fontsource-variable/instrument-sans` (OFL) | Self-hosted UI font |
| `@fontsource-variable/bricolage-grotesque` (OFL) | Self-hosted display font |
| `@fontsource-variable/jetbrains-mono` (OFL) | Self-hosted mono font for timecode and code |
| `lucide-static` (ISC) | Lucide icon SVGs, inlined at build time (no icon font) |
| `typescript` (Apache-2.0, dev) | Strict type checking; pinned to 6.x because `@astrojs/check` does not support 7 yet |
| `@astrojs/check` (MIT, dev) | `astro check` for templates and types |

Adding a dependency needs a one-line justification here and a GPL-3.0-compatible license.

## License

GPL-3.0-or-later, like the main project. See [LICENSE](LICENSE). Every authored source file starts with an `SPDX-License-Identifier: GPL-3.0-or-later` header. Fonts are SIL OFL 1.1; Lucide icons are ISC.

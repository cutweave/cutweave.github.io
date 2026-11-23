# Content gaps: what the site is waiting for

Things the website should show but can't yet, because the product doesn't exist in that form. Each has an id; the placeholder in the code carries a `GAP-NN` comment so it can be found with `grep -rn "GAP-" src`. When the source work package lands, replace the placeholder and move the row to "Closed".

Work-package (WP) ids refer to the main repo's `docs/wbs/`.

## Open

| Id | Gap | What the site shows now | Replace with | Unblocked by |
|---|---|---|---|---|
| GAP-01 | Real app screenshots | `EditorMock` HTML recreation labelled "Design preview"; Storybook component renders labelled "Design system, in development" | Screenshots of the real editor from a sample project (both themes) | WP-1M.* (P1 editor shell), WP-2H (P2 UI), WP-7E.02 (auto doc screenshots) |
| GAP-02 | Demo video or GIF | Scripted `AgentDemo` player (Illustrative) | Silent, captioned screen recording of import → cut → export, and an agent doing the same over MCP | WP-1O.04 (M1 demo video), WP-7G.02 (sample projects) |
| GAP-03 | Real agent transcript | `src/data/agent-demo.ts` uses real planned tool names with invented values; footnote links the S5 spike run | Transcript generated from a real `cutweave mcp --headless` run against a sample project | WP-1J (MCP v0), WP-2I (MCP v1), WP-7G.02 |
| GAP-04 | Downloads | No download button; "Follow on GitHub" is the primary action; status chip says "No download yet" | Download page: OS detection, checksums, signatures, system requirements | WP-3I.01 (unsigned alpha installers), WP-7A.02–05 (signed), WP-7G.01 |
| GAP-05 | "Connect your agent" snippet | Planned config snippet for `cutweave mcp --attach` labelled planned | A copyable, tested MCP config and `cutweave agent-kit install --client …` command | WP-1J, WP-1K (CLI), WP-6G/6H (Agent Kit) |
| GAP-06 | Template gallery | Not shown; plugins section mentions templates as planned | Filterable gallery generated from template pack previews | WP-6D.06–12, WP-7G.01 |
| GAP-07 | Docs site | Links to `docs/` on GitHub | Links into the docs site (user guide, MCP reference, SDK) | WP-7E.01–03 |
| GAP-08 | Command and tool reference (partly closed) | The generated reference exists in the product repo (`docs/reference/commands.md`, 43 commands from the registry; also `rpc.md`, `cli.md`, `launch-protocol.md`, `mcp-clients.md`), and `/how-it-works/` links to it on GitHub. The `/agents/` tool catalog is a separate component with its own status. | Links into the docs site's generated command reference | WP-7E.03 (docs site) |
| GAP-09 | Formal benchmarks | Spike numbers with the caveat "Informal, one Windows laptop", and numbers from work-package tests labelled "Measured in a work package test" with "Informal, one dev machine" (from merge and commit messages in the product repo, some from debug builds) | Numbers from the reference machines, all three OSes, with the budget dashboard | WP-0C.04, 0D.02, 0E.03, 0F.03, WP-7D |
| GAP-10 | Social proof | None, on purpose (no fake metrics, no star count) | Real quotes from dogfood and alpha users, contributor count, star count once meaningful | M2 dogfood, M3 Public Alpha, WP-3I.04 |
| GAP-11 | Community channels | GitHub repo, issues and security policy only | Discussions and a chat link | WP-7G.03 |
| GAP-12 | Sample projects | Not mentioned as available | "Open a sample" cards with previews | WP-7G.02 |
| GAP-13 | Social preview image | A generated `og.png` from the mark, tokens and the pitch line | Designed OG images per page, using real screenshots once GAP-01 closes | site work, after GAP-01 |
| GAP-14 | Logo refinement | v0 mark from `design/assets/logos/` | Designer-refined mark and wordmark files | P7 design pass |
| GAP-15 | Privacy page, accessibility statement, changelog | Short privacy and status notes on `/open-source/` and in the FAQ | Full privacy page, accessibility statement, release notes | WP-7F.04, WP-7G.01, first release |
| GAP-17 | Plugin exception status | Described as "draft, pending legal review" | State it as in effect, link the final text | Legal review (ADR-0011) |
| GAP-18 | AI provider and model list | Provider names as text from the research snapshot (2026-11-22), labelled planned | The live, signed model catalog with real cost ranges | WP-5* (gateway, catalog), M5 |
| GAP-19 | Real-footage imagery (partly closed) | `/how-it-works/` shows two frames from the production compositor's test goldens, labelled "Rendered by the production compositor (test golden)"; sources in `src/assets/README.md`. They are synthetic test cards, not footage. | Frames of real media rendered from sample projects by the product render pipeline | WP-1D (decode), WP-1I.05 (render wiring), WP-7G.02 (sample projects) |

## Upstream fixes noticed while building the site

These are in the main repo, not here:

- The product repo's `README.md` links the site at `https://cutweave.github.io` (added in e653c75). Point it at `https://cutweave.app`.
- The design-system reference artifact (claude.ai link) is private. The site links to `docs/07-design-system.md` on GitHub instead.

## Closed

| Id | Gap | What closed it |
|---|---|---|
| GAP-16 | Custom domain | The site moves to `https://cutweave.app` (2026-11-23). `astro.config.mjs`, `src/site.ts`, `public/robots.txt`, `scripts/check-links.mjs` and the README use it. There is no `CNAME` file: the site deploys through GitHub Actions, and the domain is set in the repository's Pages settings. |

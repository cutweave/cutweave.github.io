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
| GAP-08 | Command and tool reference | Tool names from the architecture doc, labelled as the planned catalog | Link to the generated command reference | WP-1N (codegen), WP-7E.03 |
| GAP-09 | Formal benchmarks | Spike numbers with "Informal, one Windows laptop" caveat | Numbers from the reference machines, all three OSes, with the budget dashboard | WP-0C.04, 0D.02, 0E.03, 0F.03, WP-7D |
| GAP-10 | Social proof | None, on purpose (no fake metrics, no star count) | Real quotes from dogfood and alpha users, contributor count, star count once meaningful | M2 dogfood, M3 Public Alpha, WP-3I.04 |
| GAP-11 | Community channels | GitHub repo, issues and security policy only | Discussions and a chat link | WP-7G.03 |
| GAP-12 | Sample projects | Not mentioned as available | "Open a sample" cards with previews | WP-7G.02 |
| GAP-13 | Social preview image | A generated `og.png` from the mark, tokens and the pitch line | Designed OG images per page, using real screenshots once GAP-01 closes | site work, after GAP-01 |
| GAP-14 | Logo refinement | v0 mark from `design/assets/logos/` | Designer-refined mark and wordmark files | P7 design pass |
| GAP-15 | Privacy page, accessibility statement, changelog | Short privacy and status notes on `/open-source/` and in the FAQ | Full privacy page, accessibility statement, release notes | WP-7F.04, WP-7G.01, first release |
| GAP-16 | Custom domain | `cutweave.github.io` | Own domain with HTTPS (Pages custom domain + `CNAME`) | Roadmap long-lead item (domain, trademark, handles) |
| GAP-17 | Plugin exception status | Described as "draft, pending legal review" | State it as in effect, link the final text | Legal review (ADR-0011) |
| GAP-18 | AI provider and model list | Provider names as text from the research snapshot (2026-11-22), labelled planned | The live, signed model catalog with real cost ranges | WP-5* (gateway, catalog), M5 |
| GAP-19 | Spike imagery is from spikes | Compositor golden frames labelled "Rendered by the compositor spike" | Frames rendered by the product render pipeline from sample projects | WP-1F/1H (render and preview), WP-7G.02 |

## Upstream fixes noticed while building the site

These are in the main repo, not here:

- `README.md` says "Status: planning" and `AGENTS.md` says "Current stage: Phase 0". Phase 0 is done (provisional GO) and Phase 1 is under way.
- The design-system reference artifact (claude.ai link) is private. The site links to `docs/07-design-system.md` on GitHub instead.

## Closed

None yet.

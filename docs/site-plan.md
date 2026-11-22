# Cutweave website: site plan

Owner: integrator. Inputs: [content-inventory.md](content-inventory.md) (what is true, with sources) and [research/competitor-sites.md](research/competitor-sites.md) (how others present themselves). Placeholders and missing assets are tracked in [content-gaps.md](content-gaps.md).

This plan is the contract for every agent building the site. If something here conflicts with the inventory, the inventory wins on facts and this plan wins on structure and tone.

## 1. Goal and audience

The site sells **the approach and the proof**, not a download. The project is pre-alpha (Phase 1 of 7). Visitors should leave knowing three things: an agent can edit in Cutweave without screenshots, the editor is meant to feel like CapCut but belong to you, and the work is happening in the open right now.

Audiences, in launch order:
1. **Agent builders and developers** (MCP users, Claude Code / Codex / Cursor people). They respond to concrete tool names, transcripts, architecture and numbers.
2. **Creators frustrated with CapCut** (paywalls, account, privacy, credits). They respond to "no account, no watermark, your keys" and an honest comparison.
3. **Contributors** (Rust, TS, design, plugin authors).

## 2. Positioning

- **Headline (home hero):** "Edit by hand. Or hand it to an agent."
- **Subhead:** "Cutweave is an open-source video editor for creators and their AI agents. Every edit is a command, so you and your agent work on the same timeline, and the agent sees rendered frames, not screenshots."
- **Second line for creators:** "CapCut-class editing you own: no account, no watermark, your own AI keys."
- **Status chip (always visible in the hero):** "Pre-alpha · Phase 1 of 7 · No download yet"
- **Hero actions:** primary (marigold) "See an agent edit" → `#demo`; secondary "Follow on GitHub" → https://github.com/cutweave/cutweave.
- **Spare lines to reuse:** "Agents see frames, not screenshots." · "No account. No watermark. No paywall." · "Say what it costs before it runs." · "Every edit is a command."

Do not use "AI-powered" as a headline. Do not say "free CapCut alternative" in the present tense.

## 3. Voice and honesty rules (non-negotiable)

Voice follows the Cutweave brand book (`D:\projects\Vidai\design\README.md` → Content fundamentals): plain, direct, calm, sentence case, "you", editing vocabulary, buttons start with a verb, no exclamation marks, no emoji, no hype words ("magic", "revolutionary", "viral", "#1", "best").

Every visual or claim carries one of these labels when it is not a shipped feature:

| Label | Use for | Component |
|---|---|---|
| **Design preview** | HTML/CSS recreations of the editor built from the design system | small chip on the visual's corner |
| **Illustrative** | Scripted demos that use real tool names with invented values | chip + one-line footnote |
| **Measured in a spike** | Benchmark numbers from Phase 0 spikes | footnote: "Informal, one Windows laptop. Formal runs pending." |
| `StatusChip`: built / in progress / planned / later | Features and comparison cells | always icon + word |

Claims to avoid until built (from the inventory): "Download", "available on Windows/macOS/Linux", "works offline", any count of effects, templates or caption styles as existing, plugins or AI Studio as available, "crash-proof", "real-time collaboration". No fake metrics, logo walls, testimonials or star counts. No screenshot of an agent driving a screen (it contradicts the core claim).

Brand color rules: **marigold = "here"** (primary action, playhead, the "you are here" marker on the roadmap, current selection). **Agent blue = AI/agent only** (agent transcript, proposals, AI cost chips, `AgentBadge`). Never decorative. Proposals are dashed and hatched until accepted.

## 4. Information architecture

Header nav: **Agents · How it works · Compare · Roadmap · Open source** + GitHub link + theme toggle.

| Route | Purpose | Key sections |
|---|---|---|
| `/` | Landing | Hero, pillars, agent demo, creator workflow, how it works teaser, AI without lock-in, plugins, CapCut teaser, proof strip, roadmap teaser, FAQ, closing |
| `/agents/` | MCP and agent deep dive | Why no screenshots, the full agent demo, tool catalog (planned names), proposals and the three-tier budget, Agent Kit, connect-your-client snippet (planned), the S5 spike evidence |
| `/how-it-works/` | Architecture for developers | One engine many clients diagram, the command lifecycle (command → Tx → patch → undo), render pipeline, flicks explainer, engineering facts table, tech stack |
| `/compare/` | Honest CapCut comparison | What CapCut does better today, the full table with status per cell, where we differ on purpose, who should not switch yet, coming-from-CapCut glossary |
| `/roadmap/` | Status and plan | Phase timeline P0–P7 with a marigold "you are here", what is built today, spike results, after 1.0 |
| `/open-source/` | Contribute and license | License model, plugin layers L0–L4, how to contribute (DCO, WPs, ADRs), built by agents under human review, governance links, security |
| `/404` | Brand-voice not found | exists |
| `/styleguide/` | Internal, noindex | exists |

## 5. Landing page, section by section

1. **Hero.** Headline, subhead, creator line, status chip, two actions. Visual: `EditorMock` (Design preview) with a slowly moving marigold playhead over a timeline of all five clip families, a preview pane, and a collapsed agent panel. Calm, no bouncing; static under reduced motion.
2. **Three pillars.** Agent-native (every edit is a command; MCP), Yours (no account, open format, your keys, GPL), Familiar (CapCut-class workflow, short and long form). One line each plus one fact.
3. **Watch an agent edit** (`#demo`). The `AgentDemo` player: an MCP transcript on one side (prompt → tool calls with compact JSON → an image block of a rendered frame → dry-run result → proposal) and the timeline on the other, changing in step. Silences become dashed agent-blue ghosts; a captions track appears; a proposal bar reads "Agent proposes 6 changes: remove 14 silences, add captions" with **Accept** / **Reject** the visitor can press. Play, pause, step, restart; keyboard accessible; reduced motion shows the final state with a stepper. Label: Illustrative, with a link to the real S5 spike run (four calls: `media_import` → `timeline_insert` → `clip_split` → `render_frame`, 3/3 passes).
4. **Made for creators.** The CapCut-familiar workflow: magnetic timeline, styled captions, text-based editing, templates, short-form and long-form workspaces. Small design-preview vignettes (caption style chips, transcript with struck-through filler words, 9:16 and 16:9 frames). Each with a StatusChip (planned · Phase N).
5. **How it works (teaser).** Compact version of the architecture diagram: UI, MCP agents, CLI and plugins all send commands to one Rust engine. Link to `/how-it-works/`.
6. **AI without lock-in.** Provider names from the inventory (as text, not logos), a cost chip in the brand format "~$0.40 · Kling 3.0 via fal", the three-tier spending authority in one line each, keys in the OS keychain, local models optional. Label planned · Phase 5.
7. **Plugins at every layer.** L0 data → L1 WGSL effects → L1.5 TSX compositions → L2 WASM → L3 UI panels (L4 native later). One tiny snippet. Planned · Phase 6.
8. **Compared with CapCut (teaser).** 6–8 rows from the comparison, link to `/compare/`.
9. **Proof, measured in spikes.** Four numbers: scrub p95 49.5 ms (budget 80), 5,000 clips at 60 fps, 35/35 sandbox escapes contained, 3/3 agent runs with no screenshots. Footnote the caveat.
10. **Roadmap teaser.** P0–P7 strip with marigold "you are here" at P1. Link to `/roadmap/`.
11. **FAQ.** Is it ready? Do I need an account? What do AI features cost? Why GPL? Can I build plugins? Will it run on the web or mobile? Who builds it? (Answers from the inventory.)
12. **Closing.** "Follow the build" with primary "Follow on GitHub" and secondary "Read the architecture".

## 6. Interactive centerpieces (the things that make the site memorable)

| Component | Where | Notes |
|---|---|---|
| `EditorMock` | home hero, reused small elsewhere | Pure HTML/CSS/SVG from tokens. Clip families with header strip + type icon. Timecode in JetBrains Mono, tabular figures. |
| `AgentDemo` | home `#demo`, `/agents/` | The scripted MCP session, data-driven from one JSON/TS script file so it can be regenerated from a real headless run later (GAP-03). |
| `ArchitectureDiagram` | `/how-it-works/`, compact on home | Accessible SVG, focus or hover a client to highlight its path through bus → Tx → doc → render. Text alternative. |
| `FlicksExplainer` | `/how-it-works/` | Pick a frame rate or sample rate, see the exact integer flicks per frame/sample. |
| `RoadmapTimeline` | `/roadmap/`, compact on home | Marigold "you are here". |
| `CompareTable` | `/compare/`, teaser on home | Data-driven, StatusChip cells. |
| `BudgetTiers` | `/agents/`, compact on home | Auto / Agent-confirmed / Human-approved with the brand's over-budget copy. |

All interactivity is small vanilla TS in Astro `<script>` tags (no framework runtime). Everything works with keyboard, has visible focus, respects `prefers-reduced-motion`, and degrades to a readable static state without JS.

## 7. Real imagery we can use now

- Storybook baselines from the main repo: `D:\projects\Vidai\packages\ui\__screenshots__\windows-chromium-sw\{dark,light}\` (timeline canvas `stress-5000-clips`, `filmstrips`, `zoomed-waveform`, component states). Label "Design system, in development".
- Compositor spike golden frames: `D:\projects\Vidai\spikes\s4-compositor\tests\golden\<adapter>\` (`demo_f0000/f0150/f0299.png`, `blend_modes.png`, `text_caption_msdf_f0064.png`, `text_multiscript_msdf.png`). Label "Rendered by the compositor spike".
- Logos: `public/brand/`.

Copy only what a page uses, optimise it (Astro `<Image>` or pre-sized WebP/PNG), and record the source path in `src/assets/README.md`.

## 8. Technical constraints

- Astro static site, TypeScript strict, pnpm. Design tokens from `src/styles/tokens.css` (copied, never hand-edited); website-only values in `src/styles/site-tokens.css`. No literal colors, sizes or font stacks in components.
- Zero third-party requests at runtime: no CDNs, no analytics, no embeds.
- Targets: Lighthouse ≥ 90 performance, ≥ 95 accessibility; WCAG 2.2 AA; works at 360 px width with no horizontal scroll; both themes.
- SPDX header `GPL-3.0-or-later` on authored source files.
- Placeholders are marked in code with a comment `GAP-NN` matching [content-gaps.md](content-gaps.md), so they are easy to find and replace.

## 9. Build plan (work packages for agents)

| WP | Scope | Owns (files) |
|---|---|---|
| S0 | Scaffold, base components, CI | done by the scaffold agent |
| S1 | `EditorMock` + `AgentDemo` + demo script data | `src/components/demo/`, `src/data/agent-demo.ts` |
| S2 | `/agents/` and `/how-it-works/` with `ArchitectureDiagram`, `FlicksExplainer`, `BudgetTiers` | those two pages, `src/components/agents/`, `src/components/engine/` |
| S3 | `/compare/`, `/roadmap/`, `/open-source/` with `CompareTable`, `RoadmapTimeline` | those three pages, `src/components/compare/`, `src/components/roadmap/`, `src/data/{compare,roadmap}.ts` |
| S4 | Landing page assembling everything, OG image, favicon PNGs | `src/pages/index.astro`, `src/components/home/`, `public/og.png` |
| S5 | Integration review: copy pass, accessibility, Lighthouse, links | integrator |

S1–S3 run in parallel in separate git worktrees; S4 runs after them because it reuses their components. Shared files (`BaseLayout`, `src/components/ui/`, `site-tokens.css`, `global.css`) are read-only to page agents: a needed change goes in the hand-back notes, or a new token goes in `src/styles/area-<wp>.css` imported by that agent's own components.

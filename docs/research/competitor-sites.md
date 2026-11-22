# Competitor and benchmark marketing sites

Research date: 2026-11-22. Method: one fetch per homepage (text extraction, so visuals and animation are inferred where noted) plus one search for newer agent-oriented editors. Copy is paraphrased; the few quotes are under 15 words. Claims such as user counts are the vendors' own and unverified.

## 1. Per-site notes

### Video tools

| Site (URL) | Hero (paraphrase) | CTAs | Product shown by | Notable |
|---|---|---|---|---|
| CapCut (capcut.com) | "AI-powered photo and video editor for everyone"; trending content for YouTube, Instagram | Try online free; Download; "no credit card" | Thumbnails and screenshots, card grid | AI studio grid, "switch models in a click" section (third-party models), EditPilot assistant, templates, testimonials, stats (700M monthly users claimed). No prices on page. Web-first push; the desktop download is secondary. |
| Descript (descript.com) | "AI video editor": direct an AI co-editor or edit by hand; edit video like text | Get started free; Book a demo | Screenshots per workflow step | Enterprise logos, three testimonials, G2 4.6 (936 reviews), outcome metrics, FAQ. Five-step flow: record, edit, refine, share, multiply. Enterprise-skewed. |
| Runway (runway.com) | Intelligent tools for scaling content and teams; "world models" research framing | Try free; Contact sales; Get API key | Mostly text and cards, per-audience platforms (Creative, Dev, Robotics) | Research-lab positioning, news carousel, open-weight model mention (Apache 2.0). Has moved away from "editor" messaging. |
| Higgsfield (higgsfield.ai) | Black Friday promo hero with countdown | Get plan with discount; Connect Higgsfield MCP | Looping outputs, creator-credited galleries, view counts, "Recreate" buttons | Feature grid includes Claude MCP, agent, editing room; use-case section for MCP. Gallery-driven, no UI screenshots. Promo-heavy, high noise. |
| VEED (veed.io) | "The video agent that edits for you"; idea to brand-ready video | Create AI video; Clone yourself | Hero carousel of example videos | Brand-kit messaging, named third-party models, big-logo bar, G2 badges, ~30 tool-page links. No UI shown at all. |
| Clipchamp (clipchamp.com/en/) | "Online video editor", no skills needed | Create a video; Download for Windows | Alternating image/text blocks | AI voiceover, subtitles (80+ languages), recorders; free-export and no-watermark claims; ratings. Generic, feature-list page. |
| Kapwing (kapwing.com) | "Make a video about anything" from a prompt | Start editing; Connect Claude; Connect ChatGPT | Screenshots and editor preview | A dedicated MCP setup section with server URL and connect buttons, high on the page. 30M creators claim, Google 4.9 rating. |
| OpusClip (opus.pro) | Long videos to short clips with AI; publish in one click | Sign up free; 90 free credits | Creator cards, mock UI | Social proof by creator follower counts (up to 65.9M), named AI models, FAQ, self-reported metrics. Also publishes MCP-for-video blog guides. |
| Submagic (submagic.co) | Unedited footage to viral shorts via AI agents | Try for free; Get a demo | Mock UI screenshots in a 4-step flow | Announces an AI editing agent ("Iris"), Trustpilot and G2 badges, case study, FAQ. |
| DaVinci Resolve (blackmagicdesign.com/products/davinciresolve) | Product name plus pro post-production line | Free download; Buy Studio ($236) | Autoplay hero video, UI screenshot carousels | "Two great versions" free-vs-Studio comparison; page-by-page tour (Cut, Edit, Color, Fusion, Fairlight); heavy vendor claims, no testimonials. Pricing is explicit. |
| Kdenlive (kdenlive.org) | Free and open-source video editor, four OSes | Download; Donate | Feature sections, screenshots | KDE community framing, release notes, volunteer team, donations. Honest but dated; no differentiation or story. |
| Shotcut (shotcut.org) | Free open-source editor on Windows, Mac, Linux | Click to download | One (older) screenshot | Plain text blocks, news list, origin story, dependency logos (FFmpeg, MLT). Credibility through cadence and lineage. Visibly neglected design. |
| OpenCut (GitHub: OpenCut-app/OpenCut; opencut.app returned an error) | README tagline: the open-source CapCut alternative | Status and dev setup | README only | About 99k stars, MIT. README says it is being rewritten, and lists plugins, a shared Rust core, an MCP server and headless mode as planned. Contributions closed for now. Direct overlap with Cutweave messaging; their star count is the proof that the audience exists. |

### Newer AI-first or agent-oriented editors (found by search; not all pages fetched)

| Product | What it is | Note |
|---|---|---|
| invideo MCP (invideo.io/news/introducing-invideo-mcp/) | Browser multitrack editor driven by external agents (Sept 2026) | Announcement has no demo asset at all; the story is a described scene: agent cursor labeled with its name on the timeline, human can take over any time. Free manual editor, credits for generation. |
| Palmier Pro (reported by chatai.com, June 2026) | macOS editor with built-in MCP server and AI generation | Reported as open source plus free tier with no account; paid generation credits (about $29/month). Closest conceptual competitor; Mac-only. Verify its own site before the Cutweave site makes any comparison claim. |
| Kinocut / mcp-video (github.com/KyaniteLabs/kinocut) | Local FFmpeg-based MCP server, 200+ tools | Open source, but a tool belt for agents, not an editor with a UI. |
| Clueso MCP (Product Hunt, Sept 2026) | Agent access to a screen-recording and tutorial video engine | Chat to adjust parameters, then open the web editor. |
| Tella MCP, OpusClip MCP | Hosted MCP servers (100+ tools reported for Tella) | Hosted, account-bound. |

Pattern: nearly all "MCP for video" products are hosted, credit-priced, and account-gated, or are FFmpeg wrappers. None of those found shows structured state plus rendered frames as the agent interface.

### Design benchmarks

| Site (URL) | Hero (paraphrase) | CTAs | Product shown by | Notable |
|---|---|---|---|---|
| Zed (zed.dev) | "Your last next editor"; fast editor for humans and AI | Download now; Clone source (GitHub) | Stylized editor mockup, short feature videos | Three pillars (fast, agentic, collaborative); developer-name testimonials (credible people, not logos); open-weight model mentions; founders' letter; blog. Open source is a first-class CTA, not a footer link. Agent-agnostic (ACP, MCP). |
| Remotion (remotion.dev) | "Make videos programmatically"; React, agents, bulk render | Get started (docs); copyable `npx create-video`; GitHub, Discord | Text, cards, install command; links to Studio, Player | A full section on "turn your idea into a video using your agent" (skills, plugins, WebMCP). Transparent license and pricing tiers with a worked example and a quiz. Hard numbers: 74K stars, 6M+ monthly installs, 12K Discord members. The most honest pricing page in the set. |
| Tauri (tauri.app) | Small, fast, secure cross-platform apps | Get started | Tabbed install commands | Almost no marketing; four one-line value props; sponsor logo grids. Shows that a terse OSS site can still work when the audience is developers. Too bare for creators. |
| Linear (linear.app) | Product system for teams and agents | Get started; Contact sales | Text-based UI recreations (issue with activity feed, boards, diffs) | The best model for showing UI through recreated, real-looking interface fragments instead of screenshots. Agents positioned as teammates. Changelog on the landing page. Short, specific testimonials from named engineers. |
| Raycast (raycast.com) | "Your shortcut to everything"; extendable launcher | Download for Mac | Screenshots, keyboard graphic, extension tabs | Extension store as a showcase, a chat mockup for AI agent, named-person testimonials, a developer API section, a crash-free-rate stat. Platform-specific (Mac) CTA. |
| Warp (warp.dev) | Agent-factory infrastructure ("factories as code") | Request early access; Download | Config code snippet, stylized dashboards, layer diagram | Pivoted hard into agents; "open at every layer" section on any model or harness; FAQ with realistic expectations; benchmark case study. Dense and enterprise-flavoured; the "bring any model/harness" framing is the transferable part. |

Fetch caveat: the Linear page contained a note addressed to AI agents inside its content; it was ignored as page content and is not an instruction.

## 2. Cross-site patterns

**What nearly everyone does**
- Lead with "AI" in the first line, then a free-trial CTA. In the consumer video tools the hero is a prompt-to-video pitch, and the real editor is secondary.
- No prices on the homepage; pricing is a separate page. (Exceptions worth noting: Resolve and Remotion state prices up front.)
- Social proof by logo wall, vendor-claimed user counts (millions), and G2/Trustpilot badges.
- A "model switcher" or list of named third-party models (Sora, Veo, Kling, Seedance) as the AI credibility signal.
- MCP and agents are now a headline item (Kapwing, Higgsfield, invideo, Remotion, Raycast, Linear, Warp), but almost always as a connector to a hosted service.
- Product shown through output videos or polished screenshots, not through how it works.
- Closing CTA repeats the hero CTA; large footer of SEO tool links.

**What the best sites do differently**
- Linear and Zed show the product as stylized, plausible interface recreations, often with an agent thread present, so the page itself feels like the product.
- Remotion and Tauri give a copyable command in the hero; the reader does something in 10 seconds.
- Zed puts "Clone source" next to "Download", making open source a trust signal rather than a licence footnote.
- Remotion treats pricing and licensing as content: tiers, worked example, quiz.
- Named, credible-person testimonials (Zed, Raycast, Linear) beat anonymous quotes and logos.
- Hard, checkable numbers (GitHub stars, installs, Discord members, crash-free rate) beat "millions of creators".
- Warp and Zed say "any model, any agent" instead of tying the product to one model.

**What feels generic or weak**
- "For everyone" headlines (CapCut, Clipchamp, Kapwing); the product category is the hero and nothing is memorable.
- Countdown and discount heroes (Higgsfield); unverifiable "#1" claims (OpusClip, Resolve).
- Plain-text OSS sites (Shotcut, Kdenlive): honest, but they undersell and look abandoned.
- Pages whose only product visual is generated output (VEED, Higgsfield), so you learn nothing about the tool.
- Metadata that disagrees with visible copy (OpusClip's FAQ numbers versus its structured data): minor, but it erodes trust.

## 3. Positioning gaps Cutweave can own

No site reviewed credibly occupies the intersection of all of these, and the combination is the position:

1. **Open source plus a real editor plus agent control.** Kdenlive and Shotcut are open but have no agent story; the hosted MCP products are agent-ready but closed and credit-priced; OpenCut has the audience and stars but its MCP, plugins and Rust core are still plans; Palmier Pro is the closest, but reported as macOS only. Cutweave: cross-platform, GPL, MCP as the design principle.
2. **"The agent never looks at a screenshot."** Structured state plus rendered frames is a concrete, technical claim that no one else makes. It is memorable, demonstrable (transcript), and credible to the developer audience.
3. **Bring-your-own keys with visible cost.** Every consumer tool sells credits and opaque pricing. A cost estimate before each AI action, paid to the model provider, is a trust story CapCut cannot tell.
4. **No account, no telemetry, open project format.** Competitors push sign-up in the hero ("no credit card" is the most they offer). "No account" is a primary CTA advantage and a counterpoint to CapCut's privacy history.
5. **Plugins at every layer.** Raycast and Zed prove an extension story sells. In video, nobody shows an effect, transition, AI provider or MCP tool plugin ecosystem.
6. **Honesty about status.** Everyone else overclaims. A site that states plainly "pre-alpha, here is the roadmap, here is what works" will stand out and fits the audience.

Weak spot to respect: Cutweave cannot claim ease, speed, or a finished editor yet, so the site must sell the approach and the proof of architecture, and invite followers and contributors, not downloads.

## 4. Recommendations for the Cutweave site

### 4.1 Landing page section order
1. Hero: headline, subhead, two CTAs (see 4.2), small status chip ("Early development, no download yet"), hero visual.
2. Three pillars in one row: Open (GPL, open format), Agent-native (MCP), Yours (no account, your keys).
3. "Watch an agent edit": live-looking MCP transcript beside a timeline recreation (see 4.3).
4. Easy for humans too: the CapCut-class workflow (captions, templates, text styles, timeline) shown with design-system recreations.
5. How it works: one architecture diagram (UI, MCP, CLI, plugins are all clients of one command bus on a Rust engine).
6. AI without lock-in: provider list, BYO keys, cost estimate shown before running, local models as optional fallback.
7. Plugins at every layer: a grid of the extension points with a tiny manifest or code snippet.
8. Honest comparison: "Cutweave vs CapCut" table (see 4.4), plus a link to a fuller page.
9. Roadmap and status: what exists, what is next, how far along (public phases, repo activity).
10. Join in: GitHub (stars once meaningful), Discord/discussions, contributing, a newsletter-free "watch releases" link.
11. FAQ: "Is it ready?", "Why GPL?", "Do I need an account?", "How much do AI features cost?", "Will it be on mobile/web?"
12. Closing CTA and footer (license, DCO, privacy statement, project format spec).

### 4.2 Hero headline directions (draft, for the team to test)
- **A. Agent-native:** "The video editor your agent can actually use." Subhead: every edit is a typed command, so AI works on structure and rendered frames, not screenshots. CTAs: See an agent edit; Star on GitHub.
- **B. Open and owned (CapCut alternative):** "A CapCut-class editor you own." Subhead: open source, no account, no telemetry, your own AI keys, an open project format. CTAs: Read the roadmap; Star on GitHub.
- **C. Two-way control:** "Edit by hand. Or hand it to an agent." Subhead: one engine, two equal ways to work; everything the UI does, MCP and the CLI can do. CTAs: Watch the demo; Follow development.

Recommendation: lead with A or C for the first launch audience (developers, agent builders), keep B as the second headline/sub-hero line for creators. Do not use "AI-powered" as the headline.

### 4.3 Showing a product without a finished UI
- **Interactive recreations from our design system** (the Linear/Zed approach): build timeline, inspector and agent-thread fragments as real HTML/CSS with the tokens from `design/tokens.json`, animated on scroll. Label them honestly as "design preview" so nobody reads them as a shipped build.
- **Live MCP transcript demo:** a scripted, replayable terminal or chat panel showing real tool calls (e.g. add clip, trim, get state, render frame) beside a timeline that changes in step. Use real command names and real JSON from the engine. Better: generate the transcript from an actual headless run, with a "replay this in your terminal" snippet once the CLI exists.
- **Architecture visuals:** one diagram of the command bus (clients on the left, engine in the middle, render/audio/plugins on the right), and a small before/after: a screenshot-clicking agent versus Cutweave's state-plus-frame loop.
- **Real artifacts instead of mockups wherever they exist:** a headless-rendered frame sequence, a project file excerpt, a plugin manifest, a cost-estimate dialog.
- **A copyable command in the hero or demo** (Remotion/Tauri trick), once something is runnable: `cutweave` CLI or an MCP config snippet to paste into an agent.
- **Progress as proof:** a visible phase tracker and recent-commit or release feed (Linear's changelog idea) beats screenshots of a UI that does not exist yet.

### 4.4 Honest "Cutweave vs CapCut" patterns
- Lead with what CapCut does better today: a finished mobile and web app, huge template library, built-in generation, polished effects. Say it up front.
- Use a plain table with rows for: license, source available, account required, telemetry, project format, AI models (CapCut's bundled credits versus BYO keys), agent/MCP control, plugins, platforms, pricing, maturity ("Cutweave: pre-alpha").
- Mark each cell as "today", "planned (phase N)", or "not planned", linked to the roadmap. Date-stamp the page and link to sources for every CapCut claim (its own terms and pricing pages).
- Avoid claims about CapCut's behaviour that cannot be cited; keep privacy comparisons to documented facts (terms, data policy) and phrase Cutweave's side as design commitments.
- Add a "Who should not switch yet" section. Resolve's and Remotion's candour about tiers shows readers reward this.
- Same format for later pages (vs Kdenlive/Shotcut/OpenCut), kept neutral and respectful toward other open-source projects; OpenCut and Kdenlive are community peers, not enemies.

### 4.5 Anti-patterns to avoid
- "For everyone" or "AI-powered" headlines; "#1", "best", "viral" claims.
- Fake metrics, logo walls, or testimonials; star counts before they are real. Use roadmap and repo transparency as the proof until there are real users.
- Presenting mockups as a working app; implying downloads exist when they do not.
- Countdowns, urgency, and discount banners.
- Autoplay-with-sound video; hero videos that hide the actual interface.
- Screenshots of an agent driving a screen, which contradicts the core claim.
- Hosting-model confusion: the site must state clearly that Cutweave sells nothing and has no hosted AI. Do not use language like "credits".
- Sign-up or newsletter walls; third-party trackers or analytics that contradict the privacy promise (use none, or self-hosted and cookie-free, and say so).
- Overwhelming SEO tool-link footers; one clean footer is enough.
- Dense enterprise framing (Warp, Descript): Cutweave's audience is creators and builders.

## 5. Sources

- https://www.capcut.com/
- https://www.descript.com/
- https://runway.com/
- https://higgsfield.ai/
- https://www.veed.io/
- https://clipchamp.com/en/
- https://www.kapwing.com/
- https://www.opus.pro/
- https://www.submagic.co/
- https://www.blackmagicdesign.com/products/davinciresolve
- https://kdenlive.org/
- https://shotcut.org/
- https://github.com/OpenCut-app/OpenCut (opencut.app itself was not retrievable)
- https://invideo.io/news/introducing-invideo-mcp/
- https://www.chatai.com/posts/palmier-pro-brings-ai-video-generation-and-editing-into-one-timeline
- https://github.com/KyaniteLabs/kinocut and https://www.opus.pro/blog/best-mcp-servers-for-video (via search results)
- https://zed.dev/
- https://www.remotion.dev/
- https://tauri.app/
- https://linear.app/
- https://www.raycast.com/
- https://www.warp.dev/

Limits: homepage text only (no visual or animation inspection, so "how shown" is partly inferred); product-feature and pricing claims are the vendors' own; Palmier Pro details come from secondary reporting and need checking on its own site; "vs" pages by competitors were searched for but none were found on the fetched homepages.

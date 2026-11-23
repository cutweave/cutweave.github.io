# Cutweave website content inventory

Compiled 2026-11-22 from the main repo (`D:\projects\Vidai`, 166 commits, HEAD `6ca1af7`) and refreshed 2026-11-23 to HEAD `7728d7c` (310 commits; 28 work packages merged in between). Statuses below are as of `7728d7c`; merge-commit refs are short hashes in the main repo. Every claim cites a doc, a WP id or a commit. Anything not in the docs is marked *illustrative*.

**Read this first: the project is pre-alpha.** There is no installer, no public demo video, and no way to import, play or export real video yet: the FFmpeg backend is not in yet (spike S3 was unblocked on 2026-11-23 and is running). Phase 0 spikes are done (go with changes, signed off 2026-11-23, `docs/milestones/M0-go-no-go.md`; facts re-checked against origin/main `981e5a2`) and Phase 1 is under way: 40 of its 60 work packages are merged (`docs/wbs/P1-skeleton.md`). The engine now has a command bus with undo, a journal and crash recovery, a JSON-RPC server, an MCP server, a core-only CLI, an audio mixer with a device clock, a wgpu compositor and a live timeline in the editor, all exercised by tests and, in dev builds, against a stub media backend (R27). The repo's README and `AGENTS.md` were corrected to say Phase 1 in `e653c75`. The site must not imply a product you can download. See section 12.

Source key: `arch §N` = `docs/01-architecture.md §N`; `brief` = `docs/00-product-brief.md`; `parity` = `docs/03-feature-parity.md`; `roadmap` = `docs/04-roadmap.md`; `M0` = `docs/milestones/M0-go-no-go.md`; `ADR-NNNN` = `docs/adr/`.

---

## 1. Positioning

**Pitch, as the docs state it**

- README: "The open-source video editor for creators and their AI agents." Subline: "CapCut-class speed and ease for short-form *and* long-form video. Fully drivable over MCP, open to plugins everywhere, and connected to the leading AI models with your own keys." (`README.md`)
- Brief vision: "A fully open-source, desktop-first video editor with CapCut-class ease and speed for short-form social and long-form YouTube creators. It is AI-native, agent-controllable (full MCP), and extensible." (`brief` Vision)
- Architecture one-liner: "Cutweave is one headless engine with many clients." (`arch §1`)

**Audience** (`brief` D3): short-form social and long-form YouTube creators equally, plus people who run AI agents against an editor.

**Three alternative taglines** (voice per `design/README.md` "Content fundamentals": plain, direct, calm, sentence case, no exclamation marks, no emoji)

1. "A video editor you own, that your agents can use too."
2. "Edit like CapCut. Keep your files, your keys and your account."
3. "Every edit is a command. You can make it, or your agent can."

Spare lines in the same voice: "Agents see frames, not screenshots." / "No account. No watermark. No paywall." / "Say what it costs before it runs." (the last mirrors `design/README.md` "AI and agents").

**Voice rules for site copy** (`design/README.md`)
- Address the reader as "you". Use editing vocabulary: clip, track, playhead, keyframe, ripple, render.
- Buttons start with a verb and name the result ("Download Cutweave" is fine once it exists; "Get started" is not).
- Costs are estimates with a tilde and the model: "~$0.40 · Kling 3.0 via fal".
- Marigold marks "here" (primary action, playhead). Agent blue marks AI/agent content. Never use agent blue for an ordinary button.
- Display type (Bricolage Grotesque) is allowed on the website; the product UI never uses it (`design/README.md` Typography).

---

## 2. Pillars

Six pillars. Pillars 1–4 and 6 mirror the README pillar table; pillar 5 (Yours) is split from "Plugins".

### 2.1 One engine, many clients
**Claim:** Anything the interface can do, an agent, a script or a plugin can do.
- Every mutation is a registered command on one bus; the UI, MCP server, CLI and plugins are all clients (`arch §1`, `brief` principle 1).
- A CI parity test enumerates the command registry and asserts every non-`view` command is reachable over MCP with an identical schema (`arch §14`, ADR-0002, ADR-0005).
- One Rust binary, `cutweave`, runs as GUI engine, MCP server, CLI or headless renderer (`arch §2`, ADR-0002).
- The engine runs in its own process; a GPU, decoder or plugin crash does not take the UI down, and the engine recovers from a journal (`arch §2`; the journal itself is not built yet).

### 2.2 Creator-grade editing, CapCut-familiar
**Claim:** The workflow creators know, without the paywall.
- Magnetic main track, multi-track, snapping, ripple/roll/slip/slide, keyframes with a bezier graph editor, compound clips (`roadmap` P2, `parity` §2–3).
- Styled auto-captions (>= 25 styles), text-based editing, silence and filler removal, text animations (`roadmap` P3, `parity` §6).
- >= 40 transitions, >= 50 effects, >= 40 filters/LUTs, masks, chroma key, scopes (`roadmap` P4).
- Layout is CapCut-familiar and dockable, with "Short-form" and "Long-form" workspaces (`arch §16`).

### 2.3 Any model, your keys
**Claim:** Use the leading AI models without a credits system.
- Cloud-first gateway: fal, Replicate, OpenRouter, Higgsfield plus direct Anthropic, OpenAI-compatible, Google Gemini, ElevenLabs, Runway, Deepgram/AssemblyAI (`arch §13`).
- Cost estimate before every run; per-project and monthly budget caps (`arch §13`, `design/README.md`).
- Keys live in the OS keychain; the engine makes all provider calls; keys never reach the renderer, plugins or MCP clients (`arch §13, §18`).
- Local models (whisper.cpp, ONNX) are an optional provider and an offline fallback (`brief` D2, `roadmap` P5).

### 2.4 Built for agents
**Claim:** Agents get hands and eyes, plus a kit that makes them good at video.
- 100% of capabilities over MCP; agents get rendered frames, contact sheets, filmstrips and waveforms as images, never screenshots (`brief` D5, `arch §14`).
- Agent Kit: ~14 skills, 13 MCP prompts, preset/prompt packs, client installers, a nightly eval harness (`arch §14b`).
- Proposals: an agent's edits can be held as a pending, dashed proposal until a person accepts; undo is per actor (`arch §5.2, §14b`).
- Spending authority is enforced by the engine, not the model (`arch §13`).
- Evidence: in the S5 spike, Claude Code completed "import, cut, show me the frame at 3 s" 3 of 3 times with only Cutweave MCP tools and no screenshots (`spikes/s5-command-bus/AGENT-RUN-REPORT.md`, `M0`).

### 2.5 Plugins at every layer
**Claim:** Extend it with data, GPU shaders, TypeScript, WASM or UI panels.
- Layers L0 data packs, L1 WGSL effects, L1.5 TSX compositions, L2 WASM components, L3 UI panels, L4 native (v2+) (`arch §15`, ADR-0010).
- A plugin command appears in the palette, CLI and MCP automatically (`arch §15`).
- Built-in effects, transitions and providers use the same interfaces third parties do (`brief` principle 5).
- Plugin SDK, WIT and composition runtime are MIT/Apache-2.0, with a written plugin exception (`ADR-0011`; the exception text is a draft, see section 11).

### 2.6 Yours
**Claim:** No account, no telemetry by default, open formats.
- No account, no watermark, no feature tiers (`brief` principle 8, `parity` §10–11).
- Open, documented project format: a folder with a JSON document, journal and backups (`arch §17`, ADR-0006); OTIO import/export planned (`roadmap` P6).
- Crash reports are opt-in and scrubbed; update checks can be disabled (`arch §18`).
- GPL-3.0 core; DCO instead of a CLA (`ADR-0011`).

---

## 3. Feature catalog

**Status legend (honest, as of HEAD `7728d7c`)**
- **Built**: code exists in the repo now. This does **not** mean a user can do it in the app today; the editor is a shell over a stub media backend and no real video can be imported, played or exported (see 3.11).
- **In progress**: a current Phase 1 WP, partly merged.
- **Planned for v1**: in the roadmap with a phase and WP epic; no code yet.
- **Later**: post-1.0 (`roadmap` "After 1.0") or deferred.

Phase map: P0 foundations and spikes (done; M0 go with changes, signed off 2026-11-23) · P1 walking skeleton (in progress) · P2 core editor · P3 text, captions, transcripts (Public Alpha) · P4 effects, transitions, color · P5 AI gateway and AI Studio · P6 plugins, templates, Agent Kit, copilot (Beta) · P7 hardening and 1.0. Dates are rough; `roadmap` says about 14 months to 1.0 and about 7.5 to Public Alpha.

### 3.1 Editing and timeline

| Feature | Status | Phase | Evidence |
|---|---|---|---|
| Project model: project, media, sequences, tracks, items, transitions, keyframe-ready props, frame-exact flicks time, typed IDs, migrations | **Built** | P1 | crate `cutweave-model` (~6,300 lines), merge `1d54d9c` (WP-1A.01–03) |
| Undo/redo, invertible transactions, per-actor history, command registry, `#[command]` macros | **Built** | P1 | `cutweave-commands`, `cutweave-commands-derive`: merges `bf884fb` (WP-1B.01/02), `bfb6e46` (WP-1B.04 per-actor undo history, `edit.*` commands, checkpoints), `e754253` (WP-1B.07 registry-driven property harness) |
| Single-writer document actor: lock-free snapshots, revisions, events, request-id dedup, connection-owned transactions with soft locks | **Built** | P1 | merges `d6cc82e` (WP-1B.03; no-op round trip p95 26 µs), `a1b485f` (WP-1B.09) |
| Editing commands: `project.*`, `media.*`, `track.*`, `timeline.insert/get`, `clip.split`, `clip.trim`, `item.move`, `item.delete`, `item.set_props`, `item.get` (43 registered commands in total) | **Built** (engine; no UI path to real media) | P1 | merges `2cbe927` (WP-1B.05), `989daff` (WP-1B.06), generated `docs/reference/commands.md` |
| Deterministic-ID mode: seeded ID, request and job streams; byte-identical documents across runs | **Built** | P1 | merge `d9acbe3` (WP-1B.08) |
| Project folder, atomic save/open, lock file | **Built** | P1 | `cutweave-engine::project_io`, merge `6704d40` (WP-1C.01) |
| Command journal, replay and crash recovery; autosave (2 s idle or every 30 s) with the last 10 backups | **Built** (engine) | P1 | merges `55130b8` (WP-1C.02), `69bac6d` (WP-1C.03) |
| Debounced UI-state persistence; `view.get/set/select/set_playhead/set_zoom` | **Built** | P1 | merge `6ca1af7` (WP-1C.04) |
| Timeline renderer: virtualized Canvas2D, hit-testing, filmstrip/waveform rendering, 5,000 clips at 60 fps | **Built** (as a component, with Storybook stories) | P1 | `packages/timeline`, merge `493a345` (WP-1M.05) |
| Timeline evaluation to a scene description | **Built** | P1 | `cutweave-render`, merge `bb9617c` (WP-1F.01) |
| Editor shell: dockable CapCut-style layout, workspaces, themes, i18n scaffold | **Built** (shell) | P1 | `packages/editor`, merge `1817e7b` (WP-1M.01) |
| Live read-only timeline from the engine (RPC connection, stores, document mirror) | **Built** | P1 | merge `5fbf6f5` (WP-1M.02) |
| Timeline interactions: select, move, trim, split, delete, snapping, marquee, gesture transactions (one history entry per drag) | **Built** (tested against a real engine with stub media) | P1 | merge `41fe7cd` (WP-1M.06) |
| Media bin: import dialog, OS drag-drop, cards, removal, keyboard, drop onto the timeline (placeholder thumbnails) | **Built** (stub media only) | P1 | merge `d0ab5d2` (WP-1M.03) |
| Import real media, playback, preview panel, inspector, save/open UI, export on a 2-track timeline | In progress (real media follows the S3 FFmpeg spike, unblocked 2026-11-23) | P1 (M1) | `docs/wbs/P1-skeleton.md`; WP-1M.04, 1M.07, 1M.08; gate WP-1O.04 |
| Crash recovery UI (restore or discard dialog on open) | Planned for v1 | P1 | WP-1M.07; the engine side and automatic recovery after an engine restart are built (WP-1C.02, WP-1L.03) |
| Engine supervision: restart after a crash, journal recovery, exactly-once resend of unacknowledged commands, failed dialog after a fourth crash in 60 s | **Built** | P1 | merges `043114c` and `149370d` (WP-1L.03) |
| Unlimited tracks, magnetic main track, ripple/roll/slip/slide, snapping, markers, linked clips, multi-select | Planned for v1 | P2 (M2) | `roadmap` P2, `parity` §2 |
| Compound clips, replace clip, multiple sequences, aspect presets (16:9, 9:16, 1:1, 4:5, 21:9), background fill | Planned for v1 | P2 | `roadmap` P2, `parity` §3 |
| Keyframes on every animatable property, easing, graph editor | Planned for v1 | P2 | `roadmap` P2 |
| Speed 0.1x–100x, reverse, freeze frame, pitch-preserving | Planned for v1 | P2 | `parity` §2 |
| Speed curves (montage, hero, bullet), optical-flow slow-mo | Planned for v1 | P4 | `parity` §2 |
| Proxies, relink, collect and archive, media bin search and tags | Planned for v1 | P2 | `roadmap` P2 |
| Shortcut editor with NLE and CapCut presets; command palette listing every command | Planned for v1 | P2 | `arch §16`, `parity` §2 |
| Multicam | Later | post-1.0 | `parity` §2, `roadmap` After 1.0 |

### 3.2 Text and captions

| Feature | Status | Phase | Evidence |
|---|---|---|---|
| Animated MSDF text (1,000 animated glyphs in 0.70 ms on an AMD iGPU) | Built as a **spike** only (not product code) | P0 | `spikes/s4-compositor`, ADR-0007 (accepted, provisional) |
| Rich text, outline, shadow, glow, box, gradient, curved text, presets (30) | Planned for v1 | P3 (M3) | `roadmap` P3, WP-3A, 3C |
| Text animations in/out/loop; per-glyph, word, line animators | Planned for v1 | P3 | `roadmap` P3 |
| Auto captions, transcript-first, word-level timing, speaker labels | Planned for v1 | P3 | `arch §11`, WP-3D |
| Caption style gallery (>= 25; active-word highlight, karaoke, pop, bounce, emoji) | Planned for v1 | P3 | `roadmap` P3, WP-3E |
| SRT/VTT/ASS import/export, burn-in or sidecar, bilingual layout | Planned for v1 | P3 | `roadmap` P3 |
| Text-based editing, silence removal, filler-word removal with a review UI | Planned for v1 | P3 | `roadmap` P3, WP-3F |
| Captions follow their source clip when it moves, trims or changes speed | Planned for v1 | P3 | `arch §11` |
| Lyrics recognition, LRC import | Planned for v1 (may slip) | P3 | `parity` §6 |
| Caption translation, dubbing | Planned for v1 | P5 | `parity` §6 |

### 3.3 Effects and color

| Feature | Status | Phase | Evidence |
|---|---|---|---|
| Linear-light `Rgba16Float` render graph, color conversion, transforms, premultiplied over, PQ/HLG-to-SDR tone-map, per-adapter golden frames | **Built** (production compositor; synthetic test cards only until the media backend lands) | P1 | `cutweave-render`, merge `c6cef43` (WP-1F.02); spike `spikes/s4-compositor` before it |
| Quality ladder, asynchronous readback, `render.frame` and `render.contact_sheet` queries (image results with metadata) | **Built** in `cutweave-render`; not yet exposed over MCP (WP-1J.02) | P1 | merge `f23d206` (WP-1F.03) |
| WGSL effect framework (`effect.toml`, multi-pass, keyframeable, GPU budgets, hot reload) | Planned for v1 | P4 (M4) | `roadmap` P4, WP-4A |
| >= 40 transitions, >= 50 effects, >= 40 filters/LUTs, clip animations | Planned for v1 | P4 | `roadmap` P4 |
| Core blend modes (8) | Planned for v1 | P2 | `arch §8` |
| Extended blend modes | Planned for v1 | P4 | `arch §8` |
| Basic adjustments, HSL, curves, LUT import (.cube), color wheels | Planned for v1 | P4 | `roadmap` P4 |
| Scopes (waveform, vectorscope, histogram), auto color correct, color match | Planned for v1 | P4 (match skill P6) | `roadmap` P4 |
| Shape masks, chroma key with spill suppression, luma key, adjustment layers | Planned for v1 | P4 | `roadmap` P4 |
| Stabilization, point/planar-lite motion tracking | Planned for v1 | P4 | `roadmap` P4 |
| HDR output | Later | post-1.0 | `arch §22`; HDR sources are tone-mapped to SDR in v1 |
| Face/body effects, beauty retouch, eye contact, deflicker | Later | post-1.0 | `parity` §5, §9 |

### 3.4 Audio

| Feature | Status | Phase | Evidence |
|---|---|---|---|
| Audio-clock master, time-stretch, loudness meter, 8-track mixer | Built as a **spike** only | P0 | `spikes/s2-audio-clock`; 10-min soak 0 underruns, drift +11 ppm (`M0`) |
| Mixer graph (per-track lanes, sample-exact edit hand-off, resampling, offline mixdown equal to real-time) over generated sources | **Built** (no decoded clip audio until FFmpeg) | P1 | merge `42f7fbc` (WP-1G.01, R29) |
| cpal device output, device-change supervision, lock-free master clock, meters | **Built** | P1 | merge `e97ed82` (WP-1G.02) |
| Clip audio playback from real files, transport and A/V sync | In progress (real clips follow the S3 spike) | P1 | WP-1H.01 (R31: against synthetic frames first), WP-1D.03 |
| Fades, keyframed volume, pan, buses, master limiter, loudness presets (-14 social, -16 podcast) | Planned for v1 | P2 | `roadmap` P2, `arch §9` |
| Auto-ducking, offline voice effects, voiceover recording, extract audio | Planned for v1 | P2 | `roadmap` P2 |
| Music and SFX library with per-asset license metadata (CC0, CC-BY) | Planned for v1 | P3 | `roadmap` P3, R7 |
| Voice enhance/denoise, stem split, beat detection | Planned for v1 | P5 | `roadmap` P5 |
| CLAP, then VST3 hosting | Later | v2, v3 | `arch §9` |

### 3.5 AI tools

| Feature | Status | Phase | Evidence |
|---|---|---|---|
| AI Studio: generate image, video (text/image to video, first/last frame, camera controls), music, SFX, voice | Planned for v1 | P5 (M5) | `roadmap` P5, WP-5F |
| Background removal, click-to-track object masks | Planned for v1 | P5 | WP-5G.02, 5G.03 |
| Auto reframe (subject tracking to a keyframed crop) | Planned for v1 | P5 | `parity` §3 |
| TTS voiceover, voice changer, voice clone (cloud, consent gate) | Planned for v1 / Later (clone) | P5 | `parity` §6, §8 |
| Caption translation, dubbing with optional lip-sync | Planned for v1 | P5 | `roadmap` P5 |
| Upscale, frame interpolation, scene detection | Planned for v1 | P5 | `roadmap` P5 |
| Long video to shorts (ranked highlight candidates become sequences; exit: >= 3 usable shorts from a 20-min podcast) | Planned for v1 | P5 | `roadmap` P5 |
| Stock media search (Pexels/Pixabay-class), licenses recorded | Planned for v1 | P5 | `parity` §1 |
| Provenance sidecars, C2PA read/write | Planned for v1 | P5 | `arch §13` |
| Local AI plugin: whisper.cpp, ONNX models, Kokoro TTS fallback, model manager | Planned for v1 | P5 (STT slice P3) | `roadmap` P3, P5 |
| Region-prompt generative edits (inpaint in video) | Later | post-1.0 | `roadmap` After 1.0 |

### 3.6 Agent and MCP

| Feature | Status | Phase | Evidence |
|---|---|---|---|
| Command registry, schema and TypeScript generation (`cargo xtask gen`: JSON Schemas, generated types, a generated command and CLI reference) | **Built** | P1 | `cutweave-commands`, merges `f634210` (WP-1N.01), `5e92362` (WP-1N.02) |
| MCP server (rmcp), hybrid tool catalog, `render_frame` as image content, both spec revisions | Built as a **spike** (73 tests, 13 core tools) | P0 | `spikes/s5-command-bus`, `M0` |
| Production MCP v0: tools derived from the registry (14 core plus 4 generic = 18 on `/mcp`, 9 on `/mcp/minimal`), `cutweave_execute`, both spec revisions, HTTP in the engine and stdio (`cutweave mcp --attach` proxy, `--headless` in-process) | **Built** (v0; `render_frame` and `export_start` not in yet) | P1 | merges `c74300f` (WP-1J.01), `3ce9ccf` (WP-1J.03); WP-1J.02 (`render_frame`) and WP-1E.03 (`export_start`) pending |
| ~30 core tools, contact sheet, filmstrip, waveform images, checkpoints, `expected_rev`, tool profiles | Planned for v1 | P2 | WP-2I.01–05 |
| Agent Kit v0 (captions/transcript tools; skills `cutweave-basics`, `captions-and-styling`, `transcript-editing`, `reframe-and-aspect`; prompts `caption-pass`, `tighten`) | Planned for v1 | P3 | `roadmap` P3 |
| Agent Kit v1: ~14 skills, 13 MCP prompts, packs, client installers, nightly evals (>= 80% on two clients) | Planned for v1 | P6 (M6) | `arch §14b`, WP-6G, 6H |
| Built-in copilot: plan, preview, apply, per-turn undo, cost gates | Planned for v1 | P6 | WP-6I |
| Core-tool parity test (each core tool returns exactly what the engine call returns) | **Built** | P1 | `crates/cutweave-api/tests/mcp.rs` (WP-1J.01) |
| 100% command-to-MCP parity CI across the whole surface (CLI = MCP = RPC), tool-list size budget in CI | Planned for v1 | P1, P6 | WP-1O.02, WP-6J.01–02 |

### 3.7 Plugins

| Feature | Status | Phase | Evidence |
|---|---|---|---|
| Plugin crate, SDK and WIT packages | Stubs only (SDK/compose-runtime carry MIT/Apache license files; `wit/` has a README) | P0 | `packages/plugin-sdk`, `packages/compose-runtime`, `wit/` |
| Compositions runtime: TSX to oxc to QuickJS to scene graph | Built as a **spike** (transpile 0.14 ms; 35/35 sandbox escapes contained; deterministic) | P0 | `spikes/s4b-compositions`, ADR-0012 (accepted, provisional, with conditions) |
| Plugin loader v0 (first-party L0/L1/L1.5), `@cutweave/compose` v1 | Planned for v1 | P3 | `roadmap` P3 |
| Third-party WASM host, permissions, UI panels, signed git-based index, in-app install, `cutweave plugin` CLI | Planned for v1 | P6 (M6) | WP-6A, 6B, 6C |
| L3 UI panels (each in its own sandboxed WebContentsView) | Planned for v1 (v1.5 for third parties) | P6 | `arch §15`, commit `179f3f4` |
| Native out-of-process (CLAP, VST3, OFX) | Later | v2+ | `arch §15` |

### 3.8 Templates and brand

| Feature | Status | Phase | Evidence |
|---|---|---|---|
| Template format, save-as-template, browser, smart auto-fill from the media bin | Planned for v1 | P6 | WP-6D.01–06 |
| >= 30 first-party templates (intros, vlog, podcast clip, product promo, listicle, meme formats) | Planned for v1 | P6 | WP-6D.07–11 |
| Brand kit (fonts, colors, logo, caption style, intro/outro, tone) | Planned for v1 | P6 | `parity` §1, WP-6D |
| First-party compositions: lower thirds, titles, callouts, progress bars, subscribe buttons | Planned for v1 | P3 | `roadmap` P3 |
| Stickers and overlay packs, including animated (GIF, APNG, animated WebP, Lottie) | Planned for v1 | P3 | `roadmap` P3 |

### 3.9 Import, export and interchange

| Feature | Status | Phase | Evidence |
|---|---|---|---|
| H.264/AAC MP4 export (hardware and software) | In progress, **follows FFmpeg spike S3** (unblocked and running since 2026-11-23; if S3 fails, 1D and 1E stop) | P1 | `M0` (sequenced via R27–R31 rather than held); WP-1E; R27–R31 describe the FFmpeg-free path |
| Presets: YouTube 1080p/4K, Shorts/Reels/TikTok, GIF, audio-only, ProRes; HEVC, AV1; CBR/VBR/CRF; export queue; range or marker-set export | Planned for v1 | P2 | `roadmap` P2 |
| Parallel chunked export across `cutweave worker` processes | Planned for v1 | P2 | `arch §8` |
| `cutweave` CLI, core-only: `engine`, `exec`, `query`, `commands`, `describe`, `mcp`; generated `docs/reference/cli.md` | **Built** | P1 | merge `8542aa4` (WP-1K.01, R28) |
| Headless CLI render (`cutweave render`) | Wired, returns `unsupported` until the media backend lands | P1 | WP-1I.05, WP-1E.03 (R28) |
| SRT/VTT/ASS | Planned for v1 | P3 | `roadmap` P3 |
| OTIO import/export, EDL, FCPXML export | Planned for v1 (FCPXML may slip) | P6 | `roadmap` P6 |
| CapCut draft import | Investigation, go/no-go | P6 | WP-6E.04–05 |
| YouTube and TikTok upload | Planned for v1 (TikTok may slip) | P6 | WP-6F |
| No watermark, no resolution tiers | Policy | all | `parity` §10 |

### 3.10 Platform and privacy

| Feature | Status | Phase | Evidence |
|---|---|---|---|
| Electron hardening: window factory, CSP, navigation and permission guards, validated IPC with sender check, fuses, Playwright security suite | **Built** | P1 | merge `f764370` (WP-1L.02), `apps/desktop/SECURITY-MODEL.md` |
| Electron app scaffold, `app://` protocol | **Built** | P1 | merge `ccc6128` (WP-1L.01) |
| Design system: tokens (generated CSS, Tailwind, TS, Rust), contrast gate, bundled OFL fonts, Lucide-based icons, 22 components, Storybook with dark and light visual regression | **Built** | P0 | `design/`, `packages/ui`, `crates/cutweave-tokens` |
| CI, `cargo-deny`, license headers, DCO check, REUSE | **Built** | P0 | `.github/workflows/`, merges `6f87947`, `b6c611f` |
| Windows, macOS, Linux desktop (Ubuntu 24.04 X11 and Wayland targeted) | Planned for v1 | P3 (unsigned alpha), P7 (signed) | `brief` D1; WP-3I.01, WP-7A |
| No account, no telemetry by default, keys in OS keychain | No account and no telemetry exist in the engine (it opens no outbound sockets, tested in WP-1I.04); keychain: planned for v1 | P1+ | `arch §18`, `docs/reference/launch-protocol.md` |
| Opt-in, self-hosted crash reporting | Planned for v1 | P3 | WP-3I.05 |
| Signed and notarized installers, Flatpak, auto-update channels | Planned for v1 | P7 | WP-7A.01–08 |
| Accessibility audit (WCAG 2.2 AA for UI chrome), en plus >= 6 languages | Planned for v1 | P7 | `roadmap` P7 |
| Web and mobile apps, real-time collaboration, hosted inference | Later / non-goal | post-1.0 | `brief` non-goals |

### 3.11 What actually exists and runs today

- **Rust crates with real code (13 of 20):** `cutweave-model`, `-commands`, `-commands-derive`, `-ops`, `-engine` (project I/O, journal, autosave, session lifecycle, launch protocol, dev stub media), `-api` (local server, JSON-RPC over WebSocket, MCP), `-jobs`, `-render` (scene evaluation and the wgpu compositor), `-audio` (mixer and cpal output), `-playback` (shared-memory ring), `-bridge` (napi addon), `-cli` and `-tokens`.
- **Stub crates (about 20 lines each, 7 of 20):** `ai`, `cache`, `compose`, `interchange`, `media`, `plugins`, `text`. `media` is the FFmpeg backend, sequenced behind S3 (R27).
- **Registered commands today: 43** (`docs/reference/commands.md`, generated from the registry): `project.*` (new, open, save, save_as, close, rename, info, recover, discard_recovery), `media.*` (import, list, register, remove), `track.*` (add, remove, set), `timeline.insert` and `timeline.get`, `clip.split`, `clip.trim`, `item.move`, `item.delete`, `item.set_props`, `item.get`, `edit.*` (begin_tx, commit_tx, cancel_tx, undo, redo, history, checkpoint, restore, list_checkpoints, locks), `job.*` (status, list, wait, cancel) and `view.*`. 14 are core MCP tools (`project_open`, `project_info`, `media_import`, `media_list`, `timeline_get`, `timeline_insert`, `clip_split`, `clip_trim`, `item_move`, `item_delete`, `item_set_props`, `edit_undo`, `job_status`, `job_wait`); the rest are reachable through `cutweave_execute` and the catalog tools. `render.frame` and `render.contact_sheet` exist in `cutweave-render` but are not registered in the engine yet (WP-1I.05, WP-1J.02). `export.start` does not exist.
- **TypeScript packages:** `packages/ui` (22 components, see 8.4), `packages/timeline` (production Canvas2D renderer and an interaction state machine), `packages/editor` (shell with media bin, Preview, Inspector, Timeline and Transport panels, toasts, engine-restart notices), `packages/protocol` (generated types, typed RPC client, document mirror) and `packages/plugin-sdk` (a stub).
- **Desktop app:** an Electron app that launches the shell, with a hardened window and an engine supervisor (restart, journal recovery, resend). With `--dev-stub-media` the editor can import stub media, drag it onto the timeline and move, trim, split and delete clips against the real engine. No real media can be imported, played or exported yet, and the preview panel (WP-1M.04), inspector and save/open UI (WP-1M.07) and export dialog (WP-1M.08) are not merged.

---

## 4. Honest CapCut comparison

Derived from `docs/03-feature-parity.md` (131 CapCut features tracked: Must-1.0 71, Should-1.0 35, Later 17, Won't 8; "106 of 131 = 81% shipping by 1.0"). The right column is the **v1 plan**, not what exists. Suggested page footnote: "Cutweave is in development. This table shows the 1.0 plan and where we differ on purpose. Sources are public in the repo."

| What a creator cares about | CapCut | Cutweave 1.0 plan | Phase |
|---|---|---|---|
| Account required | Yes | **No account**, no telemetry by default | P1 |
| Price and tiers | Free tier, Pro paywall | No tiers; GPL-3.0 | all |
| Export watermark | Yes on some paths | **None, ever** | M1 |
| Export resolution limits | Tier-gated | Up to 4K+, no gating | P2 |
| Multi-track, magnetic main track, snapping | Yes | Yes | P2 |
| Ripple, roll, slip, slide | Partial | Yes | P2 |
| Keyframes + graph editor | Yes | Yes | P2 |
| Compound clips | Yes | Yes (nested sequences) | P2 |
| Multicam | Pro | **Later** (post-1.0) | - |
| Auto captions | Yes (account, credits for some) | Yes: cloud or local whisper.cpp, offline-capable, free | P3 |
| Caption styles, karaoke, keyword highlight | Large library | >= 25 styles (CapCut's library is larger) | P3 |
| Text-based editing, filler/silence removal | Yes | Yes | P3 |
| Animated text and templates | Large marketplace | >= 30 first-party templates, open index, no revenue share | P3, P6 |
| Effects and transitions | Hundreds | >= 50 effects, >= 40 transitions, plus plugins; count gap acknowledged (G25) | P4 |
| Filters and LUTs | Yes | >= 40 plus `.cube` import | P4 |
| Color: wheels, curves, scopes | Some Pro-locked | All free, scopes included | P4 |
| Masks, chroma key | Yes | Yes | P4 |
| Stabilization, motion tracking | Yes | Yes (basic) | P4 |
| Auto reframe, background removal | Yes | Yes: cloud or local ONNX | P5 |
| AI image and video generation | Closed models, credits | **Any leading model via your keys**, cost shown first | P5 |
| TTS, voice changer, dubbing, translation | Yes | Yes (cloud; local TTS fallback) | P5 |
| Upscale, interpolation | Yes | Yes | P5 |
| Long video to shorts | Yes | Yes (headline feature) | P5 |
| Stock library | Built-in | Pexels/Pixabay-class search, license shown per asset | P5 |
| Natural-language edit assistant | EditPilot (credits) | Built-in copilot **or any MCP agent** | P6 |
| Drive it from an external agent | One ChatGPT plugin | **Full MCP: every command is a tool.** MCP server v0 built (HTTP and stdio); `render_frame` and `export_start` not in yet | P1+ |
| Plugins | None on desktop | L0 to L3 (data, GPU, TS, WASM, UI), signed index | P6 |
| Project format | Proprietary draft | **Open JSON folder**, OTIO import/export | P1, P6 |
| Offline | Needs account and internet for AI | Local-first; local AI plugin | P5 |
| Crash safety | Local drafts | Command journal, replay, autosave and rotating backups, engine auto-recovery (built in the engine; no editing workflow to use them in yet) | P1 |
| Headless/CLI rendering | None | `cutweave` CLI core-only built; `cutweave render` returns `unsupported` until the media backend lands | P1–P2 |
| Direct upload | Yes | YouTube; TikTok may slip | P6 |
| Cloud storage, team spaces | Yes | **Deliberately not offered** (use any synced folder; collaboration later) | post-1.0 |
| Mobile app, AI avatars bundle, face/AR effects, beauty | Yes | **Not in 1.0** | post-1.0 |
| Platforms | Win, Mac, mobile, web | Win, Mac, Linux desktop | P3, P7 |

**Where Cutweave deliberately differs** (`parity` §12): no account and no watermark; open project format; bring-your-own keys instead of credits; MCP-first agent control; plugins at every layer; per-actor undo and replayable command logs; provenance and cost transparency; headless CLI.

**Where Cutweave is behind and says so:** effect and template counts, multicam, mobile and web, face/body effects, cloud sync. It also does not exist as a downloadable product yet.

Terminology table for a "Coming from CapCut" section: `parity` §14 (Draft = Project; Track Magnet = magnetic main track; Auto cutout = Matting; AI credits = provider cost estimates; Pro/watermark = none).

---

## 5. Agent and MCP story

### 5.1 Claims the site can make (all from `arch §14`, ADR-0009)
- Every command is also an MCP tool; a CI test enforces parity (`arch §14` "Parity guarantee").
- Transports: Streamable HTTP at `http://127.0.0.1:<port>/mcp`; `cutweave mcp --attach` (stdio proxy into the running app, so you watch the agent edit live); `cutweave mcp --headless --project X` (no GUI, for CI and servers).
- Built on the official Rust MCP SDK `rmcp`. Both spec revisions are supported: 2025-11-25 (stateful) and 2026-07-28 (stateless). Only 2025-11-25 has been seen from a real host so far (`AGENT-RUN-REPORT.md`).
- Agents see, not screenshot: `render_frame`, `render_contact_sheet`, `media_filmstrip` and `audio_waveform` return images (JPEG, default <= 768 px) plus structured metadata (time, items visible, captions on screen).
- The server stays small: tool-list budget minimal <= 12 tools / 3k tokens, standard <= 36 / 8k. The spike measured the standard profile at about 2.7k tokens for 13 tools (`M0`).
- Safety: filesystem allowlist; transcripts and metadata returned as untrusted content; paid and destructive actions follow the three-tier authority model; UI-only scopes enforced in the command dispatcher so batches can't bypass them (`arch §14`).

### 5.2 Real tool and command names (from `arch §14`, §5.1, §14b)

**Core tools (listed always, ~30):** `project_open`, `project_info`, `media_import`, `media_list`, `timeline_get`, `timeline_insert`, `clip_split`, `clip_trim`, `clip_move`, `item_delete`, `item_set_props`, `text_add`, `caption_generate`, `caption_style`, `effect_add`, `transition_add`, `keyframe_set`, `audio_set`, `render_frame`, `render_contact_sheet`, `export_start`, `job_status`, `job_wait`, `edit_undo`, `edit_checkpoint`, `ai_generate`, `ai_models`, `composition_create`. Plus `view_get` / `view_set`.

**Four generic tools for the long tail:** `cutweave_search_commands(query)`, `cutweave_describe_command(name)`, `cutweave_execute(steps[], dry_run?, expected_rev?)` (a transaction, steps can reference earlier results), `cutweave_query(name, args)`.

**Command naming:** `namespace.verb_object`, for example `clip.split`, `timeline.ripple_delete_ranges`, `timeline.remove_silences`, `caption.generate`, `ai.generate_video`, `ai.remove_background`, `ai.reframe`, `ai.dub`, `ai.shorts_from_sequence`, `edit.checkpoint`, `edit.restore`, `ai.set_key` (UI-only). Namespaces: `project`, `media`, `sequence`, `track`, `timeline`, `item`, `clip`, `text`, `caption`, `transcript`, `effect`, `transition`, `keyframe`, `mask`, `color`, `audio`, `composition`, `template`, `font`, `asset`, `analysis`, `job`, `tracking`, `ai`, `render`, `view` (`arch §5.1`).

**Resources:** `cutweave://project`, `cutweave://sequence/{id}/timeline`, `cutweave://transcript/{id}`, `cutweave://catalog/models`.

**MCP prompts (slash-style workflows, `arch §14b`):** `make-short`, `caption-pass`, `rough-cut`, `tighten`, `add-broll`, `script-to-video`, `dub`, `audio-polish`, `color-match`, `review-cut`, `brand-apply`, `export-for`, `explain-project`.

**Envelope:** every call carries a `request_id` (idempotent for 10 minutes) and optional `expected_rev` for optimistic concurrency; errors are typed (`NotFound`, `Locked`, `Conflict{current_rev}`, `Invalid{path,msg}`, `Unsupported`) with a human message and machine code (`arch §5.1`).

### 5.3 Evidence that exists today (the only demo-grade agent story)
Spike S5, 2026-11-22, Claude Code (headless) against the spike MCP server, prompt "Import testdata/fixture.mp4, cut it at 2 s, and show me the frame at 3 s". Three of three restricted runs passed. Each used exactly four calls: `media_import` then `timeline_insert` then `clip_split` then `render_frame`. All edits were attributed to one actor `agent:claude-code`. About $0.035 per warm run. The "frame" came back as an MCP image block. (`spikes/s5-command-bus/AGENT-RUN-REPORT.md`.) Caveat: spike server, stub import, not the product.

### 5.4 Example agent session (*illustrative*: names are real, values and output are invented)

> **You** (in any MCP client): "Cut the dead air from this interview and caption it for Shorts. Keep it under $1."
>
> **Agent calls:**
> 1. `project_info` then `media_list` : finds `med_…` interview clip, 11:42 long.
> 2. `caption_generate { media, language: "en" }` : cost estimate returned first (cloud STT, ~$0.04 · illustrative).
> 3. `cutweave_execute { dry_run: true, steps: [timeline.remove_silences, timeline.remove_fillers] }` : dry run reports "remove 14 silences, 9 fillers".
> 4. `edit_checkpoint { name: "before-cuts" }`.
> 5. `cutweave_execute { steps: [...] }` as a **proposal**.
> 6. `render_contact_sheet` : the agent checks the result visually.
> 7. `caption_style { style: … }`, `export_start { preset: "shorts-9x16" }`.
>
> **Cutweave UI:** timeline shows the pending changes as dashed agent-blue ghosts: "Agent proposes 6 changes: remove 14 silences, add captions" (phrasing from `design/README.md`). **You** press Accept; the engine commits it as one undo step tagged `agent:<label>`. Reject rolls it back. You can undo "the agent's last change" without touching your own edits (`arch §5.2`, §14b).

Note: proposals as a UI feature are P6 (copilot, WP-6I.04, 6I.08); the transaction kind `proposal` is in ADR-0017.

### 5.5 Proposals, checkpoints and the budget
- **Proposal mode:** the agent turn runs inside an ephemeral transaction that soft-locks the items it touches. The UI renders the diff (timeline ghosts, before/after frames). Accept commits one undo step; reject rolls back. Proposal transactions have no idle timeout and are cancellable (`arch §14b`, ADR-0017).
- **Checkpoints:** `edit.checkpoint{name}` / `edit.restore{checkpoint}` are cheap because the document uses persistent snapshots (`arch §5.2`, ADR-0005).
- **Three-tier spending authority, enforced by the engine** (`arch §13`):
  1. **Auto:** under the per-action and per-session agent budget. The default budget is $0, so it is off until you set one.
  2. **Agent-confirmed:** a dry run returns `cost_estimate` and a `confirm_token`. It proves the agent saw the price but cannot exceed the remaining budget.
  3. **Human-approved:** over budget, or marked `requires_human` (publishing, deleting originals): returns `approval_required{approval_id}`. Only the desktop UI can mint approval; agent credentials cannot (ADR-0016). Headless mode uses tiers 1–2 with an explicit `--budget` flag.
- UI copy for over-budget (`design/README.md`): "This costs ~$2.10, above your $1.00 agent budget. Approve to continue."

### 5.6 Agent Kit contents (`arch §14b`; WP-6G, 6H)
- **Skills (~14, spec-valid `SKILL.md`):** `cutweave-basics`, `transcript-editing`, `shorts-from-longform`, `captions-and-styling`, `b-roll-insertion`, `script-to-storyboard`, `generate-shots`, `dubbing-and-translation`, `audio-polish`, `color-and-look-matching`, `reframe-and-aspect`, `brand-kit-apply`, `review-and-critique`, `export-and-delivery`.
- **MCP prompts:** the 13 above.
- **Preset and prompt packs:** a model-agnostic intent layer (shot, subject, camera move, style, mood) with per-model adapters; camera-motion vocabulary, platform specs, caption styles, storyboard templates.
- **Client installers:** `cutweave agent-kit install --client claude|codex|gemini|cursor|vscode` writes the MCP config and installs skills; a Claude Code plugin bundles both; skills also served as MCP resources.
- **Eval harness:** ~15 task suites, state-based assertions first, a pinned vision-rubric judge second, plus safety tasks (transcript prompt injection, over-budget generation, ambiguous destructive request). Nightly CI. Target >= 80% task success on at least two different agent clients.
- **Built-in copilot:** Rust agent loop over any `Llm` provider using the same tool registry; cache-friendly prompt layout; brand kit and preferences memory; a policy engine outside the model.
- **Composition authoring by agent:** `composition.create{source}` returns structured compile diagnostics, then `render.frame` previews it (`arch §12`).
- Status: all planned (P3 first slice, P6 full). The kit's first files do not exist in the repo yet.

---

## 6. AI gateway story

### 6.1 What the docs promise (`arch §13`, ADR-0008, `brief` D2)
- Cloud-first and model-agnostic. Local models are "just another provider".
- **Capability enum** (versioned with the host API): `Llm`, `VideoUnderstand`, `Stt`, `Tts`, `VoiceClone`, `VoiceConvert`, `Dub`, `LipSync`, `Translate`, `TextToImage`, `ImageEdit`, `TextToVideo`, `ImageToVideo`, `VideoToVideo`, `Music`, `Sfx`, `Upscale`, `Interpolate`, `Matting`, `SegmentTrack`, `AudioEnhance`, `StemSplit`, `StockSearch`. Every capability has a normalized I/O type (every Stt result becomes a word-timed transcript; every generation returns assets plus provenance).
- **Provider categories**
  - Aggregators: fal, Replicate, OpenRouter, Higgsfield.
  - Direct: Anthropic, OpenAI-compatible, Google Gemini, ElevenLabs, Runway, Deepgram/AssemblyAI.
  - Local provider plugin: whisper.cpp, ONNX Runtime, sherpa-onnx.
- **Adapters:** declarative HTTP manifests (no code, most aggregator models fit) and WASM component adapters for complex APIs. The host performs the HTTP and injects keys; adapters never see secrets.
- **Signed model catalog:** CI-built, ed25519-signed, remote-updatable, merged with live discovery from aggregators and user-added model slugs. The catalog drives AI Studio forms, MCP tool params and cost estimates, so new models appear without an app release.
- **Cost before running:** estimates shown first ("~$0.40 · Kling 3.0 via fal"), per-project and monthly budget caps, confirmation above a threshold (`arch §13`, `design/README.md`).
- **Keys:** OS keychain; write-only entry (`ai.set_key` returns only the last four characters); adapters hold handles, the host signs requests for JWT/HMAC/SigV4 providers; headless uses `CUTWEAVE_KEY_<PROVIDER>` env vars.
- **Jobs:** persisted in SQLite, survive restarts, poll with backoff, results downloaded immediately (provider URLs expire), input-hash cache so you don't pay twice, provenance sidecar (model, prompt, seed, params, cost), optional C2PA.
- **Licence traps are enforced:** catalog metadata and `cargo-deny` exclude RMBG-2.0, F5-TTS, XTTS, NLLB, Ultralytics YOLO, insightface weights by default (`arch §13`).

### 6.2 Example models the docs name (`docs/research/06-cloud-ai-providers.md`, snapshot 2026-11-22)
Use sparingly and with "examples, not a promise": the research says the landscape moves monthly and "never hardcode" lists.
- **Video:** Veo 3.1, Gemini Omni Flash, Kling 3.0, Runway Gen-4.5 and Aleph, Luma Ray, Seedance 2.0, MiniMax Hailuo, Alibaba Wan. **Not** Sora 2 (research notes OpenAI shut it down 2026-09-24).
- **Image:** Nano Banana Pro/2, FLUX.2, GPT Image, Seedream.
- **Speech and audio:** ElevenLabs (Scribe for STT, Eleven v3 for TTS, Music, SFX), Deepgram, AssemblyAI, Google Lyria.
- **Understanding:** Gemini (native video understanding); Claude and OpenAI-compatible LLMs for the copilot.
- Price figures in the research are secondary-source and indicative; do not print them on the site.

### 6.3 Local and offline
Local plugin with an on-demand model manager and license display: whisper.cpp (STT), ONNX Runtime models (matting, denoise, scene and beat detection), Kokoro TTS fallback (P5, `roadmap`). The first whisper.cpp slice lands in P3 (WP-3D). "Works offline" claim is accurate only for these features, not for cloud generation.

### 6.4 Status
Nothing in `cutweave-ai` is implemented (20-line stub). First slice (Capability enum, Stt, one cloud provider, whisper.cpp) is WP-3D.02 (P3); the rest is P5. The AI cost chip, job progress and actor badge UI components exist in `packages/ui` and have screenshots (see 8.4).

---

## 7. Plugin story

### 7.1 Layers (`arch §15`, ADR-0010)

| Layer | What a third party builds | Mechanism | Sandbox | v1 |
|---|---|---|---|---|
| L0 Data packs | LUTs, fonts, stickers, SFX/music, caption styles, text presets, templates, macros, export presets | Files + manifest | Data only, validated | Yes |
| L1 GPU effects | Effects, transitions, blend modes, generators | WGSL + `effect.toml` | naga validation, GPU time budget, auto-disable | Yes |
| L1.5 Compositions | Animated text, motion graphics, code templates | TypeScript/JSX run in QuickJS | No I/O, no clock, seeded RNG, CPU/memory limits | Yes (v1.5 for third parties) |
| L2 WASM components | AI provider adapters, importers/exporters, publishers, command handlers, audio FX | wasmtime + WIT | Capability permissions: network allowlist, scoped filesystem, no keys | Providers and importers v1; others v1.5 |
| L3 UI extensions | Panels, inspectors, dialogs | Each panel in its own OS-sandboxed WebContentsView | OS sandbox, CSP, no Node, permissioned RPC | v1.5 (auto-inspectors v1) |
| L4 Native | CLAP/VST3, OFX, codecs | Separate process + IPC | Process isolation | v2+ |

### 7.2 Key facts
- Manifest `cutweave-plugin.toml`: id, version, `host_api` semver range, contributions, permissions, signing info.
- A plugin command is registered in the same registry, so it appears in the command palette, CLI and MCP with no extra work.
- Distribution: a git-based, signed index (like Zed or Homebrew), in-app browse, install and update, versions pinned in the project; a project with a missing plugin opens with placeholders.
- WIT worlds (`wit/`): `cutweave:effect`, `cutweave:provider`, `cutweave:importer`, `cutweave:exporter`, `cutweave:command`, `cutweave:publisher` (`docs/02-tech-stack.md`).
- Packages: `@cutweave/sdk` (UI panels, typed command client), `@cutweave/compose` (`defineComposition`, `interpolate`, `spring`, scene nodes, text animators), `cutweave plugin new | build | validate | pack | publish`.
- Dogfooding: built-in effects, transitions, caption styles, text animations and many templates ship as first-party plugins/compositions.
- Composition example (`arch §12`) is a 20-line lower third in TSX using `defineComposition`, `p.object`, `spring` and `interpolate`. The props schema becomes the inspector UI, MCP parameters and keyframeable properties. The S4b spike ran this example verbatim.

### 7.3 Licensing (`ADR-0011`, `LICENSE-PLUGIN-EXCEPTION.md`)
- Core: GPL-3.0-or-later.
- `wit/`, `packages/plugin-sdk`, `packages/compose-runtime`: MIT OR Apache-2.0 (license files are in those directories).
- Plugin exception: plugins using only published interfaces (WIT, command protocol over MCP/CLI/RPC, SDK, compose API, manifest, declarative formats) may use any license, including proprietary. **The exception text is a DRAFT pending legal review and says it is NOT YET IN EFFECT.** The site must not present it as final.
- Native code is never loaded in-process, which supports the separate-works argument.
- No CLA; DCO sign-off.

### 7.4 Exit criterion to quote carefully
"A third-party developer builds and publishes an effect, a provider adapter and a panel using only the docs" is the M6 exit test (WP-6C.09). Not yet met.

---

## 8. Architecture at a glance

### 8.1 Components and data flow (for a diagram)

**Row 1, clients (outside the engine):**
- Desktop UI: Electron main process (TS), preload with napi-rs addon, React renderer with a WebGPU preview canvas.
- AI agents over MCP (stdio or HTTP).
- `cutweave` CLI (JSON in and out).
- Plugins (WASM, JS, WGSL).
- Sandboxed plugin UI panels (separate WebContentsViews).

**Row 2, API layer** (one local axum server on 127.0.0.1, token auth): JSON-RPC over WebSocket (`/rpc`), MCP (`/mcp`), HTTP media endpoints (`/media/{id}/thumb`, `/filmstrip`, `/waveform`, `/frame`), shared-memory preview ring.

**Row 3, the engine (`cutweave` Rust process):**
1. **Command bus:** registry, validation (JSON Schema, then semantic checks), actor derived from credential.
2. **Tx (transaction):** records forward and inverse patch ops; kinds `gesture` (drag, 30 s timeout) and `proposal` (agent turns); one undo step; per-actor history.
3. **Project document:** single-writer actor holding immutable snapshots (`imbl`); readers get an `Arc` per revision, so there are no locks on the hot path.
4. **Render pipeline:** snapshot at revision, timeline evaluation at time *t*, scene graph, render graph (DAG of passes with cache keys), wgpu execution (decode upload, WGSL effects, blend, text, transitions).
5. **Audio engine:** mixer graph, audio device clock as the master clock (video follows audio).
6. **Media layer:** FFmpeg decode and encode, frame index, proxies, caches in SQLite.
7. **Job manager:** persistent queue for export, analysis, AI, proxies.
8. **AI gateway:** capability router, signed catalog, cost and budget, adapters; HTTPS to cloud models; keys from the OS keychain.
9. **Plugin host:** wasmtime, QuickJS, WGSL loader, data packs.

**Outputs of the render pipeline:** preview (downscaled into a shared-memory ring buffer, drawn on a WebGPU canvas), export (to the encoder), agent frame (to JPEG/PNG).

**Arrows:** every client sends commands to the API, then the bus, then the doc actor. The doc feeds render and audio. Jobs call media, AI and render. The plugin host calls the bus, render and AI. The AI gateway calls cloud providers over HTTPS. Events (`doc.patched{rev, actor, ops}`, `job.progress`, `media.indexed`) stream back to subscribers, and the UI keeps a read-only projection that updates from `doc.patched`.

Source diagrams exist as Mermaid in `arch §1` (system), `arch §2` (process model), `arch §8` (render), `arch §13` (AI gateway).

**Dependency rule** (`arch §3`): `model` <- `commands` <- `ops`; `render`, `audio`, `media` never depend on `api` or the UI. `cutweave-model`, `-commands`, `-render` core and `-text` must compile to `wasm32` (CI-checked), which keeps a future browser build open.

### 8.2 Repository map (for a "how it is built" page)
`crates/` (21 Rust crates) · `apps/desktop` (Electron) · `packages/` (ui, timeline, editor, protocol, plugin-sdk, compose-runtime, tokens) · `wit/` · `design/` · `spikes/` · `xtask/` · `docs/adr/` (17 ADRs).

### 8.3 Stack (`docs/02-tech-stack.md`)
Rust (edition 2024), wgpu and WGSL, FFmpeg, cpal, rubato, signalsmith-stretch, ebur128, cosmic-text, `rmcp`, wasmtime, rquickjs, oxc, axum; Electron, React 19, TypeScript strict, Vite, Zustand, Radix, Tailwind v4, dockview, cmdk; Biome, Vitest, Playwright, Storybook. Fonts: Instrument Sans, Bricolage Grotesque, JetBrains Mono (all SIL OFL, bundled). Icons: Lucide (ISC) plus custom editor glyphs.

### 8.4 Design system (built, and good source material)
`packages/ui` components: Button, IconButton, SegmentedControl, NumberScrubber, Slider, KeyframeToggle, Switch, Panel, Tabs, InspectorSection, Menu, Tooltip, Dialog, Toast, StatusChip, JobProgress, CostChip, ActorBadge, ProgressBar (plus a timeline canvas story). The product-specific ones (CostChip, ActorBadge, JobProgress) are the ones a site should show to convey "agents are visible".

---

## 9. Engineering facts that impress

All sourced. Prefer "measured in a spike" language where marked.

| Fact | Source | Notes |
|---|---|---|
| **Time is flicks.** 1/705,600,000 s as `i64`; every common frame rate (23.976 to 120) and audio rate (44.1k, 48k, 96k) divides it exactly, so there is no float drift. | `arch §4.1`, ADR-0004 | Built in `cutweave-model` |
| **Entities are addressed by ID, never by index**; IDs are prefixed UUIDv7 (`med_`, `seq_`, `trk_`, `itm_`). | `arch §4.2`, ADR-0004 | Built |
| **No overlaps within a track, ever**; property-tested. Dropping onto an occupied spot creates a track, like CapCut. | `arch §4.3` | Built in model invariants |
| **Every edit is undoable and invertible.** Undo applies stored inverse patch ops (RFC 6902); property tests assert `undo(apply(doc)) == doc` for every command. | `arch §5.2`, ADR-0005 | Core built (`cutweave-commands`) |
| **Per-actor history.** `user`, `agent:<label>`, `plugin:<id>`; the actor comes from the credential, never from the client. "Undo the agent's last change". | `arch §5.2`, ADR-0016 | **Built** in the engine: per-actor undo and redo stacks, conflict detection, checkpoints (WP-1B.04, merge `bfb6e46`); over RPC an MCP session is `agent:mcp` and the UI is `user` |
| **Idempotent commands.** `request_id` dedup within 10 minutes, so retries after an engine restart are safe. | `arch §5.1`, ADR-0015 | **Built**: the dedup window survives a restart through the journal (WP-1B.03, 1C.02); the editor resends unacknowledged commands exactly once after a restart (WP-1L.03, e2e) |
| **Deterministic rendering.** `render(snapshot, sequence, t, quality) -> frame` is a pure function; randomness seeded from item IDs; no wall clock. Enables frame caching, parallel chunked export and golden tests. | `arch §8` | Spike S4 verified: GPU output within <= 1 code value across NVIDIA and AMD (`M0`) |
| **Deterministic IDs for tests.** `--deterministic-ids <seed>` lets CLI, MCP and RPC paths produce byte-identical project documents. | `arch §5.1`, M1 exit | **Built** (`SeededGen`; seeded entity, request and job streams; refused for a GUI engine; merge `d9acbe3`, WP-1B.08) |
| **Single headless binary.** `cutweave` is the GUI engine, MCP server, CLI and worker. | `arch §2`, ADR-0002 | **Built** (core): `cutweave engine`, `exec`, `query`, `commands`, `describe`, `mcp`; `render` and `worker` not yet (WP-1K.01) |
| **Engine in its own process.** A GPU, decoder or plugin crash does not take the UI down. | `arch §2` | **Built**: the editor talks to the engine over a loopback WebSocket; a supervisor restarts it (0.5 s, 1 s, 2 s; failed after a fourth crash in 60 s) and recovers from the journal (WP-1L.03). Decoder and plugin crashes are not exercised yet (the compositor does recover from a lost GPU device in tests) |
| **Crash-safe saves.** Temp file, fsync, rename; autosave idle and every 30 s; journal replay on restart. | `arch §17`, ADR-0006 | **Built** (engine): atomic save and lock (WP-1C.01), journal with replay (WP-1C.02), autosave on 2 s idle or every 30 s with 10 backups (WP-1C.03). Kill test: 500 random operations, process killed at 20 random points, recovery equals the uninterrupted run at an operation boundary |
| **Linear-light, float rendering.** `Rgba16Float` working space, PQ/HLG tone-mapped to SDR. | `arch §8` | **Built** in the production compositor (WP-1F.02, merge `c6cef43`); synthetic test cards only until the media backend lands |
| **Preview and export share one pipeline.** | `brief` principle 4 | Design. The compositor, the readback that backs `render.frame` and the preview ring publisher are built (WP-1F.02, 1F.03, 1H.02, 1H.03); export is not |
| **Performance budgets are features** (CI-benchmarked on reference machines): app start < 2.5 s; open a 1-hour 400-item project < 2 s; command round trip p95 < 16 ms; scrub p95 < 80 ms (proxy), < 150 ms (4K long-GOP); timeline 5,000 items >= 55 fps; A/V sync < 40 ms, drift < 1 frame per 30 min; 1080p H.264 export >= 2x realtime; idle memory < 1.5 GB. | `arch §19` | Targets, not yet all measured |
| **Lock-free real-time audio thread**, no allocation. | `arch §9` | **Built** (WP-1G.01, 1G.02): the mixer render does no allocation, locks or syscalls (tested with a counting allocator); on a real WASAPI device a 10-minute soak of the 8-source mix had 0 underruns and 0 callback heap operations |
| **Agents get frames, not screenshots**; image tools carry structured metadata. | `arch §14` | Spike S5. `render.frame` and `render.contact_sheet` are built in `cutweave-render` (WP-1F.03) but not exposed over MCP until WP-1J.02 |
| **Secrets never leave the engine**; `#[secret]` params are redacted before the journal. | `arch §14, §18` | **Built** for journaling: redaction is enforced at the journal sink and tested ("secrets never on disk", WP-1C.02); keychain and the AI gateway are not built |

### Benchmark numbers from spikes
All **informal**: one Windows 11 laptop (RTX 3080 laptop GPU and an AMD iGPU), measured while other work ran. macOS and Linux unmeasured. Formal runs wait on reference hardware (issue #45). Source `M0` and each spike README. Quote with "measured on one Windows laptop".

| Spike | Result |
|---|---|
| S1 preview path (Electron + Rust sidecar + shared memory + WebGPU) | 60.00 fps, 0 skipped frames; scrub-to-pixel p95 **49.5 ms** (budget 80); 0 blank frames over 119 live resizes |
| S1 timeline stress (Canvas2D) | 5,000 clips, 50,000 keyframes, 200 thumbnails: 60 fps vsync-capped, uncapped p5 about 111 fps; draw p95 1.3 ms; hit-test < 0.01 ms (`spikes/s1-timeline-stress`) |
| WP-1M.05 production timeline | 5,000 clips at 60 fps, hit-test < 0.1 ms (merge `493a345`) |
| S1 alternative transport (sandboxed renderer over MessagePort) | Rejected: about 540 skips/min, about 2 cores. GPU shared textures (~0.5 ms) are the target |
| S2 audio clock | 10-min soak: 0 underruns, 0 real-time allocations, callback max 0.29 ms, drift +11 ppm, 0 skipped video frames, loudness within 0.01 LU |
| S4 compositor (1080p) | GPU p50/p95: RTX 3080 0.7/3.1 ms; AMD iGPU 6.5/8.1 ms (budget 8 ms, borderline); cross-vendor difference <= 1 code value |
| S4 text | 1,000 animated glyphs: 0.70 ms on iGPU, 0.06 ms on RTX; 4K SSIM 0.9976; no shimmer |
| S4b compositions | Transpile 0.14 ms; deterministic across runs; **35/35** sandbox escapes contained; 200 fully animated nodes 2.6 ms (budget 1 ms, conditional pass) |
| S5 command bus and MCP | 73 tests; standard `tools/list` about 2.7k tokens (13 tools); Claude Code 3/3 on "import, cut, render frame" with no screenshots |
| Not passed or not run | S3 decode, seek and hardware acceleration: **unblocked 2026-11-23, running, not passed yet** (FFmpeg 8.1.3, generated test media); ADR-003 stays Proposed until S3 reports |

### Numbers measured in work-package tests (since Phase 0)
Site label: **Measured in a work package test**, footnote "Informal, one dev machine. Formal runs pending." These come from merge and commit messages and test output recorded in the main repo, on one Windows 11 dev machine that was often loaded by other builds; some in a debug build. None is a formal benchmark. The numbers are the ones the commit messages state; the WP acceptance records are the sources.

| WP | Result | Source |
|---|---|---|
| 1B.03 document actor | No-op command round trip on the actor p95 **26 µs** (criterion bench; WP budget < 1 ms) | merge `d6cc82e` subject |
| 1I.02 JSON-RPC | `clip.trim` round trip over WebSocket (response plus its `doc.patched`) on a 400-item project with a journal: p50 0.63 ms, p95 **0.81 ms**, p99 0.95 ms (debug build, loaded machine; budget p95 < 16 ms, gate 25 ms) | commit `3bf4dee` |
| 1I.04 engine root | Cold start to ready 64 ms (WP budget < 1.0 s) | commit `a50f3ca` |
| 1C.02 journal | fdatasync p50 0.59 ms; rename round trip p95 148 µs with group commit against 788 µs with fdatasync per commit. Kill test: 500 random operations, killed at 20 random points, recovery equals the uninterrupted run | commits `1c56d83`, `e393921` |
| 1H.03 preview bridge | Preview present loop 60 fps with 0 gaps; about 0.7–0.9 ms copy per 1080p frame; 590+ distinct frames in 10 s with 0 torn reads | merge `ef61e8e` subject, commit `7273271` |
| 1F.03 render.frame | 1080p `render.frame` to 768 px JPEG end to end, warm cache, p50: RTX 3080 laptop 8.2–8.6 ms, Radeon iGPU 7.8–8.2 ms, WARP software 15.7 ms (budget 150 ms) | commit `745f792` |
| 1F.02 compositor goldens | 11 reference frames per adapter class; each adapter reproduces its own set bit-identically; every set within one 8-bit code of the WARP set (PSNR >= 69 dB) | commit `fdc5acb` |
| 1G.01 mixer | Four overlapping tones against the analytical sum: max error 4.4e-8; 44.1 to 48 kHz 1 kHz sine THD+N -136.0 dB; offline mixdown equals real-time within 1e-6 (proptest); 8 sources, 256-frame buffers: 0 underruns, 0 heap operations in render | commit `f29f39f` |
| 1G.02 audio output | Real WASAPI device, 48 kHz, 480-frame period, 10-minute soak of the 8-source mix: 0 underruns, 0 xruns, 0 callback heap operations, clock never went backwards, max residual 0.59 ms; drift against the system timer +6.6 ms (+10.9 ppm, the device crystal, as in Spike S2) | commit `444ed1f` |
| 1B.07 property harness | Strategy coverage of every registered non-view entry (28/28 at merge, 32/32 after the job commands joined) | commits `a2f35d1`, `03ab87b` |
| 1J.01 MCP | `/mcp`: 18 tools, about 3.6k tokens (P1 gate 19 tools / 5k); `/mcp/minimal`: 9 tools, about 1.2k (budget 12 / 3k); tokens = compact `tools/list` bytes / 4 | commit `787ce93` |
| 1L.03 supervision | 3 edits, engine SIGKILLed: recovered in under 5 s and each command applied once | commit `9fc82fe` |
| 1B.03 stress | 8 writers submit 10,000 commands; revisions are exactly 1..10,000 and the final document equals a sequential replay | commit `f84b374` |


Visual evidence available for free: S4 golden frames (`spikes/s4-compositor/tests/golden/<adapter>/`: `demo_f0000/f0150/f0299.png`, `blend_modes.png`, `text_caption_msdf_f0064.png`, `text_multiscript_msdf.png`), usable as "rendered by the Cutweave compositor spike" imagery.

---

## 10. Roadmap

Source: `roadmap`, `docs/05-work-breakdown.md`. Effort: about 1,250 agent-days across 482 work packages; about 14 months to 1.0 and about 7.5 months to Public Alpha, "rough" and re-estimated after Phase 0. Human review capacity is the stated bottleneck.

| Phase | Delivers | Milestone and exit |
|---|---|---|
| **P0 Foundations and spikes** (about 5 weeks) | Repo, CI, governance, design tokens and `packages/ui`, ADRs 0001–0017, spikes S1–S5 | M0 Go/No-Go: **GO with changes, signed off 2026-11-23**; S3 (FFmpeg) unblocked and running, not passed |
| **P1 Walking skeleton** (about 10 weeks) | Model, command bus, persistence, media probe/decode, H.264 export, preview, MCP v0 (15 core tools), CLI, Electron shell and basic UI | **M1**: UI and an MCP agent both import, cut and export; byte-identical documents; recovery after engine kill (WP-1O.04) |
| **P2 Core editor** (about 9 weeks) | Multi-track magnetic timeline, keyframes, speed, audio features, proxies, export presets and queue, dockable workspaces, ~30 MCP tools, perf benchmarks | **M2 Dogfood**: a non-developer edits a 10-min YouTube video and a 9:16 short; 20 forced crashes, no data loss |
| **P3 Text, captions, transcripts** (about 8 weeks) | Text engine, compositions, transcripts, >= 25 caption styles, text-based editing, sticker and music packs, Agent Kit v0, unsigned installers | **M3 Public Alpha**: new user makes a captioned, silence-cut 9:16 short in under 5 minutes; an agent does it from one instruction |
| **P4 Effects, transitions, color** (about 9 weeks, parallel) | WGSL framework, >= 40 transitions, >= 50 effects, >= 40 filters, color tools and scopes, masks and keying, stabilization, tracking | **M4 Creative parity**: 10 "CapCut trend" recreations pass design review; preview equals export |
| **P5 AI gateway and AI Studio** (about 12 weeks, parallel) | Gateway, signed catalog, first-wave adapters, AI Studio panel, background removal, reframe, TTS, dubbing, upscale, long-to-shorts, local AI plugin, stock search | **M5 AI Studio**: every listed AI feature runs end to end with cost up front and provenance; spending-authority security tests pass |
| **P6 Plugins, templates, Agent Kit, copilot** (about 10 weeks, the largest) | Plugin platform and index, >= 30 templates, brand kit, interchange, publishers, Agent Kit v1, evals, copilot, MCP parity CI | **M6 Beta**: a third party ships an effect, an adapter and a panel from the docs alone; evals >= 80% on two clients; copilot handles the 10 most common CapCut workflows |
| **P7 Hardening and 1.0** (about 7 weeks) | Signed installers, auto-update, crash-free >= 99.5% (opt-in beta), fuzzing, accessibility (WCAG 2.2 AA), i18n (en plus >= 6), perf budgets green, docs, legal review, **website, samples, template gallery, community** | **1.0**: eight gates (signed installers, budgets green 7 nights, crash-free, accessibility, docs, legal and security, evals and MCP conformance, product-owner go/no-go) |

**After 1.0 (rough order):** browser "lite" editor; real-time collaboration (Loro CRDT); CLAP then VST3; HDR output; multicam; face and body effects; screen and webcam recording; region-prompt generative edits; node compositing view; distributed rendering; mobile companion; OFX bridge.

### Where the project is now (HEAD `7728d7c`, 2026-11-23)
- **P0:** built and merged (spikes S1, S2, S4, S4b, S5; scaffold; governance; design system). S3 decode is unblocked (2026-11-23) and running, not passed yet. M0 is GO with changes, signed off 2026-11-23.
- **P1: in progress, 40 of 60 work packages merged** (28 of them since `6ca1af7`, all on 2026-11-22 and 2026-11-23). Merged: 1A.01–03, 1B.01–09, 1C.01–04, 1D.07, 1F.01–03, 1G.01–02, 1H.02–03, 1I.01, 1I.02, 1I.04, 1J.01, 1J.03, 1K.01, 1L.01–03, 1M.01–03, 1M.05–06, 1N.01–02. Not yet: real media (1D.01–1D.06, blocked on FFmpeg), export (1E.01–1E.03), transport and A/V sync (1H.01), media HTTP endpoints (1I.03), subsystem wiring (1I.05), `render_frame` over MCP (1J.02), preview panel (1M.04), inspector, save/open and recovery dialog (1M.07), export dialog (1M.08), and the M1 acceptance suite (1O.01–1O.04).
- **FFmpeg-free path (R27–R31):** while S3 runs, work proceeds against existing seams: the engine's dev stub media backend (`--dev-stub-media`), generated audio sources, synthetic frames, and a core-only CLI and stdio MCP. These are not substitutes for the M1 exit, which needs real media.
- README and `AGENTS.md` now say Phase 1 (fixed in `e653c75`).

---

## 11. Open source and community

**License** (`ADR-0011`, `brief` D4)
- Core: GPL-3.0-or-later (`LICENSE`).
- Plugin SDK, WIT packages, composition runtime: MIT OR Apache-2.0 (dual license files in each directory).
- Plugin exception: `LICENSE-PLUGIN-EXCEPTION.md`, currently a **draft pending legal review, not in effect**.
- Third-party policy: GPL-3.0-compatible dependencies only (`cargo-deny` and a JS license check; `deny.toml`, `REUSE.toml`). Excludes AGPL, GPL-2.0-only, non-commercial models.
- Source headers carry SPDX identifiers, enforced by `cargo xtask license-headers`.

**Contribution mechanics** (`CONTRIBUTING.md`, `AGENTS.md`, `docs/06-dev-process.md`)
- **DCO** sign-off on every commit (`git commit -s`); a `dco.yml` workflow checks it. No CLA.
- Conventional commits; one work package per branch `wp/<WP-id>-<slug>`; squash-merge.
- `just check` runs everything CI runs; `just ci-local` is the local equivalent.
- AI-assisted contributions are explicitly welcome and have rules (`CONTRIBUTING.md` "AI-assisted and AI-agent contributions"); `AGENTS.md` is the canonical agent instruction file, `CLAUDE.md` imports it. The project is built largely by AI coding agents under human review (`docs/06-dev-process.md`); that is a legitimate and honest story to tell, with the caveat that review capacity is the bottleneck.
- Architecture decisions go through ADRs (MADR format, `docs/adr/`); larger changes go through an RFC process that is still to be written (`GOVERNANCE.md`).

**Governance files present at repo root:** `LICENSE`, `LICENSE-PLUGIN-EXCEPTION.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `GOVERNANCE.md` (explicitly a stub), `SECURITY.md` (private reports via GitHub Security Advisories, 90-day coordinated disclosure, acknowledgement within 5 working days), `REUSE.toml`, `.github/CODEOWNERS`, issue forms (bug, feature, work-package), PR template, labels.

**Links that exist**
- Org: https://github.com/cutweave
- Repo: https://github.com/cutweave/cutweave (the git remote)
- Security advisories: https://github.com/cutweave/cutweave/security/advisories/new
- Hardware tracking issue referenced in `M0`: https://github.com/cutweave/cutweave/issues/45
- Design-system reference artifact: https://claude.ai/artifact/573tiShNRj7J6eiGyApFiH (listed in the README; this is a claude.ai artifact URL, so verify it is publicly viewable before linking from the website).

**Links that do not exist yet:** website domain: the site moves to https://cutweave.app (2026-11-23; the repo README still links the old github.io address), docs site (WP-7E.01), chat or forum (WP-7G.03), releases page.

---

## 12. Gaps and what the site shows meanwhile

| Gap | State today | Produced by | Show in the meantime |
|---|---|---|---|
| **App screenshots** | None of the real editor. The shell renders but cannot edit. Storybook baselines exist: 86 PNGs under `packages/ui/__screenshots__/windows-chromium-sw/{dark,light}/` including timeline canvas (`stress-5000-clips`, `filmstrips`, `zoomed-waveform`, `states`) and components. | Editor visuals: WP-1M.\* (P1), WP-2H (P2). Auto-generated doc screenshots: WP-7E.02 from sample projects (WP-7G.02). | Component and timeline renders from Storybook, labelled "Design system, in development". Do not label as the app. A browser-pane screenshot of the current Electron shell could be captured by the site team if a labelled "early shell" image is wanted. |
| **Demo video / GIF** | None. | M1 demo video of import, cut, export on each OS (WP-1O.04); sample projects for demos (WP-7G.02). | Silent, looping captures of the S4 golden frames and the S1 timeline stress run; a transcript-style code view of the S5 agent run (`spikes/s5-command-bus/agent-run/run-1.claude.jsonl`) rendered as text, not video. |
| **Downloads and installers** | None. No release tags or artifacts. | Unsigned alpha installers WP-3I.01 (P3); signed installers WP-7A.02–05; download page WP-7G.01. | No download button. Use a "Follow development on GitHub" primary action (verb-first, honest). State status plainly: "Pre-alpha. Not ready to use." |
| **Template gallery** | No templates exist. | WP-6D.06–12 (>= 30 templates), gallery page WP-7G.01. | Omit the gallery. Optionally show the real composition source from `arch §12` as "the kind of thing a template is made of". |
| **Docs site** | Only the repo `docs/` folder; no site. | WP-7E.01 (infrastructure), 7E.02–03 (user guide, "Coming from CapCut", SDK, MCP, command reference). | Link to `docs/` on GitHub. Mirror the architecture overview and the ADR index (`docs/adr/README.md`) as a "How it works" page. |
| **Command reference** | Generated and committed in the repo: `docs/reference/commands.md` (43 commands, from the registry), `docs/reference/cli.md`, `rpc.md`, `launch-protocol.md`, `mcp-clients.md`, `protocol.md`, plus `schema/`. Not yet on a docs site. | Published docs site: WP-7E.03. | Link to the reference files on GitHub. |
| **Sample projects** | None. | WP-7G.02 (>= 5 samples). | None; do not imply any. |
| **Real MCP tool listing** | Production v0: 14 core tools plus 4 generic (`schema/mcp-tools.json`). `render_frame` (WP-1J.02) and `export_start` (WP-1E.03) not in yet. | WP-1J.02, WP-2I. | Real names for the 14; the rest labelled planned. |
| **Community channels** | None beyond GitHub. | WP-7G.03 (Discussions plus one chat platform, human task). | GitHub repo, issues and security policy only. |
| **Testimonials, user quotes, case studies** | None, and no external users exist. | M2 dogfood (non-developer edits), M3 Public Alpha, WP-3I.04 (5 first-time users). | None. Do not fabricate. |
| **Logo** | Exists: `design/assets/logos/cutweave-mark.svg` (marigold `#f2b33d`, for dark grounds) and `cutweave-mark-ink.svg` (`#161616`, for light). README says the wordmark "Cutweave" in Bricolage Grotesque 700 with the mark left at cap height; min size 16 px; clear space one track height. | Refinement by a designer: P7 (`roadmap` P7 Design). | Use as is. Note the wordmark is a type rule, not a file. |
| **Social preview / OG image** | None. | Not scheduled in any WP (closest: WP-7G.01 launch website). | Site team to make one from the mark, tokens and the pitch line. |
| **Favicon / app icon** | Mark SVG only; app icon described in `design/assets/logos/README.md` but no packaged icon set. | WP-7A (packaging), P7 design pass. | Derive from the mark. |
| **Fonts for the site** | Exist and are OFL: Instrument Sans, Bricolage Grotesque, JetBrains Mono in `packages/ui/src/fonts`. | - | Self-host them (no third-party font CDN, in line with the privacy stance). |
| **Design tokens for the site** | Exist: `design/tokens.json`, `design/tokens.css` (dark default, light supported). | High-contrast theme in P7. | Reuse tokens directly; `design/README.md` says the website is a first-class consumer. |
| **Privacy page, accessibility statement, FAQ, changelog** | None. | WP-7F.04 (privacy), WP-7G.01. | Short privacy note drawn from `arch §18`: no account, no telemetry by default, keys in the OS keychain. Link `SECURITY.md`. |
| **Real benchmark figures** | Informal single-machine numbers only; formal runs wait on hardware (issue #45), macOS and Linux unmeasured. | WP-0C.04, 0D.02, 0E.03, 0F.03 (formal); WP-7D (budget dashboard). | Show the informal numbers in section 9 with the caveat. |
| **Press kit, trademark, domain, social handles** | Not done; listed as long-lead. | Roadmap long-lead table (start by P0). | None. |
| **Roadmap page data** | Authoritative and current. | - | Build directly from section 10; update when `docs/milestones/` gains M1. |
| **Status accuracy** | README and AGENTS.md lag the code. | - | Take stage from `git log` and `docs/milestones/`, not the README. |

### Suggested site structure that fits the facts
1. Home: pitch, three pillars (agents, ownership, familiar editing), a status strip ("Pre-alpha, Phase 1 in progress"), GitHub action.
2. How it works: section 8 diagram, "one engine, many clients".
3. For agents: sections 5.1–5.6 with the S5 evidence.
4. AI models and costs: section 6.
5. Plugins: section 7.
6. Compared with CapCut: section 4.
7. Roadmap: section 10 with the honest "now" marker.
8. Open source: section 11, with the draft-exception caveat.

### Claims to avoid until built (quick list)
"Download", "available on Windows/macOS/Linux", "works offline", "free alternative to CapCut" as a present-tense statement, any count of effects, templates or caption styles as existing, "plugins" as available, "AI Studio" as usable, "crash-proof", "real-time collaboration", any exclamation mark.

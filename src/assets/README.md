# Image sources

Every image the site uses must be recorded here with where it came from, so it can be replaced.
Only images that a page uses are copied. The golden frames are small, lossless PNGs and are used as they are, byte for
byte (Astro fingerprints the file name but does not re-encode it), so they stay verifiable against the product repo.

## render/

Frames rendered by the production compositor (`cutweave-render`, WP-1F.02 and WP-1F.03), copied byte for byte from the
product repo's committed test goldens (Git LFS) at `origin/main` `7728d7c`. They are **synthetic test cards**
(color bars, a gradient sweep, solid colors), not footage. The site labels them "Rendered by the production
compositor (test golden)". Adapter: DX12 on the NVIDIA GeForce RTX 3080 laptop GPU.

| File here | Source path in the product repo | Size | Notes |
|---|---|---|---|
| `render/contact-sheet.png` | `crates/cutweave-render/testdata/golden/dx12-nvidia-geforce-rtx-3080-laptop-gpu/contact_sheet_3x2.golden.png` | 640 x 290 | The `render.contact_sheet` golden: six frames over 8 s, 3 columns, timecodes burned in. Test `contact_sheet_golden_per_adapter` in `crates/cutweave-render/src/gpu/query_tests.rs`. |
| `render/pip-rotated-cropped.png` | `testdata/golden/render/dx12-nvidia-geforce-rtx-3080-laptop-gpu/pip_rotated_cropped.png` | 384 x 216 | A picture-in-picture layer rotated 17 degrees, cropped, at 80% opacity over color bars. Scene `pip_rotated_cropped` in `crates/cutweave-render/src/gpu/tests.rs`. SHA-256 equals the LFS pointer's oid (`cdfe4488…`). |

Extract again with `git -C <product repo> show origin/main:<path> | git lfs smudge > file` (the committed blob is an LFS pointer).
Used on `/how-it-works/`. Closes part of GAP-19 (see `docs/content-gaps.md`).

## app/ and public/media/ (the real editor, M1 test run)

Cut from `E:\projects\cutweave-demo\videos\m1-demo.webm`, a Playwright recording of the real Cutweave editor doing the
M1 UI run (`just m1-demo`, merged in product commit `b0d7281`, 2026-11-25; recording 1280 x 800, 13.6 s, no sound). The
clips in it are the M1 corpus (`testdata/corpus.toml`, marked `self-generated`): color bars with a burned-in timecode.
Nothing private is on screen except the export dialog's "Save to" field, which showed a local temp path for about half a
second: that field is covered with a plain box in the published video (ffmpeg `drawbox`, 6.1 to 6.9 s). The stills were
taken from the published (covered) video. Labelled "Real app, recorded by the M1 test run, pre-alpha, Windows".

| File here | How it was made | Notes |
|---|---|---|
| `public/media/m1-demo.webm` | The source recording, re-encoded with `libvpx-vp9 -crf 34 -an` and the "Save to" box covered | 513 KB, 1280 x 800, VP9. Served as a static file (no third party). Used on `/` and `/roadmap/` with `controls muted playsinline preload="none"`. |
| `public/media/m1-demo-poster.webp` | Frame at 5.6 s of the published video, `libwebp -quality 82` | The poster. Same image as `app/editor-preview.webp`. |
| `app/editor-preview.webp` | Frame at 5.6 s | Three test clips in the bin, two on the timeline, a duration typed into the inspector. |
| `app/export-progress.webp` | Frame at 9.0 s | The export dialog at 48%, 78.7 fps. |
| `app/export-complete.webp` | Frame at 13.2 s | "Export complete", 360 frames, 12.00 s. |

## render/ (M1 gate frames)

Copied from `E:\projects\Vidai\target\m1\validate\render\` (written by `just m1-gate`; the folder is not committed in the
product repo and was not modified). They are frames of the saved M1 project rendered by `cutweave render` from decoded,
self-generated test clips (frames 30 and 255 of the 12 s cut at 30 fps). Resized from 1920 x 1080 PNG to 960 x 540
WebP (`libwebp -quality 85`), so they are not byte copies. Labelled "Rendered by cutweave render from decoded test clips
(M1 gate)". Used on `/how-it-works/`.

| File here | Source | Notes |
|---|---|---|
| `render/m1-f00030.webp` | `target/m1/validate/render/f00030.png` | Frame 30, from the H.264 1080p60 clip. 48.9 dB PSNR against the exported frame. |
| `render/m1-f00255.webp` | `target/m1/validate/render/f00255.png` | Frame 255, from the rotated variable-frame-rate clip. 47.7 dB. |

Frame 150 (`f00150.png`) was not used.

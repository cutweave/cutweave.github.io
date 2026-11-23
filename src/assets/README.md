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

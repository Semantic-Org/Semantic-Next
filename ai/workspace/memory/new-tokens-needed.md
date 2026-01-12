- [x] Display Typography: A standardized scale for "Hero" and "Title" sizes is needed, as the current text scale ends at relatively small sizes that are insufficient for marketing headers or landing page titles.
  - Added `--title-3xs` through `--title-3xl` (9-level scale) with `--title-m` = 18px (h3)
  - Added `--text-3xs` through `--text-3xl` (9-level scale) with `--text-m` = 14px - pairs with title scale
  - Natural language aliases: `--title-micro` through `--title-massive`, `--text-micro` through `--text-massive`

- [x] Page Containers: Standardized maximum widths are needed to align content consistently (e.g., text columns vs. full page layouts) without resorting to arbitrary manual values.
  - Added `--text-container` (700px), `--content-container` (960px), `--wide-container` (1200px), `--fluid-container` (var(--fluid))
  - Added `--fluid` (100%) as general utility

- [x] Corner Rounding Scale: Intermediate options for corner roundness are needed (e.g., small, medium, large), as the current binary choice between a single default and fully circular doesn't adapt well to larger components like modals or cards.
  - Added `--border-radius-3xs` through `--border-radius-3xl` (9-level scale) with `--border-radius-m` = 4px (current default)
  - `--circular-radius` (500rem) remains for fully rounded/pill shapes
  - Natural language aliases: `--border-radius-micro` through `--border-radius-massive`
  - `--border-radius` remains as backward-compatible alias for `--border-radius-m`

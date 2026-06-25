# Bundle Size bot

Reports how a PR moves the shipped bundle sizes, posted as a single comment by
**Semantic Bundle Bot**. It's the size sister to the performance bot: same
two-workflow shape, same headline grammar, so the two comments read together.

Bundle size is one of this project's stated objectives — most consumers compile
in the browser via CDN, so runtime bytes are user-facing performance, and CI
otherwise reports only timing. This makes the byte cost of a change visible on
every PR.

## What it measures

For both the PR head and the merge base it builds the project and weighs every
shipped bundle in three compressions:

- **brotli** (quality 11) — the real over-the-wire cost a CDN serves, and the
  number the headline and significance tiers track
- **gzip** (level 9) — the universal fallback
- **raw** — uncompressed bytes

It also counts **lines of code shipped**, comments and blanks removed, so a PR
that adds 300 comment lines and two code lines reads as +2. That's a secondary
signal under a collapsed section.

The bundles are discovered from the workspace, not hand-listed (`targets.js`):

- every `packages/*` that builds a bundle, measured as its *bundled* min (deps
  inlined) so a change ripples into everything that ships it
- the assembled `@semantic-ui/core` framework
- the design-system primitives declared in core's `exports`, measured as their
  *cdn* min (framework external) so a primitive row moves only on its own code

New packages and primitives are picked up automatically — no edit here.

**Tree-shaken packages.** A few packages are consumed piecemeal — `utils` is just
independent functions — so their whole-package bundle is an upper bound, not a
per-consumer cost: a new export adds bytes there but tree-shakes to zero for
real consumers, and its real cost (if any) already shows up in the `component`
bundle. Those packages are listed in `TREE_SHAKEN` in `targets.js`. They're
still measured and shown (marked `†`), but they don't drive the verdict. This is
opt-out: every other package, including ones not built yet, counts as a real
shipped bundle by default. The standalone trio's other members (`reactivity`,
`query`) stay in — they're real products whose bundle size is a genuine signal.

## The comment

The title leads with the two numbers a reviewer wants: `{state} Bundle size:
{headline bundle} {brotli delta} brotli · {shipped LOC} for {sha}`. The headline
bundle is `@semantic-ui/component` whenever it moved — it already contains
reactivity, renderer, templating and the rest, so its delta is the real cost a
component shipper pays, with no cross-bundle sum to double-count. When component
didn't move, the changed bundle whose package shipped the most code is promoted.
The largest single increase, if it's a different bundle, is named in the alert.

State is a small vocabulary, with red reserved for CI-failing growth:

| state | icon | alert | when |
|---|:---:|---|---|
| no meaningful change | ⚪ | NOTE | nothing cleared the JND |
| improvement | 🟢 | NOTE | only shrinks |
| mixed | 🟡 | WARNING | both directions, or a small lone increase |
| warning | 🟡 | WARNING | a bundle grew ≥ 512 B or ≥ 2% |
| regression | 🔴 | CAUTION | a bundle grew ≥ 5 KB (or ≥ 10% on a ≥ 2 KB move) |

Severity keys off the worst single bundle's brotli growth, never a sum. A bundle
counts as changed only past a just-noticeable difference (128 B or 0.5% brotli),
so sub-noise wiggles stay quiet. Percent can escalate a tier, but only paired
with a real absolute move — a tiny primitive at +100 B / +14% is not a
regression. The changed-bundles table shows `brotli` (absolute), `Δ brotli`, and
`change` (percent), sorted increases-first; severity lives in the sort and the
banner, not per-row icons.

## How it runs

Two workflows, the same split the Benchmarks suite uses:

- **`bundle-size.yml`** builds and measures the PR head and the merge base, then
  uploads both snapshots. It builds untrusted PR code, so it holds only
  `contents: read` and never posts.
- **`bundle-size-report.yml`** runs after that completes, in the base-repo
  context where the bot secrets live (so it works for fork PRs). It renders the
  comment and posts it.

The build is fast (a cold full build is a few seconds), so measuring both sides
each run is cheaper than maintaining a committed baseline, and always compares
against the true merge base. There's no stored history — a runtime-heap canary
that would want history is the planned follow-up, not this.

### Author neutrality

The whole scorecard (`tools/ci/size/`) is overlaid from `main` in both
workflows, so a PR can't reshape how its own bundles are weighed. Build scripts
are deliberately *not* pinned: a real minification or tree-shaking win should
show up as a win.

On the PR that first adds this harness, `main` doesn't have it yet, so the
overlay no-ops and the PR's own copy runs (a self-test), the same way the bench
suite bootstraps.

## Setup (one time)

1. Create a GitHub App named **Semantic Bundle Bot**.
   - Repository permissions: **Pull requests: Read & write**, **Contents: Read**.
   - Upload `avatar.png` as the App's logo.
   - Install it on the repository.
2. Add repository secrets:
   - `SEMANTIC_BUNDLE_BOT_CLIENT_ID` — the App's client id
   - `SEMANTIC_BUNDLE_BOT_PRIVATE_KEY` — a generated private key (full PEM)
3. Open a PR that touches `packages/**` or `src/**` to see the comment.

## Running locally

```sh
# measure the current built tree
npm run build
node tools/ci/size/collect.js --root . --label current --out /tmp/current.json

# diff two snapshots into a comment
node tools/ci/size/reporter.js --results /tmp --sha "$(git rev-parse HEAD)" --repo Semantic-Org/Semantic-Next --out /tmp/report
cat /tmp/report/comment.md
```

## Files

| file | role |
|---|---|
| `targets.js` | discovers the bundles to weigh and the LOC source set |
| `measure.js` | raw / gzip / brotli sizing |
| `loc.js` | lines of code shipped, comments stripped |
| `collect.js` | CLI: measure one tree into a JSON snapshot |
| `reporter.js` | CLI: diff two snapshots into `comment.md` + `size-report.json` |
| `*.test.js` | `node --test` suites for the logic above |
| `avatar.svg` / `avatar.png` | the bot's avatar |

## Known limitation

The lines-of-code counter is a classifier, not a full JS parser. It handles
strings, template literals, and multi-line block comments, but a regex literal
containing `//` in code position can misattribute the tail of its line — the
line still counts as code, so the totals stay directional. It's a secondary
signal; the bundle bytes are the measurement.

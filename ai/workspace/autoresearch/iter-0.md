# Iteration 0: Baseline measurement

## Environment notes

- Host: local dev machine (not CI)
- Chrome: 147.0.7727.55, chromedriver: 147.0.2, headless
- Baseline build: `main` tip (`424401822` Harness: Add plan for csp with js eval)
  - Installed dedicated `node_modules` in `.claude/worktrees/main-baseline/` so workspace symlinks resolve to main's source (not perf/native's)
  - Built via `packages/renderer/bench/tachometer/build-ci.js baseline`
  - Copied `dist/baseline/*` into perf/native's `packages/renderer/bench/tachometer/dist/baseline/`
- Current build: `perf/native` (`087308428`, post-revert, equivalent to `ff609ec` per task prompt)
- Renderer tests: 920 passed / 4 skipped (green)
- Note: tachometer hit the 5-minute auto-sample timeout on several benchmarks (so confidence intervals are wider than CI runs). Numbers are directionally useful but individual unsure readings are low-confidence.

## Results — iter-0 vs main

### CI (`tachometer-ci.json`)
| Benchmark | tip (ms) | cur (ms) | Δ vs main |
|---|---|---|---|
| create-1k | 91.65 | 89.77 | -2.1% |
| create-10k | 778.25 | 778.67 | unsure (+0.1%) |
| append-1k | 81.46 | 86.69 | **+6.4%** |
| update-10th | 28.97 | 33.06 | **+14.1%** |
| select | 12.69 | 10.87 | -14.3% |
| swap-rows | 52.56 | 55.34 | +5.3% |
| clear | 10.40 | 13.64 | **+31.1%** |

### TodoMVC macro (`tachometer-ci-todo.json`)
| Benchmark | tip (ms) | cur (ms) | Δ vs main |
|---|---|---|---|
| bulk-add-50 | 27.92 | 31.20 | **+11.8%** |
| bulk-add-200 | 59.47 | 59.70 | unsure (+0.4%) |
| add-20 | 336.67 | 338.50 | unsure (+0.5%) |
| toggle-10 | 163.94 | 163.44 | unsure (-0.3%) |
| toggle-all | 9.25 | 9.27 | unsure (+0.2%) |
| remove-5-front | 79.01 | 78.26 | unsure (-1.0%) |
| remove-5-middle | 80.02 | 77.88 | unsure (-2.7%) |
| remove-5-back | 79.52 | 79.19 | unsure (-0.4%) |
| clear-completed | 17.97 | 17.92 | unsure (-0.2%) |

### TodoMVC micro (`tachometer-ci-todo-micro.json`)
| Benchmark | tip (ms) | cur (ms) | Δ vs main |
|---|---|---|---|
| toggle-first | 10.98 | 11.57 | unsure (+5.4%) |
| toggle-last | 10.82 | 10.88 | unsure (+0.5%) |
| toggle-middle | 10.99 | 10.70 | unsure (-2.6%) |
| remove-first | 12.10 | 11.63 | unsure (-3.9%) |
| remove-middle | 11.06 | 10.80 | unsure (-2.3%) |
| remove-last | 9.56 | 11.45 | **+19.7%** |
| filter-active | 16.29 | 16.35 | unsure (+0.4%) |
| filter-completed | 18.11 | 18.03 | unsure (-0.4%) |
| filter-all | 18.03 | 19.17 | **+6.3%** |
| edit-start | 11.54 | 10.92 | -5.4% |
| edit-save | 16.77 | 16.61 | unsure (-0.9%) |

## Divergence from CI table (`ff609ec` row)

The task's target regressions come from CI-measured numbers at `ff609ec` vs main. Locally the picture is notably different:

| Benchmark | CI says | Local says | Note |
|---|---|---|---|
| update-10th | +32% | +14.1% | Real regression, smaller magnitude |
| toggle-last | +19% | +0.5% unsure | **Not reproducing** |
| remove-5-back | +8% | -0.4% unsure | Not reproducing |
| edit-save | +7% | -0.9% unsure | Not reproducing |
| remove-middle | +6% | -2.3% unsure | Not reproducing |
| clear | **-36%** | **+31.1%** | Huge sign inversion |
| select | -40% | -14.3% | Win is smaller |

Plausible causes of the divergence: different Chrome version, different hardware (JIT behavior under heavy allocation varies), and auto-sample timeout cutting sample count short on the noisier benchmarks.

## Primary targets (locally-measurable)

Taking "any benchmark locally regressed by >5pp with a confident interval" as the iteration-target set:
- **update-10th** (+14.1%) — in task spec
- **clear** (+31.1%) — NOT in task spec, but huge
- **bulk-add-50** (+11.8%) — NOT in task spec, notable
- **remove-last** (+19.7%) — NOT in task spec, notable
- **append-1k** (+6.4%) — borderline
- **filter-all** (+6.3%) — borderline

## Regression-gate baseline (all benchmarks >= -5% vs main, track for >3pp gate)

Anything currently at -5% or better is "at risk" for being regressed back toward 0.
- select: -14.3%
- edit-start: -5.4%

All unsure benchmarks (within ±5pp of zero) also bear watching — a change that makes several of them tip into confident +Δ is a gate violation.

## Artifacts
- `iter-0-ci.json`
- `iter-0-todo.json`
- `iter-0-todo-micro.json`
- `parse.mjs` — parses any tachometer JSON into the table above

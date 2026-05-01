# Contributing Surface

## Framing

Most of the active roadmap is path-to-1.0 work that needs pair sessions or framework-deep familiarity. The contribution surface — public-facing briefs, labeled issues, contributor-onboarding docs — opens at 1.0. Pre-1.0, attracting outside contributors generates work the project can't accept and dilutes maintainer attention on shipping the tag.

The icebox is the natural shape of post-1.0 contribution: pre-scoped, framework-deep, motivated by concrete needs. It's already roughly the right artifact; the question is when and how it crosses the public boundary.

## Stance

| Phase | Action |
|---|---|
| Pre-1.0 (now → tag) | Minimal CONTRIBUTING.md. No icebox labeling. No issue grooming. |
| At 1.0 | Single graduation pass — audit icebox, write real CONTRIBUTING.md, stand up triage. |
| Post-1.0 | Lightweight triage labels new work by size + scope. |

## Pre-1.0 (now)

### Update CONTRIBUTING.md to a short, honest doorway

Three sections, nothing more:

- **Status.** Project is heads-down on 1.0; broader contribution opens at the tag.
- **Bug reports.** How to file, what's useful (repro, version, expected vs actual).
- **Watching the project.** Discussions / releases links; come back at 1.0.

No skill-area paths, no issue listings, no first-contribution walkthroughs. Honesty self-selects.

### Keep icebox graduation-friendly

The infrastructure exists already (`ai/plans/icebox/`, llms.txt routes, `/content/ai/contributing/`). The discipline worth keeping at write-time: when adding new icebox entries, write so they graduate cleanly. No unexplained internal references; explicit files-touched or package scope; acceptance in plain language.

Cheap to do at write-time, expensive to retrofit at 1.0 across 20+ entries.

### Don't restructure or label the icebox now

The current icebox is internal context. No community readiness tags, no folder reshuffling. The graduation distinction (contributor-shaped vs permanently internal) gets made once, at 1.0.

## At 1.0 (graduation pass)

### Icebox audit

Each entry gets one disposition:

- **Graduate** → public issue + CONTRIBUTING.md surface
- **Stay internal** → process work, blocked-on-external, open design questions
- **Promote to active** → if it's actually shipping next

Eyeballing today's icebox, ~⅔ graduate cleanly; the rest is permanently internal. The "stay internal" subset needs a home — either a sub-folder or a tag in the file. Decide at 1.0.

### Rewrite CONTRIBUTING.md for real

Public-facing, opinionated:

- Project values — what gets accepted, what doesn't
- Local setup
- Where to find work — link to filtered issues
- How PRs land — adapted from `author-pull-requests` skill into public language
- One paragraph of "the natural contributor here knows web components / signals / template engines" — most icebox-graduated work isn't shallow. Self-selects.

Open call: humans-and-agents in one file, or split (`CONTRIBUTING.md` + `AGENTS.md`)? Failure modes differ; maintenance overhead doubles. Defer.

### Stand up triage flow

See next section.

## Post-1.0 triage flow

Two axes for incoming work:

**Size (t-shirt + hours)**

| Label | Hours |
|---|---|
| `size:xs` | < 4h |
| `size:s` | 4–8h |
| `size:m` | 8–24h |
| `size:l` | 24h+ — likely needs a maintainer pair, not a contributor brief |

**Scope (where it lives)**

`area:component` · `area:behavior` · `area:framework` · `area:docs` · `area:tooling` · `area:tokens` · `area:research`

Triage = read incoming issue or proposal, attach one size + one scope, route. Cadence as-they-come at low volume, batched weekly if it grows.

### Format: GH-shaped vs md-shaped

Both viable. Pick at 1.0 based on how you feel about diffability vs discoverability.

| | GH-shaped (issues + labels) | md-shaped (`ai/contributing/tasks/`) |
|---|---|---|
| Discoverability | ✓ standard contributor workflow | ✗ contributors don't know to look |
| Filtering | ✓ native UI + API | ✗ no native filter |
| Diffable | ✗ no version history on brief | ✓ canonical in-repo artifact |
| Discussion locality | ✓ thread attached | ✗ splits between issue/PR and file |
| Graduates from icebox | ✗ rewrite | ✓ move + relabel |
| Agent-queryable | ✓ GraphQL | ✓ via llms.txt + content API |

**Likely answer: both, anchored on one.** The md brief is canonical; the GitHub issue links to it. Labels live on the issue (filter / query / surface). The brief lives in the repo (diff / graduate / review).

- **If anchored md** — each brief is `ai/contributing/tasks/{slug}.md` with frontmatter (size, scope, status). Optional sync script files / updates a GitHub issue. The file is source of truth.
- **If anchored GH** — issues are canonical. Md briefs only exist for the largest plan-shaped tasks; smaller items live entirely as issues with a template.

Choice axis: do graduating entries keep their in-repo brief, or does the icebox file close at graduation and the work live in GH? If the former, anchor md. If the latter, anchor GH.

## Open questions for 1.0

- Single CONTRIBUTING.md or split into CONTRIBUTING.md + AGENTS.md?
- Skill-area paths in CONTRIBUTING.md, or one "open issues" link? Depends on graduated-task volume.
- Permanent home for "stay internal" icebox subset — sub-folder vs in-file tag.
- GH-shaped vs md-shaped triage anchor.

## Out of scope

- Drafting CONTRIBUTING.md text (decided at 1.0)
- Issue templates (decided at 1.0)
- Final label scheme (size + scope is the shape; exact labels decided at 1.0)
- Icebox audit (done at 1.0)

The pre-1.0 work is small on purpose. The right action now is mostly to *not* build a contribution surface that can't be honored.

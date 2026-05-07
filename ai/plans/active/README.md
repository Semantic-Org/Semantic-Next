# Active

Plans currently in flight — an open PR or live pair work against them. Mirrored by `ROADMAP.md`'s `## Currently Open` section, so the active state surfaces from both directory browsing on GitHub and agent context.

## When a plan moves here

- A PR opens that implements the plan.
- Pair work goes live and the plan is being executed in conversation.

## Distinction from sibling directories

| Where | Meaning |
|---|---|
| `ai/plans/*.md` (top-level) | On the roadmap. Has a phase, a position, momentum — but not yet in flight. |
| `ai/plans/active/` | In flight — open PR or live pair work. |
| `ai/plans/icebox/` | Drafted but not on the active roadmap. |
| `ai/plans/archive/` | Completed or rejected. |

## Promotion in / out

**Into `active/`** (PR opens or pair work starts):
1. `git mv ai/plans/{plan}.md ai/plans/active/{plan}.md`
2. Update internal links in the moved file: sibling-plan refs (`other.md`) → `../other.md`; skill refs (`../skills/...`) → `../../skills/...`.
3. Update other plans linking *to* the moved file: `{plan}.md` → `active/{plan}.md`.
4. Add a one-line entry to `ROADMAP.md`'s `## Currently Open`.

**Out of `active/` — PR merged, plan complete**: follow the canonical archive flow in `manage-roadmap`. Add `## Completion`, `git mv` to `ai/plans/archive/`, remove from `Currently Open`.

**Out of `active/` — PR closed without merge or plan paused**: reverse the moves. `git mv` back to top-level, remove from `Currently Open`, restore link paths.

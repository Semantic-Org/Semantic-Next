# Icebox

Plans drafted but not yet on the active roadmap.

## When a plan goes here

- The work is captured (we don't want to lose the idea), but it isn't slotted into a phase or prioritized against current commitments.
- Most plans in mature engineering orgs live here. It's normal — capacity to imagine work outpaces capacity to ship it well.

## Distinction from sibling directories

| Where | Meaning |
|---|---|
| `ai/plans/*.md` (active) | On the roadmap. Has a phase, a position, momentum. |
| `ai/plans/icebox/` | Drafted but not on the roadmap. The inbox. |
| `ai/plans/deferred/` | Deliberately set aside with rationale and conditions for revisit. |
| `ai/plans/archive/` | Completed or rejected. |

The line between **icebox** and **deferred** is intent: deferred is an explicit "no, not now" decision; icebox is "we haven't decided yet." Most icebox plans are quietly forgotten or eventually promoted; deferred plans live with a rationale that earns them a slot if conditions change.

## Promotion path

To promote from icebox to active:

1. Move the file: `mv ai/plans/icebox/{plan}.md ai/plans/{plan}.md`
2. Add a row to the appropriate `ROADMAP.md` section (Do Next, Up Next, or Blocked)
3. Remove the entry from `ROADMAP.md`'s "Icebox" section

## Conventions

Icebox plans are typically `initial` scope — open questions remain and a pair session is needed before they're ready to execute. They don't need a `## Sessions` breakdown yet; that's part of what scoping adds during promotion.

`ROADMAP.md` carries an "Icebox" section that lists icebox plans by name (one-line, pointer only). Detail lives in the plan file.

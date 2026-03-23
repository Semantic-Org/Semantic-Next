# Agent Workspace

Scratch space for in-progress agent work. Files here are temporary and should move to permanent homes when finished.

## Folders

- **plans/** — Implementation plans. Move to `plans/complete/` when done or rejected.
- **memory/** — Reference docs that inform ongoing work. Delete when the work lands.
- **artifacts/** — Intermediate outputs (CSVs, reports, checklists). Delete when consumed.
- **artifacts/skills/** — Skill drafts that need workshopping before publishing to `ai/`.
- **scripts/** — One-off analysis scripts. Delete after use.

## Lifecycle

`workspace → artifacts/skills → ai/` (published skill)

## ai/resources/ (separate from workspace)

`ai/resources/` stores **ingested reference material** supplied by humans — classic SUI source, competitive screenshots, etc. Agents should not add files there; it is curated input, not agent output.

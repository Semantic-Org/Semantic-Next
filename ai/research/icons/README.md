# Icon Research

The descriptive record behind the canonical icon vocabulary in `packages/specs/src/icons/mappings.js`. Documents *why* the 482 canonical names were chosen and *how* the dictionary is built. The shipping product never reads from this directory directly — every output lands in `mappings.js`.

The optimization target is **agent hit rate**: the names a developer or AI agent reaches for on first pass. When the name a developer reaches for diverges from the upstream library's artifact name (`trash-2` → `trash`, `circle-user` → `avatar`, `square-arrow-out-up-right` → `external-link`), the canonical promotes to the reached-for name and the artifact becomes an alias.

## Layout

| Path | Role |
|---|---|
| `selection-process.md` | Methodology — three-pass adversarial curation that converged on the canonical roster |
| `inclusion-rationale.md` | Per-icon judgments from the expansion review (additions and rejections with reasoning) |
| `roster-audit.md` | Third-party audit findings — concept gaps and mapping-integrity fixes |
| `description-pipeline.md` | Methodology for the blind-vision pipeline producing `visual` and `usage` fields |
| `canonical-roster.txt` | The canonical name set |
| `renames.csv` | Artifact-name → canonical rename rules |
| `selection-{exhaustive,editorial}.txt` | The two initial selection passes that fed the audit |
| `pipeline/` | The generation pipeline — methodology, per-pass data, scripts |

## Using this corpus

Two skills cover the read paths and the write paths.

**Read** — to understand why a name is canonical, why an alias exists, or why an icon was rejected, load `icon-vocabulary` (`mcp__semantic-ui__use_skill icon-vocabulary`). It points at the relevant judgment files.

**Write** — to add icons, refresh a library after upstream rename, add a sixth library, or promote an alias to canonical, load `maintain-icon-vocabulary` (`mcp__semantic-ui__use_skill maintain-icon-vocabulary`). It walks the four scenarios with concrete commands.

The pipeline scripts both live under `pipeline/`:

```bash
# Fill empty library fields after adding new entries
node ai/research/icons/pipeline/merge-mappings.mjs

# Refresh one library's stale values (e.g. Phosphor renamed an icon)
node ai/research/icons/pipeline/merge-mappings.mjs --library phosphor --update

# Apply a promotion table
node ai/research/icons/pipeline/apply-promotions.mjs ai/research/icons/pipeline/promotions.json

# After any mutation to mappings.js
cd packages/specs && npm run build:icons
```

## Adding new judgments

When `mappings.js` is changed, append the reasoning that justifies the change to the appropriate file:

- **New canonical added or rejected** → `inclusion-rationale.md`
- **Promotion (canonical renamed)** → `inclusion-rationale.md` or a fresh promotion entry in `pipeline/promotions.json`
- **Cross-library lookup added or refreshed** → the per-icon `reason` field in `pipeline/{library}.json`

The corpus is descriptive, not prescriptive. Future readers (human or agent) should be able to reconstruct *why* the dictionary looks the way it does, file by file.

---
title: Naming Public API — The Clean-Room Pass
description: The clean-room naming pass for any public surface — an export, a config option, a token field, a value word. A structurally isolated subagent roleplays the downstream user against a behavior-only brief, and the maintainer adjudicates its slate against context the room lacked.
keywords: [naming, clean room, public api, vocabulary, blind evaluation, downstream user, kill-tests, noun, carried names]
audience: contributing
skill: name-public-api
type: skill
---

# Naming Public API — The Clean-Room Pass

> **Skill:** `name-public-api`
> **Purpose:** Run a blind naming pass before any public name ships — pre-1.0 names carry zero inertia only until they merge

---

**Golden rule: internal machinery never names external surface.** A public name states the intent — what the user experiences — not the mechanism that delivers it. Tailer, marker, valve, escalate, oplog, epoch: none of these belong on a public name, however load-bearing they are inside. Corollary: if the downstream-user brief cannot describe the thing without internal vocabulary, suspect the THING, not just the name.

**Second law: a carried name never inherits a seat.** A name that arrives from a prototype, a draft, or a prior session goes through the room as a slot, not a fixed neighbor. `patternFrom` rode a prototype into a PR unexamined; the blind rerun killed its noun on a misparse and three parties converged on `wildcardPath` independently (2026-08-11). When presenting a ruling list, say which names were workshopped and which were carried.

## When to Run It

Whenever any PUBLIC surface gets a name — an export, a config key, a method, a discriminant value, a token field. The pass is cheapest at the naming moment and nearly free compared to a rename later. Proven on the sync layer's option slate (tailer/marker/escalate became externalWriteIntervalMs / autoRefreshStaggerMs / refreshAfterRows) and on the paths toolkit (the segment union, `pathFrom`, `elementPath`, `pathKey`, `isPathKey`, `wildcardPath`).

Skip it for: a single internal rename, test-only knobs, anything behind an underscore. The pass earns its ~25k tokens on public surface only — and public surface is exactly where a wrong name costs a major version.

## The Pass

1. **Write the downstream-user brief.** For each unnamed slot: the behavior as a user EXPERIENCES it (never how it works), the value shape, where it lives, and its sibling names VERBATIM — harmony is judged against real neighbors. List which sibling names are settled and which are carried; carried names become slots. Writing the brief is half the value, because it forces the intent statement the docs will need anyway.

2. **Leak-check the brief, twice.** Isolation is structural, never instructional — you cannot tell an agent to ignore what it has read (see the `fresh-take` skill, whose laws this pass applies to naming). Two leaks to hunt:
   - **Decision energy.** It leaks in ways smaller than candidates — the ORDER you describe slots in, an adjective that sells one behavior, three sentences on the case your favorite name explains best. Reread every sentence asking: could someone reconstruct what I'm hoping the room says?
   - **The incumbent's noun.** Describing a concept using the very word under test feeds the room its answer — a brief that says "pattern strings" has already named `patternFrom`. Describe the behavior without the noun; if the room mints the incumbent's word blind, that is the endorsement, and it is only available to a brief that withheld it.

3. **Spawn the clean room AS the downstream user, in scenario.** One subagent (Opus), structurally isolated: it reads NO repo files, everything it needs is in the brief. The persona is the point — a naming consultant optimizes craft; a user configuring a tool they will never read the source of surfaces what a real person would expect, guess, and type. The scenario, paste-ready:

   > It's Tuesday evening and you're wiring an open-source framework's library into your app. You have the README open, not the source — you will never open the source. For each unnamed thing below, I'll tell you what it does for you — never how it works inside. First, before anything else: what would you GUESS it's called? What would you type into autocomplete hoping it exists? Then, name the NOUN: what is this value even called, in your own words — the noun choice is half the answer. Then propose the name it SHOULD have — the one you'd understand instantly meeting it in a stranger's code six months from now. Last, for your finalists, the misparse test: seeing only the name in code cold, say what you'd assume it does — first impression, no second reading.

4. **Include the house style facts, verbatim-close:** camelCase; `is*` for yes/no guards, `create*` for factories, `to*` for conversions; pure builders read `<noun>From(input)`; no abbreviations; one term per concept across the whole library. For config surfaces add the boundary rule: mechanical cadences are unit-suffixed numbers (`relayIntervalMs: 1000`), policy windows are prose duration strings (`retention: '48h'`).

5. **Include the kill-tests, all four:** the read-aloud test (say the usage aloud — a sentence or noise?); the hebbian-neighbor test (collides with or typo-reads as something every JS dev types constantly?); the name-begets-value-shape law (a name should let a zero-knowledge reader predict the value's shape cold); no mechanism words.

6. **Demand the deliverables:** autocomplete guesses first, then 4-6 candidates per slot with one-line reasoning; a ranked verdict WITH the read-aloud sentence; the FAMILY view (winners re-ranked as a set beside the fixed ensemble — the room must say if set-coherence changes any pick, and which noun does shared work); the kill list with one-word reasons; a collapse advisory (should any slot not exist — merged, folded, or dropped), marked advisory-only.

7. **Present the room's slate AS-IS first — then adjudicate with the context the room lacked.** The fresh-take ordering law: no editorial reconciliation before the maintainer reads the raw slate; the delta between the room's view and yours IS the signal, and collapsing it early destroys it. The adjudication half:
   - **Blind convergence with shipped vocabulary is the strongest signal naming ever gives** — the room independently choosing a noun the surface already ships confirms the vocabulary is natural, not insider.
   - **Blind divergence from a shipped or favored name is evidence against the name, not against the room** — `pattern` died this way, killed cold on the RegExp misparse by a room that never heard the incumbent.
   - Check the room's vocabulary locks against shipped prose and shipped API names — a segment tag like `{ type: 'wildcard' }` is a commitment the prose must follow.
   - Test its advisories against physical truth it could not see.

8. **The maintainer rules; the rename flows as one mechanical batch** — source, tests, types, docs, examples, changelog, and prose unification on the winning noun move together, never separately.

---

## Quick Reference

| Step | Output |
|------|--------|
| Brief | Behavior-only slots + verbatim neighbors, carried names marked as slots |
| Leak check | No decision energy, no incumbent nouns |
| Room | Opus subagent, no file access, downstream-user scenario |
| Demands | Guesses, noun, candidates, ranked verdict, family view, kill list, collapse advisory |
| Adjudicate | Raw slate first; convergence endorses, divergence indicts the name |
| Rule | Maintainer decides; rename ships as one batch |

Kill-tests: read-aloud / hebbian-neighbor / name-begets-value-shape / no mechanism words.

## Related Skills

| Skill | Type | Use when... |
|-------|------|-------------|
| **fresh-take** | skill | The isolation laws this pass applies to naming — structural, never instructional |
| **coding-standards** | skill | The house naming conventions the brief cites (verbs, builders, one term per concept) |
| **code-comments** | skill | The voice the winning name's doc line ships in |

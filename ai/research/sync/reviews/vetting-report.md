# Vetting Report — Five-Lens Fable Gate (2026-06-11)

Five independent Fable agents vetted the complete corpus: a coherence auditor (scenario/plan/protocol cross-consistency), a cold-read staff engineer (zero context, told not to be polite), a drift checker (steelmen vs contracts, line by line), and two blind developers building real variations from the examples alone. This is the synthesis of all five reports.

## Verdict: revise-then-build

The cold read's summary judgment, which the other four lenses substantiate: the architecture's bets are right (server-authoritative rebase, channel-scoped replicas, client-held cursors, reset-as-valve, the taxonomy, the unbundling), the adversarial process is real discipline, and the Tracker-ambient-reactivity advantage is structural. But the corpus is **partially reconciled** (the contract documents lag the decisions), **two Tier-1 gates haven't run**, several heavyweight mechanisms were **adopted by review momentum without costing**, and the design's hardest consumer-facing claims all live in the **unbuilt trip-editor column**.

## The Convergent Findings (multiple independent lenses, highest confidence)

**1. The txid hold-group machinery should be re-litigated — three lenses converge against it.** The coherence audit ran the glass-bead test and found *no scenario line requiring cross-channel atomic visibility* (single-doc atomicity is the scenario's column; migrations waive atomicity; role tiers are never co-subscribed). The cold read found the client *provably cannot run it* (cursor opacity hides "channel already past this tx" — a livelock variant beyond the one the protocol review caught) and proposes server-side regrouping: one-frame-per-tx-per-socket for live flow, server-side tail regrouping at resume (per-request computation, stateless-node invariant survives). The heaviest client machinery in the protocol has no workload justification and a provable information gap. **Recommendation: move grouping server-side or demote cross-channel atomicity to a capability.**

**2. The examples are load-bearing documentation and currently teach bugs — drift and both blind devs converge.** Every internal inconsistency the drift checker found mechanically (phantom `component.css` imports, undefined `daysSince` and `self.pages()`, the update-vs-save README contradiction, the `where: 'all'` sentinel sent to the server, `deletedAt` filtered but never declared or written) was *also* hit by the blind developers — who, lacking the plan, could not distinguish example bugs from intended API and either propagated them or wrote defensive deviations. Examples-as-training-data cuts both ways: every example bug is a future agent's invented-wrong API.

**3. The corpus's contract layer lags its decision layer — coherence's central finding.** plan.md's Protocol Sketch still shows the superseded wire (`method`/`result.cursor`/per-session ledger) that ws-protocol explicitly replaced. The scenario contradicts itself on dashboard staleness (the taxonomy's 1-2s bound is live-by-default-era residue against the nonreactive default). Ephemeral collections assert wire behavior the protocol never adopted even as a capability. The protocol's no-re-report-of-trimmed-outcomes stance directly violates the scenario's later-codified hard fail. And the sanctioned 500-doc migration batch triggers the spans-size pathology attributed only to forbidden giant transactions (~1,000-1,500 channel addresses per delta frame).

## The Cold Read's Pushback (decisions to re-litigate before any package code)

1. **Txid hold groups** → server-side regrouping (see convergence 1).
2. **Per-path conflict map in v1** → ship parking + dead-letter first (zero server metadata, satisfies the hard-fail bar), measure the false-confirm rate, add per-path evidence only if earned. The map costs a second durable write per write on every doc forever — a UX optimization priced as infrastructure.
3. **Ambient write privilege** → reopen at 0a. Three costs for a symmetry slogan: the snapshot-branch expiry hole, the reserved-name tax (which already forced save-not-update in this corpus's own design example), and call-site invisibility. An explicit privileged surface in ctx is sound under async by construction.
4. **scenario.md as sole constitution** → add a second canonical scenario at the small rung (CDN hobbyist, one collection, no auth) with equal standing. Every complexity purchase currently argues against no counterweight.
5. **Flush discipline as convention** → wrong layer; we own the scheduler. A small apply-barrier primitive in reactivity converts four documented conventions into one enforced invariant.
6. **"Weekend-portability"** → retire or re-earn the claim; the protocol outgrew it several revisions ago. Portability is delivered by the conformance suite now.

## Cold-Read Risks Without a Current Owner

Scope-to-capacity (large-application scale, uncosted — needs an engineer-month line and a named reference-server maintainer); multi-node channel-instance ownership (undeclared — v1 must state single-node or design ownership); instance-minting DoS (per-client instance caps belong in the security posture); scoped-handle proxy array-likes (Array.isArray/spread/JSON edge cases — needs an identity story and an escape hatch before 0a freezes).

## Named Gaps (scenario requirements with no mechanism)

Hot-path 300ms debounce ownership (the law of the hot paths has no assigned layer); per-doc channel near-zero retention knob (the 700KB-tail figure prescribes a knob no document defines); per-surface staleness budgets with bound-exceeded disclosure (the taxonomy's central contract has no enforcement machinery); the 100-co-editor frame-rate ceiling (named watch variable, nothing watches it); the deliberate epoch-bump API and the stale-bundle reload affordance (both asserted by the migration window, mechanized nowhere).

## The Reference-Doc Commission (from the blind developers)

What two competent newcomers could not learn from the examples — the exact contents of the missing API reference: subscription-handle meta surface (ready/total/pages/error/refresh), the draft API (values()? commit routing — *name-convention 'save' is currently a guess*; touched-path inspection; what commit returns), event-handler param bags per section, mutator schema strictness (strip vs reject; shorthand optionality — both devs independently hit this), form binding for non-text controls, the reserved-name list, the ambient template-helper vocabulary, no-projection channel default semantics (fail-closed text says nothing crosses; the todomvc channel has no fields list — one of them is wrong), and Date-over-the-wire in mutator args. Plus two genuinely new design questions: **draft eviction pinning** (does an open draft pin its doc against pool eviction?) and **time-dependent reactivity** (isOverdue flips at midnight — is there a reactive clock?).

## Ranked Revision List

**R1 — reconcile (mechanical, do first):** sweep all stale residue (coherence lists 9), fix the scenario's self-contradiction (dashboard staleness bound by tier), update plan's Protocol Sketch to the ws-protocol wire or replace with a pointer, fix the steelmen (drift lists 23 items), correct todomvc's fail-closed violation.
**R2 — re-litigate (Jack's calls):** the six pushback items above.
**R3 — protocol v2:** fold the five-voice review + this vet's protocol findings (trimmed-outcomes, spans cap or bulk-write txid exemption, ephemeral frame adopt-or-defer, epoch-bump API, retention knob, reload capability) into one reconciled ws-protocol.md.
**R4 — the trip-editor steelman + API reference:** the unbuilt column holds the hardest claims; the blind-dev commission defines the reference doc.
**R5 — gates:** the two Tier-1 spikes (unchanged, still mandatory), plus the scheduler ownership decision before the rebase engine exists.
**R6 — process:** engineer-month costing, multi-node statement, abuse limits, second scenario.

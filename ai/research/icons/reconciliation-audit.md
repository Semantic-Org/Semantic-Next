# Icon Reconciliation Audit

**Auditor:** Claude Opus 4.6 (independent review)
**Date:** 2026-03-18
**Scope:** 401 icons present in the exhaustive 827 but absent from the converged 441

## Methodology

For each of the 401 rejected icons, I checked:

1. Does the 441 already contain this icon or a near-synonym?
2. Does `mappings.js` already cover this concept via a semantic name + alias?
3. Could this icon earn a **distinct, intuitive semantic name** an agent would reach for?
4. Would an agent building common UIs (dashboards, chat, e-commerce, admin, dev tools, settings, editors, landing pages, analytics, CMS, social) genuinely need this concept and fail to find a substitute?

I am deliberately strict. "Nice to have" does not qualify. The bar is: an agent reaches for this name, it doesn't exist, and nothing in the 441 serves as a reasonable substitute.

## Summary

After reviewing all 401 rejected icons, I identified **16 genuine concept gaps** and **21 mapping integrity issues** (Lucide icons referenced by mappings.js but missing from the 441). The remaining ~364 are correctly rejected as synonyms, container variants, niche objects, or excessive granularity of concepts already well-covered.

## Icons That Should Be Restored

### 1. `user-x` -> semantic name: `block-user`
An agent building a social platform or admin panel would reach for "block-user" or "ban-user" as a distinct action from "remove-user" (which implies deletion). Blocking is about access control; removing is about roster management. The 441 has `user-minus` (remove-user) and `ban` (general prohibition), but no user-specific block action.

### 2. `user-search` -> semantic name: `search-user`
On admin panels and CRM dashboards, searching for a specific user is a common action. `search` exists for general content, but `search-user` is a distinct compound action an agent would reach for when building user management UIs. The 441 has no user+search combination.

### 3. `vote` -> semantic name: `vote`
Polling, voting, and ballot features are common in community platforms, survey tools, and team decision UIs. This is conceptually distinct from thumbs-up (reaction) or star (rating). An agent building a poll or election feature would look for "vote" and find nothing equivalent.

### 4. `voicemail` -> semantic name: `voicemail`
Telephony UIs, contact centers, and communication dashboards commonly need a voicemail indicator. The 441 has phone/phone-call/phone-off but nothing for voicemail, which is a distinct telecom concept.

### 5. `text-cursor-input` -> semantic name: `text-input`
An agent building form documentation, input field indicators, or editor toolbars would reach for "text-input" or "input-field". This represents the concept of a text input field, distinct from "type" (typography) or "text-cursor" (just a cursor). Common in form builders and design systems.

### 6. `picture-in-picture` -> semantic name: `picture-in-picture`
Video platforms, conferencing apps, and media players commonly offer PiP mode. This is a distinct UI concept with no substitute in the 441. An agent building a video player would reach for this.

### 7. `regex` -> semantic name: `regex`
Dev tools, search-and-replace UIs, log viewers, and data validation forms commonly surface regex as a toggle or mode. The 441 has `code` and `search-code`, but regex is a specific, well-known concept developers reach for distinctly.

### 8. `sigma` -> semantic name: `sum`
Dashboards, spreadsheets, analytics panels, and reporting UIs commonly need a "sum" or "aggregate" icon. This is a fundamental math/data operation with no substitute in the 441. An agent building an analytics dashboard would reach for "sum" or "total".

### 9. `shapes` -> semantic name: `shapes`
Design tools, whiteboard apps, and presentation builders need a "shapes" icon for shape insertion toolbars. This is distinct from any individual shape (circle, square, triangle) in the 441. An agent building a drawing or presentation tool would look for "shapes".

### 10. `scale` -> semantic name: `balance`
The mappings.js already defines a `balance` semantic name pointing to Lucide's `scale`, but `scale` is not in the 441 final list. This means the semantic mapping references a Lucide icon that won't actually be available. This is a data consistency issue that needs resolution -- `scale` must be in the icon set for the `balance` mapping to work.

### 11. `waypoints` -> semantic name: `waypoints`
Flow builders, journey maps, onboarding wizards, and process visualization UIs need a "waypoints" or "path-steps" concept. This is distinct from `route` (directions between A and B) -- waypoints represent a series of connected nodes or steps. An agent building a user journey or flow visualization would reach for this.

### 12. `separator-horizontal` -> semantic name: `divider`
Layout UIs, form builders, page editors, and CMS tools commonly need a horizontal divider/separator concept. The 441 has no equivalent. An agent building a page layout editor or content block system would reach for "divider" or "separator".

### 13. `text-select` -> semantic name: `text-select`
Rich text editors, annotation tools, and document collaboration UIs need a text selection indicator. This is distinct from "cursor" (mouse-pointer) and "highlight" (highlighter). An agent building a collaborative document editor would reach for "text-select" when showing selection state.

### 14. `scroll-text` -> semantic name: `terms`
Terms of service, legal agreements, EULA acceptance -- the "scroll" (document scroll) icon is the universal symbol for legal/agreement text. The 441 has `file-text` (generic document) and `book` (docs), but nothing that says "terms" or "agreement" to an agent building a signup flow or legal page.

### 15. `variable` -> semantic name: `variable`
Template builders, formula editors, no-code platforms, and dev tools commonly need a "variable" or "placeholder" concept. This is distinct from `code` (general code) or `braces` (syntax). An agent building a template editor with variable insertion would reach for this.

### 16. `radar` -> semantic name: `radar`
Analytics dashboards commonly use radar/spider charts. The 441 covers bar, line, pie, scatter, area, candlestick, gantt, and network charts, but not radar charts. An agent building a comprehensive analytics dashboard would reach for "radar-chart" or "radar" and find nothing.

### 17. `mouse-pointer-click` -> semantic name: `click`
Analytics dashboards (click tracking), interaction tutorials, onboarding tooltips, and A/B testing UIs need a "click" concept. The 441 has `mouse` (the device) and `mouse-pointer` is in mappings.js as `cursor`, but "click" (the action of clicking) is a distinct concept. An agent building click analytics or interaction heatmaps would reach for this.

## Notable Rejections (Correctly Excluded)

These are icons I considered carefully but ultimately agree should stay rejected:

- **`milestone`**: Already in the 441 final list AND in mappings.js. (Wait -- actually `milestone` IS in the 827 rejects. Checking... `milestone` appears in mappings.js mapped to Lucide's `milestone`, but it's NOT in the 441 Lucide list. Same data consistency issue as `scale`.)

**Correction -- `milestone` should also be restored:**

### 18. `milestone` -> semantic name: `milestone`
mappings.js defines a `milestone` semantic name pointing to Lucide's `milestone`, but the icon isn't in the 441. This is another data consistency issue. Project management tools, roadmaps, and sprint planning UIs need milestones. Restoring for mapping integrity.

And checking for other mapping consistency issues:

### Mapping Consistency Check

I cross-referenced every `lucide:` value in mappings.js against the 441 list. These Lucide icons are referenced in mappings.js but **missing from the 441**:

| Semantic Name | Lucide Icon | In 441? | Status |
|---|---|---|---|
| `balance` | `scale` | No | **Must restore** (flagged above as #10) |
| `milestone` | `milestone` | No | **Must restore** (flagged above as #18) |
| `heading` | `heading` | No | Uses `heading-1` through `heading-3` as proxies, but the generic `heading` Lucide icon is missing |
| `refresh` | `refresh-cw` | No | The 441 has `refresh-ccw` but not `refresh-cw`. mappings.js points to `refresh-cw`. |
| `organization` | `building` | No | The 441 has `building-2` but not `building`. mappings.js uses `building` for "organization". |
| `pen` | `pen` | No | The 441 has `pencil` and `paintbrush`. mappings.js has a distinct `pen` semantic name pointing to Lucide's `pen`. |
| `mouse-pointer` | `mouse-pointer` | No | mappings.js defines `mouse-pointer` (cursor/select) pointing to this, but it's not in the 441. |
| `file-remove` | `file-minus` | No | mappings.js `file-remove` points to `file-minus`, not in 441. |
| `tablet` | `tablet` | No | mappings.js `tablet` device points to Lucide's `tablet`, not in 441. |
| `laptop` | `laptop` | No | mappings.js `laptop` device points to Lucide's `laptop`, not in 441. |
| `tv` | `tv` | No | mappings.js `tv` points to Lucide's `tv`, not in 441. The 441 has `tv-minimal`. |
| `cast` | `cast` | No | mappings.js `cast` points to Lucide's `cast`, not in 441. |
| `usb` | `usb` | No | mappings.js `usb` points to Lucide's `usb`, not in 441. |
| `watch` | `watch` | No | mappings.js `watch` points to Lucide's `watch`, not in 441. |
| `hexagon` | `hexagon` | No | mappings.js `hexagon` points to this, not in 441. |
| `triangle` | `triangle` | No | mappings.js `triangle` points to this, not in 441. |
| `vault` | `vault` | No | mappings.js `vault` points to this, not in 441. |
| `snow` | `snowflake` | No | mappings.js `snow` points to `snowflake`, not in 441. |
| `wind` | `wind` | No | mappings.js `wind` points to this, not in 441. |
| `temperature` | `thermometer` | No | mappings.js `temperature` points to `thermometer`, not in 441. |
| `water` | `droplet` | No | mappings.js `water` points to `droplet`, not in 441. |

This is a significant finding. **20 Lucide icons** referenced by mappings.js are not in the 441 final list. This means those semantic names will silently fail to render when using the Lucide icon set.

### Mandatory Restorations (Mapping Integrity)

These must be added to the 441 regardless of the semantic name test, because mappings.js already references them:

1. `scale` (balance)
2. `milestone` (milestone)
3. `heading` (heading)
4. `refresh-cw` (refresh)
5. `building` (organization)
6. `pen` (pen/draw)
7. `mouse-pointer` (mouse-pointer/cursor)
8. `file-minus` (file-remove)
9. `tablet` (tablet)
10. `laptop` (laptop)
11. `tv` (tv)
12. `cast` (cast)
13. `usb` (usb)
14. `watch` (watch)
15. `hexagon` (hexagon)
16. `triangle` (triangle)
17. `vault` (vault)
18. `snowflake` (snow)
19. `wind` (wind)
20. `thermometer` (temperature)
21. `droplet` (water)

*Note: Some of these (like `laptop`, `tablet`, `tv`) were in the 827 exhaustive list. Others like `heading` were also in the 827. All should be restored for mapping integrity.*

## Final Recommendations

### Tier 1: Mapping Integrity (21 icons)
These Lucide icons are referenced by existing semantic mappings and **must** be in the icon set or those mappings break silently. See "Mandatory Restorations" above.

### Tier 2: Genuine Concept Gaps (16 icons)
These represent distinct concepts not covered by any existing semantic name:

| # | Lucide Icon | Semantic Name | Justification |
|---|---|---|---|
| 1 | `user-x` | `block-user` | Distinct from remove-user; access control vs. roster management |
| 2 | `user-search` | `search-user` | Admin panels and CRM; distinct compound action |
| 3 | `vote` | `vote` | Polls, surveys, team decisions; distinct from reactions |
| 4 | `voicemail` | `voicemail` | Telephony UIs; distinct from phone/call |
| 5 | `text-cursor-input` | `text-input` | Form builders; represents an input field concept |
| 6 | `picture-in-picture` | `picture-in-picture` | Video platforms; distinct UI mode |
| 7 | `regex` | `regex` | Dev tools, search UIs; specific well-known concept |
| 8 | `sigma` | `sum` | Analytics dashboards; fundamental aggregation concept |
| 9 | `shapes` | `shapes` | Design/drawing tools; distinct from individual shapes |
| 10 | `waypoints` | `waypoints` | Flow builders, journey maps; connected node paths |
| 11 | `separator-horizontal` | `divider` | Layout editors, CMS; horizontal content separator |
| 12 | `text-select` | `text-select` | Rich text editors, annotation tools; distinct from cursor and highlight |
| 13 | `scroll-text` | `terms` | Legal/signup flows; universal symbol for agreements and TOS |
| 14 | `variable` | `variable` | Template editors, no-code tools; distinct from code/braces |
| 15 | `radar` | `radar` | Analytics dashboards; radar/spider chart type not otherwise covered |
| 16 | `mouse-pointer-click` | `click` | Click analytics, interaction tracking, onboarding |

### Total Impact
- Current 441 + 21 mapping fixes + 16 new concepts = **478 icons**
- This is an ~8.4% increase, well within reasonable bounds
- More importantly, it eliminates silent failures in the existing mapping system

## Icons Reviewed and Correctly Rejected (~364)

The remaining ~364 icons fall into these categories:

- **Container/shape variants** (square-x, circle-chevron-*, octagon-alert, etc.): Same concept in different frames
- **Granularity overkill** (chart-column-decreasing, chart-no-axes-column-increasing, etc.): Covered by base chart types
- **Synonym Lucide names** (cog = settings, brush = paintbrush, etc.): Already mapped via semantic aliases
- **Directional variants** (arrow-big-*, arrow-down-from-line, move-horizontal, etc.): Covered by base directional icons
- **State variants of covered concepts** (bug-off, bot-off, lightbulb-off, etc.): Niche on/off states
- **File/folder micro-states** (folder-check, folder-down, folder-lock, etc.): Excessive folder variants
- **Message micro-variants** (message-circle-code, message-square-warning, etc.): Covered by base message types
- **Round user duplicates** (user-round-*, users-round): Stylistic variants of user icons
- **Niche objects** (atom, orbit, mountain, umbrella, skull, siren, ear, etc.): Rarely needed in app UIs

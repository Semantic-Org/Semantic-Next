# Icon Mapping Review Checklist

Issues identified during review of `src/primitives/icon/sets/mappings.json`.

## Semantic Conflicts

- [x] **`copy` vs `duplicate`** - RESOLVED: Renamed `duplicate` → `copy` (overlapping docs), renamed `copy` → `clipboard`
- [x] **`active` vs `radio`** - RESOLVED: Collapsed to `filled-circle` / `empty-circle` with semantic terms as aliases
- [x] **`refresh` vs `sync`** - RESOLVED: `refresh` is canonical, `sync` is alias
- [x] **`tree` vs `hierarchy`** - RESOLVED: `tree` is canonical, `hierarchy` is alias

## Inconsistent Cross-Library Mappings

- [ ] **`anchor`** - lucide/feather/tabler get nautical anchor, but heroicons/bootstrap/material/ionicons get link icon. Breaks visual consistency
- [ ] **`dashboard`** - Wild variation: layout-dashboard vs speedometer vs squares-2x2. User will get very different visuals depending on icon set
- [ ] **`record`** - heroicons maps to "stop" (square) instead of circle. Wrong icon
- [ ] **`circle`** - heroicons maps to "stop" (square). Literally not a circle
- [ ] **`loading`** - heroicons/material/ionicons use refresh/arrow-path icons, not spinners

## Categorization Questions

- [x] **`bluetooth`/`wifi`** - RESOLVED: Created new `connectivity` category, moved bluetooth/wifi/network there
- [x] **`fire`** - RESOLVED: Moved to `status` category, kept `trending` as alias, set feather to null (no equivalent)
- [x] **`support`** - RESOLVED: Moved to `status`. Kept `help` and `info` as separate icons (❓ vs ℹ️)

## Lost Semantics

- [ ] **`assigned`** - heroicons/material lose the checkmark, just show plain user
- [ ] **`anonymous`** - Most sets just show generic user icon, doesn't convey anonymity
- [ ] **`typing`** - Just a chat bubble, no indication of "typing in progress"
- [ ] **`return`** (commerce) - Uses rotate/undo arrows, not intuitive for "return an item"

## Data Issues

- [x] **`pin`** - RESOLVED: `pin` = thumbtack (social), `map-pin` = location marker. Removed duplicate.

---

## Resolved

_(Move items here as we discuss and resolve them)_

---

## Tacit Knowledge for Future Context

**What we're doing:**
- Reviewing/cleaning up the universal icon mapping in `src/primitives/icon/sets/mappings.json`
- The goal is canonical icon names that LLMs can reliably use when generating web UIs
- `icon-index.js` is a flat list for the user to visually scan during review (they can't read the whole JSON in their head)

**Key decisions made:**
- Canonical name = most common/intuitive term humans/LLMs would use
- Aliases handle alternative terms (e.g., `sparkles` is canonical, `ai` and `magic` are aliases)
- No duplicate top-level keys - if two icons are visually identical, collapse into one with aliases
- Visual noun pattern for shapes (e.g., `filled-circle`, `empty-circle`)
- Use `null` in mappings when an icon set doesn't have an equivalent (don't use a wrong icon)

**Don't f* this up:**
1. When renaming: update BOTH `mappings.json` AND `icon-index.js`
2. The per-library icon mappings (lucide, feather, etc.) are "garbage LLM output" - focus on canonical naming, not fixing those
3. Categories in icon-index.js are just comments - actual category lives in mappings.json
4. Trim-the-fat pass (removing niche icons) is SEPARATE from this naming review
5. User prefers simple/common words as canonical (e.g., `tree` over `hierarchy`, `fire` over `flame`)
6. Don't verify sync after every change - wastes context

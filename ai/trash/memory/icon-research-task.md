# Icon Research Task

Cross-reference these icons across icon frameworks (Lucide, Heroicons, Tabler, Phosphor, Bootstrap Icons, Material Icons, Ionicons) to build universal mappings.

---

## 1. Feather Icons NOT in Universal Mappings

These Feather icons exist in `src/primitives/icon/sets/feather/index.css` but have no entry in `icon-set-mappings-full.md`:

```
airplay
alert-octagon
arrow-down-circle
arrow-down-left
arrow-down-right
arrow-left-circle
arrow-right-circle
arrow-up-circle
arrow-up-left
arrow-up-right
battery-charging
bell-off
box
chevrons-down
cloud-drizzle
cloud-off
codepen
codesandbox
corner-down-left
corner-left-down
corner-left-up
corner-right-down
corner-right-up
delete
divide
divide-circle
divide-square
dribbble
edit
figma
file-minus
film
folder-minus
framer
git-commit
git-merge
git-pull-request
gitlab
meh
minus
minus-circle
minus-square
mouse-pointer
navigation-2
pause-circle
pen-tool
phone-call
phone-forwarded
phone-incoming
phone-missed
phone-off
phone-outgoing
play-circle
plus-circle
plus-square
pocket
refresh-ccw
share
shield-off
stop-circle
sunrise
sunset
trash
tv
twitch
umbrella
user-x
video-off
voicemail
volume
wifi-off
x-octagon
x-square
zap-off
```

**Total: ~74 unmapped Feather icons**

---

## 2. Priority Icons to Add (Used in Docs)

These are actively used in the codebase and should be prioritized:

| Feather Name | Suggested Universal Name | Description | Category |
|--------------|--------------------------|-------------|----------|
| `mouse-pointer` | `pointer` | Mouse cursor/pointer for selection | data |
| `shield-off` | `insecure` | Disabled/broken security | security |
| `alert-octagon` | `critical` | Severe error/stop sign | status |
| `box` | `box` | Generic box/container | file |
| `edit` | `edit` (alias to pencil) | Base edit icon | action |
| `minus` | `minus` | Minus/subtract | action |
| `film` | `film` | Video/movie reel | media |
| `video-off` | `video-off` | Camera disabled | media |
| `bell-off` | `notifications-off` | Notifications muted | communication |
| `wifi-off` | `offline` | No connection | development |
| `zap-off` | `disabled` | Feature disabled | system |

---

## 3. Brand Icons to Consider

| Feather Name | Notes |
|--------------|-------|
| `codesandbox` | Code playground - commonly used in docs |
| `codepen` | Code playground |
| `dribbble` | Design platform |
| `figma` | Design tool - very common |
| `framer` | Design/dev tool |
| `gitlab` | Git platform |
| `twitch` | Streaming platform |
| `pocket` | Save for later service |

---

## 4. Utility/Variant Icons (Lower Priority)

These are variants or less commonly used:

### Circle/Square variants
- `arrow-down-circle`, `arrow-left-circle`, `arrow-right-circle`, `arrow-up-circle`
- `minus-circle`, `minus-square`
- `plus-circle`, `plus-square`
- `pause-circle`, `play-circle`, `stop-circle`
- `divide-circle`, `divide-square`
- `x-octagon`, `x-square`

### Diagonal arrows
- `arrow-down-left`, `arrow-down-right`, `arrow-up-left`, `arrow-up-right`

### Corner arrows (for undo/redo/reply variants)
- `corner-down-left`, `corner-left-down`, `corner-left-up`, `corner-right-down`, `corner-right-up`

### Phone variants
- `phone-call`, `phone-forwarded`, `phone-incoming`, `phone-missed`, `phone-off`, `phone-outgoing`

### Git operations
- `git-commit`, `git-merge`, `git-pull-request`

### Time of day
- `sunrise`, `sunset`

### Other
- `airplay`, `battery-charging`, `cloud-drizzle`, `cloud-off`
- `delete` (backspace key), `divide`
- `file-minus`, `folder-minus`
- `meh` (neutral face emoji)
- `navigation-2`, `pen-tool`
- `refresh-ccw`, `share` (vs share-2)
- `trash` (vs trash-2), `tv`, `umbrella`
- `user-x`, `voicemail`, `volume` (base)

---

## Research Instructions

For each icon in Section 2, find the equivalent in:
- Lucide (lucide.dev)
- Heroicons (heroicons.com)
- Tabler (tabler.io/icons)
- Phosphor (phosphoricons.com)
- Bootstrap Icons (icons.getbootstrap.com)
- Material Icons (fonts.google.com/icons)
- Ionicons (ionic.io/ionicons)

Output format should match the existing `icon-set-mappings-full.md` JSON structure.

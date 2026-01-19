# SUI DevTools Extension - Progress Tracker

## Current Status: Phase 1 - Foundation (Ready for Testing)

## Phase 1: Foundation (Detection & Tree)

### Files Created
- [x] `manifest.json` - Extension manifest (MV3)
- [x] `devtools.html` / `devtools.js` - DevTools entry point
- [x] `panel/panel.html` / `panel/panel.js` / `panel/panel.css` - Main panel UI
- [x] `panel/components/tree-view.js` - Component tree
- [x] `background/service-worker.js` - Message routing
- [x] `content/content-script.js` - Page injection relay
- [x] `content/bridge.js` - Injected into page context
- [x] `shared/constants.js` - Message types
- [x] `scripts/build.js` - Main build script
- [x] `icons/` - Extension icons (from SUI logo)

### Build
```bash
cd /home/jack/semantic/next
node tools/devtools/scripts/build.js
```
Output: `tools/devtools/dist/`

### Test Criteria
- [ ] Extension loads in DevTools
- [ ] Panel shows "Semantic UI" tab
- [ ] Tree shows full DOM structure (not just SUI components)
- [ ] SUI components are visually distinguished (bold, indigo color)
- [ ] Shadow DOM is expanded inline (no separate shadow root tree)
- [ ] Filtered nodes (comments, astro-island) are hidden by default
- [ ] Clicking tree node logs component to console
- [ ] Hovering tree node highlights element on page

### How to Test
1. Open `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select: `/home/jack/semantic/next/tools/devtools/dist`
5. Open DevTools on any SUI page (e.g., docs site)
6. Look for "Semantic UI" tab

---

## Phase 2: Developer Tab
_Not started_

## Phase 3: Styles Tab
_Not started_

## Phase 4: Events Tab & Polish
_Not started_

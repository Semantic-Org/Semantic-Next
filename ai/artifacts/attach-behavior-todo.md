# Attach Behavior - Agreed Changes

## Critical Missing Features

### 1. Scroll Container Detection
- [x] CSS anchors escape overflow containers - no container detection needed
- [ ] Fix `isInView()` to check viewport bounds only, not clipping parent
- [ ] Change from `$el.isInView({ fully: true })` to `$el.intersects($(window), { fully: true })`

### 2. Mutation Observer Implementation  
- [ ] Add mutation observer for style changes on self
- [ ] Add mutation observer for anchor removal
- [ ] Default `observeChanges: false` for minimal reactivity
- [ ] Implementation:
  ```javascript
  mutations: {
    'attributes[style]': ({ self }) => self.reposition(),
    'remove {to}': ({ self }) => self.handleAnchorRemoved()
  }
  ```

### 3. Destruction Cleanup
- [ ] Remove `anchor-name` CSS property from anchor element
- [ ] Skip inline style removal to avoid tampering with user styles
- [ ] Avoid reflow sources in destroy method
- [ ] Store original parent if `moveElement` was used (for potential restoration)

### 4. Arrow Distance Calculation
- [ ] Default: arrow doesn't add to distance (for tight fits)
- [ ] Add optional `arrowAddsDistance: boolean` setting
- [ ] Handle corner positions with diagonal offset
- [ ] Consider using `--arrow-distance-corner` CSS variable for corner cases

### 5. Visibility/State Management
- [ ] Implement `lastResort` positioning when no positions fit
- [ ] Use `alwaysShow` to control whether to position when no valid position exists
- [ ] Logic: 
  - If no positions fit AND `alwaysShow: true` → use `lastResort` position
  - If no positions fit AND `alwaysShow: false` → leave element unchanged

### 6. Fixed Issues
- [x] Typo: `setting.position` → `settings.position` (line 279)

### 7. Event Integration
- [ ] Listen to `transition:ended` in addition to `transition:started`
- [ ] Dispatch custom events: `attach:repositioned`, `attach:fallback`, etc.
- [ ] Only reposition when visible (current implementation correct)

### 8. Re-attachment Logic
- [x] Settings updates work via reinit
- [x] Multiple attachments already work (unique anchor names per instance)
- [ ] Add `changeAnchor(newSelector)` method for switching anchors
- [ ] Track original anchor selector for potential restoration

## Implementation Notes

- Transition events handle most common repositioning cases
- Mutation observers should be minimal and opt-in
- CSS anchor positioning fundamentally changes scroll container behavior
- Position checking logic needs viewport-only bounds due to anchor escaping
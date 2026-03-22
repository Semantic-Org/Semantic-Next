import { defineComponent } from '@semantic-ui/component';
import css from './SubtreeCachingTest.css?raw';
import template from './SubtreeCachingTest.html?raw';

const allItems = [
  { name: 'Alpha', value: 10, active: true, color: '#e74c3c' },
  { name: 'Beta', value: 20, active: false, color: '#3498db' },
  { name: 'Gamma', value: 30, active: true, color: '#2ecc71' },
  { name: 'Delta', value: 40, active: false, color: '#f39c12' },
];

const groups = [
  {
    name: 'Group A',
    entries: [
      { name: 'Installation', url: '/install' },
      { name: 'Setup Guide', url: '/setup' },
      { name: 'Quick Start', url: '/start' },
    ],
  },
  {
    name: 'Group B',
    entries: [
      { name: 'Select', url: '/select' },
      { name: 'Search', url: '/search' },
      { name: 'Settings', url: '/settings' },
    ],
  },
];

const searchTerms = ['', 'se', 'set', ''];

const duplicatePrimitives = [1, 1, 2, 2, 3];

const layeredItems = [
  { id: 'x1', name: 'Node A', show: true, tier: 'gold' },
  { id: 'x2', name: 'Node B', show: false, tier: 'silver' },
  { id: 'x3', name: 'Node C', show: true, tier: 'bronze' },
];

const asyncItems = [
  { id: 'a1', label: 'Fast', delay: 100 },
  { id: 'a2', label: 'Medium', delay: 250 },
  { id: 'a3', label: 'Slow', delay: 400 },
];

const thresholdItems = [
  { id: 'p1', name: 'Alpha', threshold: 1 },
  { id: 'p2', name: 'Bravo', threshold: 2 },
  { id: 'p3', name: 'Charlie', threshold: 3 },
];

const defaultState = {
  // Async & rerender
  darkMode: false,
  fetchVersion: 0,
  counter: 0,
  label: 'initial',
  depthSignal: 0,
  // Each loops
  filterActive: false,
  dupMultiplier: 1,
  listPopulated: true,
  globalThreshold: 0,
  tick: 0,
  // Nested structures
  searchIndex: 0,
  layerKey: 0,
  layerFlip: false,
  // Snippets
  snippetOuter: 'hello',
  snippetInner: 'world',
  // Async in loops
  asyncItemVersion: 0,
  // Non-reactive
  nrVersion: 0,
  nrCondVersion: 0,
  nrSnippetVersion: 0,
  rerenderTick: 0,
  rerenderLabel: 'initial',
  // Attribute & reorder
  reversed: false,
  attrLabel: 'initial',
  // Special
  guardInput: 'low',
  svgScale: 1,
  htmlScale: 1,
};

const defaultSettings = {
  attrLabel: 'initial',
};

const createComponent = ({ state, settings }) => ({
  // 1. Async inside rerender
  async formatMessage(dark = state.darkMode.get()) {
    await new Promise(r => setTimeout(r, 300));
    return `Message (dark=${dark})`;
  },

  // 2. Async stale promise
  async fetchWithDelay() {
    const version = state.fetchVersion.get();
    await new Promise(r => setTimeout(r, 500));
    return `Result v${version}`;
  },

  // 3. Computed value in rerender
  getComputedLabel() {
    return `Label: ${state.label.get()} (#${state.counter.get()})`;
  },

  // 4. Nested rerender
  getDepthLabel() {
    return `Depth: ${state.depthSignal.get()}`;
  },
  getTimestamp() {
    return new Date().toLocaleTimeString();
  },

  // 5. Each with filter
  getFilteredItems() {
    const active = state.filterActive.get();
    return active ? allItems.filter(i => i.active) : allItems;
  },

  // 6. Duplicate primitives
  getDuplicates() {
    const mult = state.dupMultiplier.get();
    return duplicatePrimitives.map(v => v * mult);
  },

  // 7. Toggleable list
  getToggleableList() {
    return state.listPopulated.get()
      ? [{ id: 't1', text: 'Apple' }, { id: 't2', text: 'Banana' }, { id: 't3', text: 'Cherry' }]
      : [];
  },

  // 8. Conditional in each
  items: allItems,
  getToggleItems: () => {
    state.tick.get();
    return allItems;
  },

  // 9. External signal threshold
  isAboveThreshold(threshold) {
    return state.globalThreshold.get() >= threshold;
  },
  thresholdItems,

  // 10. Nested each with highlights
  getGroups() {
    const idx = state.searchIndex.get();
    const term = searchTerms[idx];
    if (!term) { return groups; }
    return groups.map(group => ({
      ...group,
      entries: group.entries
        .filter(e => e.name.toLowerCase().includes(term))
        .map(e => {
          const i = e.name.toLowerCase().indexOf(term);
          return {
            ...e,
            highlight: {
              before: e.name.slice(0, i),
              match: e.name.slice(i, i + term.length),
              after: e.name.slice(i + term.length),
            },
          };
        }),
    })).filter(g => g.entries.length > 0);
  },

  // 11. Three-level nesting
  getLayeredItems() {
    state.layerKey.get();
    const flip = state.layerFlip.get();
    return layeredItems.map(item => ({
      ...item,
      show: flip ? !item.show : item.show,
    }));
  },

  // 13. Nested snippets
  getOuterText() {
    return state.snippetOuter.get();
  },
  getInnerText() {
    return state.snippetInner.get();
  },

  // 14. Async per-item
  getAsyncItems() {
    const version = state.asyncItemVersion.get();
    return version === 0
      ? asyncItems
      : asyncItems.map(item => ({ ...item, label: `${item.label} v${version}` }));
  },
  async resolveItem(item) {
    await new Promise(r => setTimeout(r, item.delay));
    return `${item.label} done @ ${Date.now() % 10000}`;
  },

  // 15. Guard equivalence
  getGuardCategory() {
    const input = state.guardInput.get();
    return (input === 'low' || input === 'medium') ? 'basic' : 'premium';
  },

  // 16. SVG/HTML
  svgShapes: [
    { label: 'Dot A', cx: 25, cy: 25, r: 15 },
    { label: 'Dot B', cx: 75, cy: 25, r: 15 },
  ],
  getSvgScale() {
    return state.svgScale.get();
  },
  getHtmlScale() {
    return state.htmlScale.get();
  },

  // 15a. Non-reactive expressions in each
  getNonReactiveItems() {
    const v = state.nrVersion.get();
    return [
      { id: 'x', name: 'X', status: v === 0 ? 'pending' : 'done' },
      { id: 'y', name: 'Y', status: v === 0 ? 'pending' : 'done' },
    ];
  },

  // 15b. Non-reactive conditionals in each
  getNonReactiveCondItems() {
    const v = state.nrCondVersion.get();
    return [
      { id: 'a', name: 'A', visible: v === 0 },
      { id: 'b', name: 'B', visible: v !== 0 },
    ];
  },

  // 15c. Non-reactive snippet data in each
  getNonReactiveSnippetItems() {
    const v = state.nrSnippetVersion.get();
    return [
      { id: 'a', tag: v === 0 ? 'old-A' : 'new-A' },
      { id: 'b', tag: v === 0 ? 'old-B' : 'new-B' },
    ];
  },

  // 15d. Non-reactive data in rerender
  getRerenderLabel() {
    return `${state.rerenderLabel.get()}:${state.rerenderTick.get()}`;
  },

  // 13b. Attribute-driven async
  async formatAttrLabel(lbl = settings.attrLabel) {
    await new Promise(r => setTimeout(r, 300));
    return `formatted:${lbl}`;
  },

  // 14. Reorder
  getOrderedItems() {
    const ordered = [
      { id: 'a', name: 'Alpha', color: 'red' },
      { id: 'b', name: 'Beta', color: 'blue' },
      { id: 'c', name: 'Gamma', color: 'green' },
    ];
    return state.reversed.get() ? [...ordered].reverse() : ordered;
  },
});

const events = {
  'click .trigger-rerender'({ state }) {
    state.darkMode.toggle();
  },
  'click .rapid-fetch'({ state }) {
    state.fetchVersion.increment();
    setTimeout(() => state.fetchVersion.increment(), 100);
    setTimeout(() => state.fetchVersion.increment(), 200);
  },
  'click .change-label'({ state }) {
    state.label.set(state.label.peek() === 'initial' ? 'updated' : 'initial');
    state.counter.increment();
  },
  'click .depth-bump'({ state }) {
    state.depthSignal.increment();
  },
  'click .toggle-filter'({ state }) {
    state.filterActive.toggle();
  },
  'click .dup-toggle'({ state }) {
    state.dupMultiplier.set(state.dupMultiplier.peek() === 1 ? 10 : 1);
  },
  'click .toggle-list'({ state }) {
    state.listPopulated.toggle();
  },
  'click .toggle-active'({ state }) {
    allItems.forEach(item => {
      item.active = !item.active;
    });
    state.tick.increment();
  },
  'click .threshold-bump'({ state }) {
    state.globalThreshold.set((state.globalThreshold.peek() + 1) % 4);
  },
  'click .cycle-search'({ state }) {
    state.searchIndex.set((state.searchIndex.get() + 1) % searchTerms.length);
  },
  'click .layer-bump'({ state }) {
    state.layerKey.increment();
  },
  'click .layer-flip'({ state }) {
    state.layerFlip.toggle();
  },
  'click .snippet-swap'({ state }) {
    const a = state.snippetOuter.peek();
    const b = state.snippetInner.peek();
    state.snippetOuter.set(b);
    state.snippetInner.set(a);
  },
  'click .async-version'({ state }) {
    state.asyncItemVersion.increment();
  },
  'click .guard-cycle'({ state }) {
    const cycle = ['low', 'medium', 'high'];
    const idx = cycle.indexOf(state.guardInput.peek());
    state.guardInput.set(cycle[(idx + 1) % cycle.length]);
  },
  'click .svg-scale'({ state }) {
    state.svgScale.set(state.svgScale.peek() === 1 ? 1.5 : 1);
  },
  'click .html-scale'({ state }) {
    state.htmlScale.set(state.htmlScale.peek() === 1 ? 1.5 : 1);
  },
};

const SubtreeCachingTest = defineComponent({
  tagName: 'subtree-caching-test',
  template,
  css,
  createComponent,
  defaultState,
  events,
});

export default SubtreeCachingTest;
export { SubtreeCachingTest };

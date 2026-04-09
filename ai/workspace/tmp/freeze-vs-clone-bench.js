import { clone } from '../../../packages/utils/src/cloning.js';
import { isArray, isDate, isMap, isRegExp, isSet } from '../../../packages/utils/src/types.js';

/*----------------------------------------------
  Deep Freeze
----------------------------------------------*/
const deepFreeze = (obj) => {
  if (obj === null || typeof obj !== 'object' || Object.isFrozen(obj)) {
    return obj;
  }
  Object.freeze(obj);
  if (isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      deepFreeze(obj[i]);
    }
  }
  else if (isMap(obj) || isSet(obj) || isDate(obj) || isRegExp(obj)) {
    return obj;
  }
  else {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      deepFreeze(obj[keys[i]]);
    }
  }
  return obj;
};

const noop = () => {};

/*----------------------------------------------
  Real Component Data Factories
----------------------------------------------*/

// theme-switcher: simplest state in the codebase
const makeThemeSwitcherState = () => ({
  theme: undefined,
});

// input spec defaultValues: small settings from spec
const makeInputDefaults = () => ({
  name: '',
  type: 'text',
  debounced: false,
  'debounce-interval': 150,
  clearable: '',
  value: '',
});

// copy-button: settings with nested object
const makeCopyButtonSettings = () => ({
  text: '',
  icon: 'copy',
  copiedIcon: 'check',
  tooltip: true,
  animation: 'confirm',
  resetDelay: 2000,
  tooltipSettings: {
    delay: 0,
    hideDelay: 0,
    duration: 0,
  },
});

// mobile-menu: state with empty objects that get populated at runtime
const makeMobileMenuState = () => ({
  depth: 0,
  activeMenu: {},
  previousMenu: {},
  nextMenu: {},
});

// mobile-menu at runtime: state after user navigated into a submenu
const makeMobileMenuStateRuntime = () => ({
  depth: 2,
  activeMenu: {
    header: 'Components',
    menu: [
      { name: 'Button', url: '/docs/components/button', icon: 'pointer' },
      { name: 'Input', url: '/docs/components/input', icon: 'text-cursor' },
      { name: 'Modal', url: '/docs/components/modal', icon: 'window' },
      { name: 'Dropdown', url: '/docs/components/dropdown', icon: 'chevron-down' },
      { name: 'Table', url: '/docs/components/table', icon: 'table' },
    ],
  },
  previousMenu: {
    header: 'Framework',
    menu: [
      { name: 'Components', url: '/docs/components' },
      { name: 'Primitives', url: '/docs/primitives' },
      { name: 'Behaviors', url: '/docs/behaviors' },
    ],
  },
  nextMenu: {},
});

// global-search: largest defaultState, empty
const makeSearchStateEmpty = () => ({
  rawResults: [],
  results: [],
  displayResults: [],
  selectedIndex: 0,
  selectedResult: undefined,
  resultOffset: 0,
  searchTerm: '',
  noResults: false,
  modalOpen: false,
});

// global-search at runtime: populated with search results
const makeSearchResult = (i) => ({
  title: `Component ${i}: Button Variations`,
  titleHighlight: `Component ${i}: <mark>Button</mark> Variations`,
  subtitle: '/docs/components/button',
  subtitleHighlight: '/docs/components/<mark>button</mark>',
  tags: [
    { text: 'component', color: 'blue' },
    { text: 'element', color: 'teal' },
  ],
  description: 'A button indicates a possible user action. Buttons can contain text, icons, or both.',
  url: `/docs/components/button-${i}`,
  meta: { section: 'components', category: 'elements' },
  excerpt: 'Use the emphasis prop to <mark>style</mark> a button with varying levels of visual prominence.',
});

const makeSearchStatePopulated = () => ({
  rawResults: Array.from({ length: 20 }, (_, i) => ({ id: `r${i}`, score: 0.9 - i * 0.02 })),
  results: Array.from({ length: 20 }, (_, i) => makeSearchResult(i)),
  displayResults: Array.from({ length: 10 }, (_, i) => makeSearchResult(i)),
  selectedIndex: 3,
  selectedResult: makeSearchResult(3),
  resultOffset: 0,
  searchTerm: 'button',
  noResults: false,
  modalOpen: true,
});

// tooltip: large settings with function values
const makeTooltipSettings = () => ({
  html: '',
  text: 'Copy to clipboard',
  header: '',
  position: 'top',
  trigger: 'hover',
  animation: 'auto',
  duration: 'auto',
  delay: 200,
  hideDelay: 70,
  warmWindow: 1200,
  arrow: true,
  topLayer: true,
  distance: 0,
  offset: 0,
  preserve: true,
  hoverable: false,
  containToScroll: true,
  onShow: noop,
  onHide: noop,
  onVisible: noop,
  onHidden: noop,
});

// button spec: the largest single object shape — compiled component spec
const makeButtonSpec = () => ({
  tagName: 'ui-button',
  content: ['icon', 'image', 'badge'],
  contentAttributes: ['icon', 'image', 'badge'],
  types: ['emphasis', 'link', 'styled', 'toggle', 'animated'],
  variations: [
    'size',
    'color',
    'emphasis',
    'basic',
    'social',
    'shape',
    'compact',
    'fluid',
    'inverted',
    'circular',
    'attached',
    'floated',
    'align',
    'animated',
    'icon-only',
    'icon-after',
  ],
  states: ['hover', 'pressed', 'focus', 'active', 'disabled', 'loading'],
  settings: ['icon-only', 'icon-after', 'href'],
  attributes: [
    'emphasis',
    'link',
    'styled',
    'toggle',
    'animated',
    'hover',
    'pressed',
    'focus',
    'active',
    'disabled',
    'loading',
    'size',
    'color',
    'basic',
    'social',
    'shape',
    'compact',
    'fluid',
    'inverted',
    'circular',
    'attached',
    'floated',
    'align',
    'icon-only',
    'icon-after',
    'icon',
    'image',
    'badge',
    'href',
  ],
  optionAttributes: {
    primary: 'emphasis',
    secondary: 'emphasis',
    tertiary: 'emphasis',
    positive: 'emphasis',
    negative: 'emphasis',
    warning: 'emphasis',
    link: 'link',
    styled: 'styled',
    toggle: 'toggle',
    mini: 'size',
    tiny: 'size',
    small: 'size',
    medium: 'size',
    large: 'size',
    big: 'size',
    huge: 'size',
    massive: 'size',
    red: 'color',
    orange: 'color',
    yellow: 'color',
    olive: 'color',
    green: 'color',
    teal: 'color',
    blue: 'color',
    violet: 'color',
    purple: 'color',
    pink: 'color',
    brown: 'color',
    grey: 'color',
    black: 'color',
    basic: 'basic',
    compact: 'compact',
    fluid: 'fluid',
    inverted: 'inverted',
    circular: 'circular',
    facebook: 'social',
    twitter: 'social',
    google: 'social',
    linkedin: 'social',
    youtube: 'social',
    instagram: 'social',
    vk: 'social',
    left: 'floated',
    right: 'floated',
    fade: 'animated',
    vertical: 'animated',
  },
  propertyTypes: {
    emphasis: 'string',
    link: 'boolean',
    styled: 'boolean',
    toggle: 'boolean',
    animated: 'string',
    hover: 'boolean',
    pressed: 'boolean',
    focus: 'boolean',
    active: 'boolean',
    disabled: 'boolean',
    loading: 'boolean',
    size: 'string',
    color: 'string',
    basic: 'boolean',
    social: 'string',
    shape: 'string',
    compact: 'boolean',
    fluid: 'boolean',
    inverted: 'boolean',
    circular: 'boolean',
    attached: 'string',
    floated: 'string',
    align: 'string',
    'icon-only': 'boolean',
    'icon-after': 'boolean',
    icon: 'string',
    image: 'string',
    badge: 'string',
    href: 'string',
  },
  allowedValues: {
    emphasis: ['primary', 'secondary', 'tertiary', 'positive', 'negative', 'warning'],
    size: ['mini', 'tiny', 'small', 'medium', 'large', 'big', 'huge', 'massive'],
    color: [
      'red',
      'orange',
      'yellow',
      'olive',
      'green',
      'teal',
      'blue',
      'violet',
      'purple',
      'pink',
      'brown',
      'grey',
      'black',
    ],
    social: ['facebook', 'twitter', 'google', 'linkedin', 'youtube', 'instagram', 'vk'],
    animated: ['animated', 'fade', 'vertical'],
    floated: ['left', 'right'],
    attached: ['top', 'bottom', 'left', 'right'],
    shape: ['rounded', 'pill'],
    align: ['left', 'center', 'right'],
  },
  attributeClasses: ['emphasis', 'size', 'color', 'social', 'shape', 'attached', 'floated', 'align'],
  defaultValues: { 'icon-only': false, 'icon-after': false, href: '' },
  inheritedPluralVariations: ['size', 'color', 'emphasis', 'compact', 'inverted', 'basic'],
});

/*----------------------------------------------
  Benchmark Runner
----------------------------------------------*/
const bench = (label, factory, ops) => {
  // Warmup
  for (let i = 0; i < 200; i++) {
    clone(factory());
    deepFreeze(factory());
  }

  const iterations = ops;

  // Single op: clone vs freeze
  const cloneInputs = Array.from({ length: iterations }, () => factory());
  const cloneStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    clone(cloneInputs[i]);
  }
  const cloneTime = performance.now() - cloneStart;

  const freezeInputs = Array.from({ length: iterations }, () => factory());
  const freezeStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    deepFreeze(freezeInputs[i]);
  }
  const freezeTime = performance.now() - freezeStart;

  // Signal lifecycle: 1 set + 5 reads
  const readInputsClone = Array.from({ length: iterations }, () => factory());
  const readCloneStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    const stored = clone(readInputsClone[i]);
    clone(stored);
    clone(stored);
    clone(stored);
    clone(stored);
    clone(stored);
  }
  const readCloneTime = performance.now() - readCloneStart;

  const readInputsFreeze = Array.from({ length: iterations }, () => factory());
  const readFreezeStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    deepFreeze(readInputsFreeze[i]);
    // reads are free — just reference returns
  }
  const readFreezeTime = performance.now() - readFreezeStart;

  const ratio = (cloneTime / freezeTime).toFixed(1);
  const readRatio = (readCloneTime / readFreezeTime).toFixed(1);
  const cloneUs = ((cloneTime / iterations) * 1000).toFixed(2);
  const freezeUs = ((freezeTime / iterations) * 1000).toFixed(2);

  console.log(`\n  ${label}`);
  console.log(`  ${'—'.repeat(60)}`);
  console.log(
    `  Single:       clone ${cloneTime.toFixed(1).padStart(7)}ms (${cloneUs}µs)  freeze ${
      freezeTime.toFixed(1).padStart(7)
    }ms (${freezeUs}µs)  ${ratio.padStart(4)}x`,
  );
  console.log(
    `  Set+5 reads:  clone ${readCloneTime.toFixed(1).padStart(7)}ms          freeze ${
      readFreezeTime.toFixed(1).padStart(7)
    }ms          ${readRatio.padStart(4)}x`,
  );
};

/*----------------------------------------------
  Run
----------------------------------------------*/
console.log(`\n  Freeze vs Clone — Real Semantic UI Component Data`);
console.log(`  ==================================================`);
console.log(`  "Single" = cost of one clone() or one deepFreeze()`);
console.log(`  "Set+5 reads" = 1 signal.set + 5 reaction reads`);
console.log(`    Clone: 6 deep clones | Freeze: 1 freeze, reads free\n`);

// Small states
bench('theme-switcher state (1 key, undefined)', makeThemeSwitcherState, 200_000);
bench('input spec defaults (6 keys, primitives)', makeInputDefaults, 200_000);

// Medium settings
bench('copy-button settings (7 keys + nested obj)', makeCopyButtonSettings, 100_000);
bench('mobile-menu state (4 keys, empty objs)', makeMobileMenuState, 100_000);
bench('mobile-menu state RUNTIME (nested menus)', makeMobileMenuStateRuntime, 50_000);

// Large state
bench('search state EMPTY (10 keys, empty arrays)', makeSearchStateEmpty, 100_000);
bench('search state POPULATED (20 results + display)', makeSearchStatePopulated, 2_000);

// Large settings
bench('tooltip settings (19 keys + callbacks)', makeTooltipSettings, 100_000);

// Spec objects
bench('button component spec (12 keys, 45+ map entries)', makeButtonSpec, 20_000);

console.log('');

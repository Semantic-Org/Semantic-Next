export const plasmaConfig = {
  colorFrom: '#00405C',
  colorTo: '#2b6fb6',
  colorShift: 0,
  fps: false,

  specularTint: '#1a99e6',
  specularPower: 1.5,
  specularAmbient: 0.2,

  speed: 0.2,
  density: 2.5,
  brightness: 1,
  resolution: 1,
  mouse: {
    light: 5,
    warp: 1.5,
  },
};

// Tour — instructive code excerpts, each paired with a live example render.
// Excerpts mirror the example source at docs/src/examples/component/{id}
export const tourExamples = {
  state: {
    lang: 'js',
    example: 'packing-list',
    code: `const events = {
  'click .item'({ state, data }) {
    state.items.toggleItemProperty(data.item.id, 'packed');
  },
  'keydown .new'({ state, event, value, target }) {
    if (event.key !== 'Enter' || !value.trim()) return;
    state.items.push({ id: generateID(), title: value, packed: false });
    target.value = '';
  },
  'click .pack'({ state }) {
    state.items.setProperty('packed', true);
  },
  'click .clear'({ state }) {
    state.items.filter((item) => !item.packed);
  },
};`,
  },
  templates: {
    lang: 'sui',
    example: 'async-search',
    code: `{#async getResults searchTerm as searchResults}
  {#if hasAny searchResults}
    {#each searchResults}
      <div class="{activeIf is index selectedIndex} result">
        {title}
      </div>
    {/each}
  {else}
    {>message type='noResults'}
  {/if}
{loading}
  {>message type='loading'}
{error as e}
  {>message type='error'}
{/async}`,
  },
  events: {
    lang: 'js',
    example: 'drag-dot',
    code: `const events = {
  'pointerdown .dot'({ state }) {
    state.dragging.set(true);
    return 'cancel';
  },
  'global pointermove body'({ $, state, event }) {
    if (!state.dragging.get()) return;
    const area = $('.area').bounds();
    state.x.set(event.clientX - area.left);
    state.y.set(event.clientY - area.top);
  },
  'global pointerup body'({ state }) {
    state.dragging.set(false);
  },
};`,
  },
  specs: {
    lang: 'js',
    code: `// button.spec.js
{
  name: 'Size',
  attribute: 'size',
  usageLevel: 1,
  description: 'vary in size',
  options: [
    { value: 'small', description: 'appear small' },
    { value: 'medium', description: 'appear normal sized' },
    { value: 'large', description: 'appear larger than normal' },
  ],
}`,
  },
};

// Hero demo — each step is a prompt + the resulting code/UI
export const demoSteps = [
  {
    prompt: 'Make a large delete button',
    cot: 'Creating button from spec',
    code: '<ui-button large>Delete</ui-button>',
    html: '<ui-button large>Delete</ui-button>',
  },
  {
    prompt: 'Add an icon',
    cot: 'Retrieving icon spec and adding icon',
    code: `<ui-button large>\n  <ui-icon delete></ui-icon>\n  Delete\n</ui-button>`,
    html: '<ui-button large><ui-icon delete></ui-icon>Delete</ui-button>',
  },
  {
    prompt: 'Add edit and save',
    cot: 'Lookup plural variation add additional icons',
    code:
      `<ui-buttons large>\n  <ui-button>\n    <ui-icon delete></ui-icon>\n    Delete\n  </ui-button>\n  <ui-button>\n    <ui-icon edit></ui-icon>\n    Edit\n  </ui-button>\n  <ui-button>\n    <ui-icon save></ui-icon>\n    Save\n  </ui-button>\n</ui-buttons>`,
    html:
      '<ui-buttons large><ui-button><ui-icon delete></ui-icon>Delete</ui-button><ui-button><ui-icon edit></ui-icon>Edit</ui-button><ui-button><ui-icon save></ui-icon>Save</ui-button></ui-buttons>',
  },
  {
    prompt: 'Emphasize save',
    cot: 'Adjusting button emphasis',
    code:
      `<ui-buttons large>\n  <ui-button subtle-negative>\n    <ui-icon delete></ui-icon>\n    Delete\n  </ui-button>\n  <ui-button>\n    <ui-icon edit></ui-icon>\n    Edit\n  </ui-button>\n  <ui-button primary>\n    <ui-icon save></ui-icon>\n    Save\n  </ui-button>\n</ui-buttons>`,
    html:
      '<ui-buttons large><ui-button subtle-negative><ui-icon delete></ui-icon>Delete</ui-button><ui-button><ui-icon edit></ui-icon>Edit</ui-button><ui-button primary><ui-icon save></ui-icon>Save</ui-button></ui-buttons>',
  },
];

import { defineComponent } from '@semantic-ui/component';
import { SpecReader } from '@semantic-ui/specs';

const css = '.box { padding: 8px; border: 1px solid #555; color: white; margin: 4px 0; }';

// Step 1: Static HTML only
export const Step1 = defineComponent({
  tagName: 'ssr-step-1',
  renderingEngine: 'native',
  template: '<div class="box">Hello World</div>',
  css,
});

// Step 2: Text expressions + settings override
export const Step2 = defineComponent({
  tagName: 'ssr-step-2',
  renderingEngine: 'native',
  template: '<div class="box">{greeting}, {name}!</div>',
  css,
  defaultSettings: { greeting: 'Hello', name: 'World' },
});

// Step 3: Attribute expressions
export const Step3 = defineComponent({
  tagName: 'ssr-step-3',
  renderingEngine: 'native',
  template: '<div class="box {theme}" data-count="{count}">{count} items</div>',
  css: css + ' .dark { background: #333; } .light { background: #999; }',
  defaultState: { theme: 'dark', count: 3 },
});

// Step 4: Single conditional
export const Step4 = defineComponent({
  tagName: 'ssr-step-4',
  renderingEngine: 'native',
  template:
    '<div class="box">{#if show}<span class="on">Visible</span>{else}<span class="off">Hidden</span>{/if}</div>',
  css: css + ' .on { color: #2ecc71; } .off { color: #e74c3c; }',
  defaultState: { show: true },
});

// Step 5: Each loop
export const Step5 = defineComponent({
  tagName: 'ssr-step-5',
  renderingEngine: 'native',
  template: '<ul class="box">{#each item in items}<li>{item}</li>{/each}</ul>',
  css: css + ' ul { list-style: none; padding-left: 0; }',
  defaultState: { items: ['Alpha', 'Beta', 'Gamma'] },
});

// Step 6: Snippet
export const Step6 = defineComponent({
  tagName: 'ssr-step-6',
  renderingEngine: 'native',
  template:
    '{#snippet tag}<span class="tag">[{label}]</span>{/snippet}<div class="box">{>tag label="One"} {>tag label="Two"}</div>',
  css: css + ' .tag { color: #f39c12; }',
});

// Step 7: Subtemplate
const childTpl = defineComponent({
  renderingEngine: 'native',
  template: '<em class="child">{msg}</em>',
});
export const Step7 = defineComponent({
  tagName: 'ssr-step-7',
  renderingEngine: 'native',
  template: '<div class="box">{>child msg="From subtemplate"}</div>',
  css: css + ' .child { color: #3498db; }',
  subTemplates: { child: childTpl },
});

// Step 8: Nested blocks (if > each)
export const Step8 = defineComponent({
  tagName: 'ssr-step-8',
  renderingEngine: 'native',
  template:
    '<div class="box">{#if show}<ul>{#each item in items}<li>{item}</li>{/each}</ul>{else}<p>Nothing</p>{/if}</div>',
  css: css + ' ul { list-style: none; padding-left: 0; }',
  defaultState: { show: true, items: ['X', 'Y', 'Z'] },
});

// Step 9: Async (loading state on server)
export const Step9 = defineComponent({
  tagName: 'ssr-step-9',
  renderingEngine: 'native',
  template:
    '{#async fetchData as result}<div class="box ok">{result}</div>{loading}<div class="box loading">Loading...</div>{/async}',
  css: css + ' .ok { color: #2ecc71; } .loading { color: #f39c12; }',
  createComponent: () => ({
    fetchData: () => new Promise(resolve => setTimeout(() => resolve('Loaded!'), 100)),
  }),
});

// Step 10: Rerender block
export const Step10 = defineComponent({
  tagName: 'ssr-step-10',
  renderingEngine: 'native',
  template: '<div class="box">{#rerender key}<span>Version: {key}</span>{/rerender}</div>',
  css,
  defaultState: { key: 0 },
});

// Step 11: Guard block
export const Step11 = defineComponent({
  tagName: 'ssr-step-11',
  renderingEngine: 'native',
  template: '<div class="box">{#guard getCategory}<span>Category: {getCategory}</span>{/guard}</div>',
  css,
  defaultState: { level: 'low' },
  createComponent: ({ state }) => ({
    getCategory: () => state.level.get() === 'high' ? 'premium' : 'basic',
  }),
});

// Step 12: Slot (default + named)
export const Step12 = defineComponent({
  tagName: 'ssr-step-12',
  renderingEngine: 'native',
  template: '<div class="box"><header>{>slot header}</header><main>{>slot}</main></div>',
  css: css + ' header { font-weight: bold; color: #f39c12; } main { color: #3498db; }',
});

// Step 13: Unsafe HTML
export const Step13 = defineComponent({
  tagName: 'ssr-step-13',
  renderingEngine: 'native',
  template: '<div class="box">{#html content}</div>',
  css,
  createComponent: () => ({
    content: '<b>Bold</b> and <i>italic</i>',
  }),
});

// Step 14: If with isClient/isServer
export const Step14 = defineComponent({
  tagName: 'ssr-step-14',
  renderingEngine: 'native',
  template:
    '<div class="box">{#if isServer}<span class="server">Server</span>{/if}{#if isClient}<span class="client">Client</span>{/if}</div>',
  css: css + ' .server { color: #e74c3c; } .client { color: #2ecc71; }',
});

// Step 15: Each with conditional per item
export const Step15 = defineComponent({
  tagName: 'ssr-step-15',
  renderingEngine: 'native',
  template:
    '{#each item in items}<div class="box">{#if item.active}<b>{item.name}</b>{else}<i>{item.name}</i>{/if}</div>{/each}',
  css: css + ' b { color: #2ecc71; } i { color: #e74c3c; }',
  createComponent: () => ({
    items: [
      { name: 'Alice', active: true },
      { name: 'Bob', active: false },
      { name: 'Carol', active: true },
    ],
  }),
});

// Step 16: Snippet inside each
export const Step16 = defineComponent({
  tagName: 'ssr-step-16',
  renderingEngine: 'native',
  template:
    '{#snippet badge}<span class="badge">[{label}]</span>{/snippet}{#each item in items}<div class="box">{>badge label=item.name}</div>{/each}',
  css: css + ' .badge { color: #f39c12; }',
  createComponent: () => ({
    items: [{ name: 'Red' }, { name: 'Green' }, { name: 'Blue' }],
  }),
});

// Step 17: Multi-branch conditional (if/else-if/else)
export const Step17 = defineComponent({
  tagName: 'ssr-step-17',
  renderingEngine: 'native',
  template:
    '<div class="box">{#if is mode "a"}<span>Mode A</span>{else if is mode "b"}<span>Mode B</span>{else}<span>Mode C</span>{/if}</div>',
  css,
  defaultState: { mode: 'b' },
});

// Step 18: Object iteration
export const Step18 = defineComponent({
  tagName: 'ssr-step-18',
  renderingEngine: 'native',
  template: '<div class="box">{#each val, key in colors}<span style="color:{val}">{key} </span>{/each}</div>',
  css,
  createComponent: () => ({
    colors: { red: '#e74c3c', green: '#2ecc71', blue: '#3498db' },
  }),
});

// Step 19: Spec-driven component with {ui} classes
const widgetSpec = new SpecReader({
  uiType: 'element',
  name: 'SSRWidget',
  tagName: 'ssr-step-19',
  types: [],
  states: [],
  variations: [
    {
      name: 'Size',
      attribute: 'size',
      options: [{ name: 'Small', value: 'small' }, { name: 'Large', value: 'large' }],
    },
    {
      name: 'Emphasis',
      attribute: 'emphasis',
      includeAttributeClass: true,
      options: [{ name: 'Primary', value: 'primary' }, { name: 'Secondary', value: 'secondary' }],
    },
  ],
  settings: [],
  events: [],
}).getWebComponentSpec();

export const Step19 = defineComponent({
  tagName: 'ssr-step-19',
  renderingEngine: 'native',
  componentSpec: widgetSpec,
  template: '<span class="{ui}widget"><slot></slot></span>',
  css: css + ' .widget { display: inline-block; } .primary { color: #3498db; } .large { font-size: 20px; }',
});

// Step 27: Post-hydration click event
export const Step27 = defineComponent({
  tagName: 'ssr-step-27',
  renderingEngine: 'native',
  template: '<div class="box"><button class="btn">{label}</button></div>',
  css: css + ' .btn { cursor: pointer; color: inherit; background: #444; border: 1px solid #777; padding: 4px 12px; }',
  defaultState: { label: 'Click me' },
  events: {
    'click .btn'({ state }) {
      state.label.set('Clicked!');
    },
  },
});

// Step 28: Post-hydration input reactivity
export const Step28 = defineComponent({
  tagName: 'ssr-step-28',
  renderingEngine: 'native',
  template: '<div class="box"><input class="inp" value={query} placeholder="Type..."> <span>{query}</span></div>',
  css: css + ' .inp { background: #333; color: white; border: 1px solid #777; padding: 4px; }',
  defaultState: { query: 'hello' },
  events: {
    'input .inp'({ state, value }) {
      state.query.set(value);
    },
  },
});

// Step 29: Post-hydration conditional toggle
export const Step29 = defineComponent({
  tagName: 'ssr-step-29',
  renderingEngine: 'native',
  template: '<div class="box"><button class="btn">{#if on}ON{else}OFF{/if}</button></div>',
  css: css + ' .btn { cursor: pointer; color: inherit; background: #444; border: 1px solid #777; padding: 4px 12px; }',
  defaultState: { on: true },
  events: {
    'click .btn'({ state }) {
      state.on.toggle();
    },
  },
});

// Step 30: Post-hydration each list update
export const Step30 = defineComponent({
  tagName: 'ssr-step-30',
  renderingEngine: 'native',
  template:
    '<div class="box"><ul>{#each item in items}<li>{item}</li>{/each}</ul><button class="btn">Add</button></div>',
  css: css
    + ' ul { list-style: none; padding: 0; margin: 0; } .btn { cursor: pointer; color: inherit; background: #444; border: 1px solid #777; padding: 4px 12px; }',
  defaultState: { items: ['A', 'B', 'C'] },
  events: {
    'click .btn'({ state }) {
      state.items.push('New');
    },
  },
});

// Step 31: Settings change after hydration
export const Step31 = defineComponent({
  tagName: 'ssr-step-31',
  renderingEngine: 'native',
  template: '<div class="box"><span class="val">{color}</span></div>',
  css: css + ' .val { font-weight: bold; }',
  defaultSettings: { color: 'red' },
});

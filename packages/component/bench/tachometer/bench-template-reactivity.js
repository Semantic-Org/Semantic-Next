/*
  Track A — fine-grained reactivity workloads. Pure client-mount, no
  SSR. Each metric drives a real mutation cycle that fires real
  Reactions doing real (small) work. Wall-clock is the only committed
  measurement. Some metrics measure a win available when an FGR fix
  closes a coarseness gap; others lock in current correct behavior so a
  future regression on per-expression isolation surfaces as a slower
  verdict.
*/

import { defineComponent } from '@semantic-ui/component';

const startMark = (name) => `${name}-start`;
const flush = () => new Promise((r) => requestAnimationFrame(r));

const container = document.createElement('div');
document.body.appendChild(container);

function destroy() {
  container.innerHTML = '';
}

/*******************************
      Component Definitions
*******************************/

const reactiveDataChild = defineComponent({
  renderingEngine: 'native',
  template: '<span>{label}</span><span>{status}</span>',
});

defineComponent({
  tagName: 'bench-reactivedata',
  renderingEngine: 'native',
  template: `{#each i in idxs}{> template name='child' reactiveData={label: getLabel, status: getStatus}}{/each}`,
  subTemplates: { child: reactiveDataChild },
  defaultState: { labelVal: 'init' },
  createComponent: ({ state }) => ({
    idxs: Array.from({ length: 100 }, (_, i) => i),
    getLabel: () => state.labelVal.get(),
    getStatus: () => 'static',
  }),
});

const shorthandChild = defineComponent({
  renderingEngine: 'native',
  template: '<span>{label}</span><span>{status}</span>',
});

defineComponent({
  tagName: 'bench-shorthand',
  renderingEngine: 'native',
  template: `{#each i in idxs}{>child label=getLabel status=getStatus}{/each}`,
  subTemplates: { child: shorthandChild },
  defaultState: { labelVal: 'init' },
  createComponent: ({ state }) => ({
    idxs: Array.from({ length: 100 }, (_, i) => i),
    getLabel: () => state.labelVal.get(),
    getStatus: () => 'static',
  }),
});

defineComponent({
  tagName: 'bench-snippet',
  renderingEngine: 'native',
  template: [
    '{#snippet card}',
    '<span>{label}</span>',
    '<span>{status}</span>',
    '{/snippet}',
    '{#each i in idxs}',
    '{>card label=getLabel status=getStatus}',
    '{/each}',
  ].join(''),
  defaultState: { labelVal: 'init' },
  createComponent: ({ state }) => ({
    idxs: Array.from({ length: 100 }, (_, i) => i),
    getLabel: () => state.labelVal.get(),
    getStatus: () => 'static',
  }),
});

defineComponent({
  tagName: 'bench-active-indicator',
  renderingEngine: 'native',
  template: `{#each item in items}<span class="{maybeActive item.id}">{item.id}</span>{/each}`,
  defaultState: { selectedId: 0 },
  createComponent: ({ state }) => ({
    items: Array.from({ length: 200 }, (_, i) => ({ id: i })),
    maybeActive: (id) => state.selectedId.get() === id ? 'active' : '',
  }),
});

defineComponent({
  tagName: 'bench-stable-ref',
  renderingEngine: 'native',
  template: `{#each item in items}<span>{item.label}</span>{/each}`,
  defaultState: {
    items: {
      value: Array.from({ length: 500 }, (_, i) => ({ id: i, label: `item-${i}` })),
      options: { allowClone: false, safety: 'reference' },
    },
  },
});

const dataBlobChild = defineComponent({
  renderingEngine: 'native',
  template: '<span>{label}</span><span>{status}</span>',
});

defineComponent({
  tagName: 'bench-data-blob',
  renderingEngine: 'native',
  template: `{#each i in idxs}{>child data=getCardData}{/each}`,
  subTemplates: { child: dataBlobChild },
  defaultState: { labelVal: 'init' },
  createComponent: ({ state }) => ({
    idxs: Array.from({ length: 100 }, (_, i) => i),
    getCardData: () => ({ label: state.labelVal.get(), status: 'static' }),
  }),
});

// Card subtemplate that defines a snippet internally and invokes it
// four times. Distinct from `bench-snippet`'s top-level snippet — the
// surrounding subtemplate has receivesData: true, which is the only
// place dataDep gets attached to inner snippet Reactions today.
const cardWithBadge = defineComponent({
  renderingEngine: 'native',
  template: [
    '{#snippet badge}',
    '<span class="badge">{text}</span>',
    '{/snippet}',
    '<span class="title">{title}</span>',
    "{>badge text='Active'}",
    "{>badge text='Verified'}",
    "{>badge text='Premium'}",
    "{>badge text='Featured'}",
  ].join(''),
});

defineComponent({
  tagName: 'bench-snippet-in-subtemplate',
  renderingEngine: 'native',
  template: `{#each i in idxs}{>card title=getTitle}{/each}`,
  subTemplates: { card: cardWithBadge },
  defaultState: { titleVal: 'init' },
  createComponent: ({ state }) => ({
    idxs: Array.from({ length: 25 }, (_, i) => i),
    getTitle: () => state.titleVal.get(),
  }),
});

// 3-deep nested #each anchored to nav-menu's actual structure
// (section → page → subpage). External currentUrl signal feeds a
// helper called on each leaf — the same shape nav-menu uses for its
// active highlight. 5 × 10 × 4 = 200 leaf anchors.
const buildNavSections = () => {
  const sections = new Array(5);
  for (let s = 0; s < 5; s++) {
    const pages = new Array(10);
    for (let p = 0; p < 10; p++) {
      const subpages = new Array(4);
      for (let sp = 0; sp < 4; sp++) {
        subpages[sp] = { url: `/s${s}/p${p}/sp${sp}`, name: `sp${sp}` };
      }
      pages[p] = { name: `p${p}`, subpages };
    }
    sections[s] = { name: `s${s}`, pages };
  }
  return sections;
};

defineComponent({
  tagName: 'bench-active-indicator-nested',
  renderingEngine: 'native',
  template:
    `{#each section in sections}<section><h3>{section.name}</h3>{#each page in section.pages}<div><span>{page.name}</span>{#each subpage in page.subpages}<a class="{maybeActive subpage.url}">{subpage.name}</a>{/each}</div>{/each}</section>{/each}`,
  defaultState: { currentUrl: '/' },
  createComponent: ({ state }) => ({
    sections: buildNavSections(),
    maybeActive: (url) => state.currentUrl.get() === url ? 'active' : '',
  }),
});

// 1000-item flat each with five fields per item. Mount-only, no
// mutations. Items signal stays at framework defaults so the
// workload represents the path a typical author takes when
// declaring a list without hand-tuning Signal options. Measures
// per-record creation and Signal allocation cost on mount.
defineComponent({
  tagName: 'bench-each-mount',
  renderingEngine: 'native',
  template:
    `{#each item in items}<div><span>{item.a}</span><span>{item.b}</span><span>{item.c}</span><span>{item.d}</span><span>{item.e}</span></div>{/each}`,
  defaultState: {
    items: Array.from({ length: 1000 }, (_, i) => ({
      id: `id-${i}`,
      a: `a${i}`,
      b: `b${i}`,
      c: `c${i}`,
      d: `d${i}`,
      e: `e${i}`,
    })),
  },
});

/*******************************
      Bench Runner
*******************************/

async function mount(tagName) {
  const el = document.createElement(tagName);
  container.appendChild(el);
  await flush();
  return el;
}

/*******************************
      Subtemplate reactiveData
*******************************/

// purpose: Mutates one verbose reactiveData field across 100 child subtemplates. Only the changed field re-evaluates.
const el1 = await mount('bench-reactivedata');
performance.mark(startMark('subtemplate-reactive-data-100'));
for (let i = 0; i < 50; i++) {
  el1.template.state.labelVal.set(`v${i}`);
  await flush();
}
performance.measure('subtemplate-reactive-data-100', startMark('subtemplate-reactive-data-100'));
destroy();

/*******************************
      Subtemplate shorthand props
*******************************/

// purpose: Mutates one shorthand prop's source across 100 child subtemplates. Only that prop re-evaluates.
const el2 = await mount('bench-shorthand');
performance.mark(startMark('subtemplate-shorthand-props-100'));
for (let i = 0; i < 50; i++) {
  el2.template.state.labelVal.set(`v${i}`);
  await flush();
}
performance.measure('subtemplate-shorthand-props-100', startMark('subtemplate-shorthand-props-100'));
destroy();

/*******************************
      Snippet args
*******************************/

// purpose: Mutates one snippet arg's source across 100 invocations. Adjacent no-signal expressions stay quiet.
const el3 = await mount('bench-snippet');
performance.mark(startMark('snippet-args-per-key-100'));
for (let i = 0; i < 50; i++) {
  el3.template.state.labelVal.set(`v${i}`);
  await flush();
}
performance.measure('snippet-args-per-key-100', startMark('snippet-args-per-key-100'));
destroy();

/*******************************
      Active indicator
*******************************/

// purpose: Cycles selectedId across 200 list items. Only the previously and newly active items update their class.
const el4 = await mount('bench-active-indicator');
performance.mark(startMark('active-indicator-200'));
for (let i = 0; i < 100; i++) {
  el4.template.state.selectedId.set(i + 1);
  await flush();
}
performance.measure('active-indicator-200', startMark('active-indicator-200'));
destroy();

/*******************************
      Stable-ref item mutate
*******************************/

// purpose: Replaces one item by index in a 500-item list across 100 cycles. Only that item's expressions re-render.
const el5 = await mount('bench-stable-ref');
performance.mark(startMark('stable-ref-mutate-500'));
for (let i = 0; i < 100; i++) {
  const idx = i % 500;
  el5.template.state.items.setIndex(idx, { id: idx, label: `updated-${i}` });
  await flush();
}
performance.measure('stable-ref-mutate-500', startMark('stable-ref-mutate-500'));
destroy();

/*******************************
      Subtemplate data blob
*******************************/

// purpose: Mutates one field inside data=expression on 100 children. Every child re-renders by design.
const el7 = await mount('bench-data-blob');
performance.mark(startMark('subtemplate-data-blob-100'));
for (let i = 0; i < 50; i++) {
  el7.template.state.labelVal.set(`v${i}`);
  await flush();
}
performance.measure('subtemplate-data-blob-100', startMark('subtemplate-data-blob-100'));
destroy();

/*******************************
      Snippet inside subtemplate
*******************************/

// purpose: Mutates one subtemplate prop's source across 25 cards each invoking 4 inner snippets. Snippet bodies should stay quiet.
const el8 = await mount('bench-snippet-in-subtemplate');
performance.mark(startMark('snippet-in-subtemplate-100'));
for (let i = 0; i < 50; i++) {
  el8.template.state.titleVal.set(`v${i}`);
  await flush();
}
performance.measure('snippet-in-subtemplate-100', startMark('snippet-in-subtemplate-100'));
destroy();

/*******************************
      Active indicator nested
*******************************/

// purpose: Cycles currentUrl through 50 leaf urls in a 5×10×4 nav. Only the previously and newly active leaves should update their class.
const el9 = await mount('bench-active-indicator-nested');
performance.mark(startMark('active-indicator-nested-200'));
for (let i = 0; i < 50; i++) {
  const s = i % 5;
  const p = Math.floor(i / 5) % 10;
  const sp = i % 4;
  el9.template.state.currentUrl.set(`/s${s}/p${p}/sp${sp}`);
  await flush();
}
performance.measure('active-indicator-nested-200', startMark('active-indicator-nested-200'));
destroy();

/*******************************
      Each mount
*******************************/

// Mark before createElement so the timer captures the entire mount
// path: connectedCallback, fullRender, Renderer construction,
// parseHTML, bindMarkers, and the each block's per-record creation.
// No mutation cycle follows. Only mount cost is measured.
// purpose: Mounts a fresh 1000-item each block with five-field items so per-record allocation cost dominates the wall clock.
performance.mark(startMark('each-mount-1000'));
const el10 = document.createElement('bench-each-mount');
container.appendChild(el10);
await flush();
performance.measure('each-mount-1000', startMark('each-mount-1000'));
destroy();

/*******************************
      Results
*******************************/

performance.getEntriesByType('measure')
  .forEach((m) => console.log(`${m.name}: ${m.duration.toFixed(3)}ms`));

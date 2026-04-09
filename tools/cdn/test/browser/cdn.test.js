import { beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

const CDN = 'https://cdn.semantic-ui.com';
const VERSION = 'canary';

/**
 * Load components via a combo endpoint URL and wait for them to register.
 * Mirrors real user usage: a single script tag pointing at the live CDN.
 */
async function loadComponents(comboPath, tags) {
  // Add CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${CDN}/css@${VERSION}`;
  document.head.appendChild(link);

  // Add combo script — exactly what a user would do
  const script = document.createElement('script');
  script.type = 'module';
  script.src = `${CDN}/core@${VERSION}/${comboPath}`;
  document.head.appendChild(script);

  // Wait for all components to register
  await Promise.all(tags.map(tag => customElements.whenDefined(tag)));
}

describe('CDN Combo Endpoint', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('button,input — interactive components', async () => {
    document.body.innerHTML = `
      <ui-button primary>Primary</ui-button>
      <ui-button secondary>Secondary</ui-button>
      <ui-input placeholder="Type here..."></ui-input>
    `;
    await loadComponents('button,input', ['ui-button', 'ui-input']);

    const button = document.querySelector('ui-button');
    await expect.element(page.elementLocator(button)).toBeVisible();
    expect(button.shadowRoot).toBeTruthy();
  });

  it('icon,label,spinner — display components', async () => {
    document.body.innerHTML = `
      <ui-icon icon="star"></ui-icon>
      <ui-label>Default</ui-label>
      <ui-label primary>Primary</ui-label>
      <ui-spinner></ui-spinner>
    `;
    await loadComponents('icon,label,spinner', ['ui-icon', 'ui-label', 'ui-spinner']);

    const icon = document.querySelector('ui-icon');
    await expect.element(page.elementLocator(icon)).toBeVisible();
    expect(icon.shadowRoot).toBeTruthy();
  });

  it('container,segment,divider,card — layout components', async () => {
    document.body.innerHTML = `
      <ui-container>
        <ui-segment>Segment inside container</ui-segment>
        <ui-divider></ui-divider>
        <ui-card>
          <div slot="header">Card Title</div>
          <div slot="content">Card content</div>
        </ui-card>
      </ui-container>
    `;
    await loadComponents(
      'container,segment,divider,card',
      ['ui-container', 'ui-segment', 'ui-divider', 'ui-card'],
    );

    const segment = document.querySelector('ui-segment');
    await expect.element(page.elementLocator(segment)).toBeVisible();
    expect(segment.shadowRoot).toBeTruthy();
  });

  it('table,menu — data and navigation components', async () => {
    document.body.innerHTML = `
      <ui-table>
        <table>
          <thead><tr><th>Name</th><th>Status</th></tr></thead>
          <tbody><tr><td>Test</td><td>Pass</td></tr></tbody>
        </table>
      </ui-table>
      <ui-menu>
        <a>Item 1</a>
        <a>Item 2</a>
      </ui-menu>
    `;
    await loadComponents('table,menu', ['ui-table', 'ui-menu']);

    const table = document.querySelector('ui-table');
    await expect.element(page.elementLocator(table)).toBeVisible();
  });

  it('modal,image — overlay and media components', async () => {
    document.body.innerHTML = `
      <ui-image src="https://placehold.co/150x100"></ui-image>
      <ui-modal>
        <div slot="header">Test Modal</div>
        <div slot="content">Modal content</div>
      </ui-modal>
    `;
    await loadComponents('modal,image', ['ui-modal', 'ui-image']);

    const image = document.querySelector('ui-image');
    await expect.element(page.elementLocator(image)).toBeVisible();

    const modal = document.querySelector('ui-modal');
    expect(modal.shadowRoot).toBeTruthy();
  });
});

describe('CDN Cross-Category Combo', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('primitive + component in one combo', async () => {
    document.body.innerHTML = `
      <ui-button primary>Click</ui-button>
      <ui-panels><div>A</div><div>B</div></ui-panels>
    `;
    await loadComponents('button,panels', ['ui-button', 'ui-panels']);

    const button = document.querySelector('ui-button');
    expect(button.shadowRoot).toBeTruthy();

    const panels = document.querySelector('ui-panels');
    expect(panels.shadowRoot).toBeTruthy();
  });
});

describe('CDN Presets', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('standard preset loads all standard components', async () => {
    document.body.innerHTML = `
      <ui-button>Button</ui-button>
      <ui-input placeholder="Input"></ui-input>
      <ui-icon icon="star"></ui-icon>
    `;
    await loadComponents('standard', [
      'ui-button',
      'ui-input',
      'ui-icon',
      'ui-label',
      'ui-image',
      'ui-spinner',
      'ui-container',
      'ui-segment',
      'ui-divider',
      'ui-card',
      'ui-table',
      'ui-menu',
      'ui-modal',
    ]);

    const button = document.querySelector('ui-button');
    await expect.element(page.elementLocator(button)).toBeVisible();
    expect(button.shadowRoot).toBeTruthy();
  });

  it('extended preset loads all extended components', async () => {
    document.body.innerHTML = '<ui-button>Button</ui-button>';
    await loadComponents('extended', ['ui-button']);

    const button = document.querySelector('ui-button');
    await expect.element(page.elementLocator(button)).toBeVisible();
  });

  it('full preset loads all components', async () => {
    document.body.innerHTML = '<ui-button>Button</ui-button>';
    await loadComponents('full', ['ui-button']);

    const button = document.querySelector('ui-button');
    await expect.element(page.elementLocator(button)).toBeVisible();
  });
});

describe('CDN Combo Response', () => {
  it('shim contains correct export lines', async () => {
    const res = await fetch(`${CDN}/core@${VERSION}/button,input`);
    expect(res.ok).toBe(true);
    expect(res.headers.get('content-type')).toContain('javascript');

    const body = await res.text();
    expect(body).toContain(`export * from "${CDN}/core@${VERSION}/button.min.js"`);
    expect(body).toContain(`export * from "${CDN}/core@${VERSION}/input.min.js"`);
    // Exactly 2 export lines
    const exports = body.trim().split('\n');
    expect(exports.length).toBe(2);
  });

  it('preset resolves to multiple components', async () => {
    const res = await fetch(`${CDN}/core@${VERSION}/standard`);
    expect(res.ok).toBe(true);

    const body = await res.text();
    const exports = body.trim().split('\n');
    expect(exports.length).toBeGreaterThan(5);
    expect(body).toContain('button.min.js');
    expect(body).toContain('input.min.js');
  });
});

describe('CDN Vendor Chain', () => {
  it('vendor lit package loads without bare imports', async () => {
    const res = await fetch(`${CDN}/vendor/lit@3.3.2/index.js`);
    expect(res.ok).toBe(true);

    const body = await res.text();
    // All imports should be rewritten to full CDN URLs
    const imports = [...body.matchAll(/(?:import|from)\s*["']([^"']+)["']/g)];
    for (const match of imports) {
      const specifier = match[1];
      // Skip comments (license blocks)
      if (match.index > 0 && body[match.index - 1] === '*') { continue; }
      expect(specifier, `bare import found: ${specifier}`).toMatch(/^https:\/\//);
    }
  });

  it('reactive-element loads correctly', async () => {
    const res = await fetch(`${CDN}/vendor/@lit/reactive-element@2.1.1/reactive-element.js`);
    expect(res.ok).toBe(true);
    expect(res.headers.get('content-type')).toContain('javascript');
  });
});

describe('CDN Sourcemaps', () => {
  it('JS entry point — SourceMap header points to valid map', async () => {
    const res = await fetch(`${CDN}/component@${VERSION}`);
    expect(res.ok).toBe(true);

    const sourceMap = res.headers.get('SourceMap');
    expect(sourceMap, 'missing SourceMap header').toBeTruthy();
    expect(sourceMap).toContain(`component@${VERSION}/`);
    expect(sourceMap).toMatch(/\.js\.map$/);

    // Follow the header URL — map must be accessible
    const mapRes = await fetch(new URL(sourceMap, CDN).href);
    expect(mapRes.ok, `map 404: ${sourceMap}`).toBe(true);
    expect(mapRes.headers.get('content-type')).toContain('json');
  });

  it('JS sub-path file — map file accessible via relative path', async () => {
    const mapRes = await fetch(`${CDN}/core@${VERSION}/button.min.js.map`);
    expect(mapRes.ok).toBe(true);
    expect(mapRes.headers.get('content-type')).toContain('json');
  });

  it('CSS endpoint — SourceMap header points to valid map', async () => {
    const res = await fetch(`${CDN}/css@${VERSION}`);
    expect(res.ok).toBe(true);

    const sourceMap = res.headers.get('SourceMap');
    expect(sourceMap, 'missing SourceMap header').toBeTruthy();
    expect(sourceMap).toMatch(/\.map$/);

    // Follow the header URL — map must be accessible
    const mapRes = await fetch(new URL(sourceMap, CDN).href);
    expect(mapRes.ok, `map 404: ${sourceMap}`).toBe(true);
    expect(mapRes.headers.get('content-type')).toContain('json');
  });

  it('CSS legacy alias — SourceMap header points to valid map', async () => {
    const res = await fetch(`${CDN}/semantic-ui@${VERSION}.css`);
    expect(res.ok).toBe(true);

    const sourceMap = res.headers.get('SourceMap');
    expect(sourceMap, 'missing SourceMap header').toBeTruthy();

    const mapRes = await fetch(new URL(sourceMap, CDN).href);
    expect(mapRes.ok, `map 404: ${sourceMap}`).toBe(true);
  });

  it('CSS inline sourceMappingURL is rewritten to versioned path', async () => {
    const res = await fetch(`${CDN}/css@${VERSION}`);
    const body = await res.text();
    expect(body).toContain(`sourceMappingURL=/css@${VERSION}.map`);
    expect(body).not.toContain('sourceMappingURL=semantic-ui.min.css.map');
  });

  it('sourcemap responses contain valid JSON with sourcesContent', async () => {
    const mapRes = await fetch(`${CDN}/component@${VERSION}/component.min.js.map`);
    expect(mapRes.ok).toBe(true);

    const map = await mapRes.json();
    expect(map.version).toBe(3);
    expect(map.sources).toBeInstanceOf(Array);
    expect(map.sourcesContent).toBeInstanceOf(Array);
    expect(map.sourcesContent.length).toBe(map.sources.length);
  });
});

describe('CDN Endpoints (non-combo)', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('individual component file still works', async () => {
    document.body.innerHTML = '<ui-button>Button</ui-button>';

    const script = document.createElement('script');
    script.type = 'module';
    script.src = `${CDN}/core@${VERSION}/button.min.js`;
    document.head.appendChild(script);

    await customElements.whenDefined('ui-button');

    const button = document.querySelector('ui-button');
    expect(button.shadowRoot).toBeTruthy();
  });

  it('bare package URL serves entry point', async () => {
    const res = await fetch(`${CDN}/core@${VERSION}`);
    expect(res.ok).toBe(true);
    expect(res.headers.get('content-type')).toContain('javascript');

    const body = await res.text();
    expect(body).toContain('@semantic-ui/core');
  });

  it('CSS endpoint returns stylesheet', async () => {
    const res = await fetch(`${CDN}/css@${VERSION}`);
    expect(res.ok).toBe(true);
    expect(res.headers.get('content-type')).toContain('text/css');
  });

  it('import map endpoint returns JS', async () => {
    const res = await fetch(`${CDN}/importmap@${VERSION}.js`);
    expect(res.ok).toBe(true);
    expect(res.headers.get('content-type')).toContain('javascript');
  });
});

/*----------------------------------------------
  Loader endpoint (/load)
----------------------------------------------*/

/**
 * Inject the loader script and wait for it to execute.
 * Returns the import map and injected link elements for verification.
 */
async function injectLoader(attrs) {
  const script = document.createElement('script');
  script.src = `${CDN}/load`;
  for (const [key, value] of Object.entries(attrs)) {
    if (value === true) {
      script.setAttribute(key, '');
    }
    else {
      script.setAttribute(key, value);
    }
  }

  return new Promise((resolve) => {
    script.onload = () => {
      // Give the loader a tick to inject elements
      setTimeout(() => {
        const importMap = document.querySelector('script[type="importmap"]');
        const links = [...document.querySelectorAll('link[rel="stylesheet"]')];
        resolve({ importMap, links });
      }, 50);
    };
    document.head.appendChild(script);
  });
}

describe('CDN Loader', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('/load serves valid JavaScript', async () => {
    const res = await fetch(`${CDN}/load`);
    expect(res.ok).toBe(true);
    expect(res.headers.get('content-type')).toContain('javascript');
  });

  it('components="button" — auto-injects tokens, icons, fonts', async () => {
    document.body.innerHTML = '<ui-button primary>Test</ui-button>';
    const { importMap, links } = await injectLoader({ version: VERSION, components: 'button' });

    expect(importMap, 'import map injected').toBeTruthy();

    const hrefs = links.map(l => l.href);
    expect(hrefs.some(h => h.includes('/css@')), 'tokens CSS').toBe(true);
    expect(hrefs.some(h => h.includes('/icons@')), 'icons CSS').toBe(true);
    expect(hrefs.some(h => h.includes('/fonts@')), 'fonts CSS').toBe(true);

    await customElements.whenDefined('ui-button');
    const button = document.querySelector('ui-button');
    expect(button.shadowRoot).toBeTruthy();
  });

  it('components="standard" — preset loads components', async () => {
    document.body.innerHTML = '<ui-button>Test</ui-button><ui-input></ui-input>';
    await injectLoader({ version: VERSION, components: 'standard' });

    await customElements.whenDefined('ui-button');
    await customElements.whenDefined('ui-input');

    const button = document.querySelector('ui-button');
    expect(button.shadowRoot).toBeTruthy();
  });

  it('authoring — injects tokens, no icons or fonts', async () => {
    const { links } = await injectLoader({ version: VERSION, authoring: true });

    const hrefs = links.map(l => l.href);
    expect(hrefs.some(h => h.includes('/css@') && h.includes('/tokens')), 'tokens CSS').toBe(true);
    expect(hrefs.some(h => h.includes('/icons@')), 'no icons').toBe(false);
    expect(hrefs.some(h => h.includes('/fonts@')), 'no fonts').toBe(false);
  });

  it('reactivity — no CSS injected', async () => {
    const { links } = await injectLoader({ version: VERSION, reactivity: true });
    expect(links.length, 'no CSS links').toBe(0);
  });

  it('css (bare) — injects full page styles', async () => {
    const { links } = await injectLoader({ version: VERSION, components: 'button', css: true });

    const hrefs = links.map(l => l.href);
    // Full CSS (not tokens sub-layer)
    const cssLink = hrefs.find(h =>
      h.includes('/css@') && !h.includes('/tokens') && !h.includes('/icons') && !h.includes('/fonts')
    );
    expect(cssLink, 'full CSS').toBeTruthy();
  });

  it('css="tokens" — injects tokens only', async () => {
    const { links } = await injectLoader({ version: VERSION, components: 'button', css: 'tokens' });

    const hrefs = links.map(l => l.href);
    expect(hrefs.some(h => h.includes('/tokens')), 'tokens sub-layer').toBe(true);
  });

  it('css="none" — suppresses all CSS', async () => {
    const { links } = await injectLoader({ version: VERSION, components: 'button', css: 'none' });

    const hrefs = links.map(l => l.href);
    expect(hrefs.some(h => h.includes('/css@')), 'no CSS').toBe(false);
  });

  it('icons="none" — suppresses icon injection', async () => {
    const { links } = await injectLoader({ version: VERSION, components: 'button', icons: 'none' });

    const hrefs = links.map(l => l.href);
    expect(hrefs.some(h => h.includes('/icons@')), 'no icons').toBe(false);
  });

  it('import map merge — existing map preserved', async () => {
    // Add a user import map first
    const userMap = document.createElement('script');
    userMap.type = 'importmap';
    userMap.textContent = JSON.stringify({ imports: { 'my-lib': 'https://example.com/my-lib.js' } });
    document.head.appendChild(userMap);

    const { importMap } = await injectLoader({ version: VERSION, reactivity: true });

    // SUI map is a separate element (browsers merge natively)
    const maps = document.querySelectorAll('script[type="importmap"]');
    expect(maps.length).toBe(2);

    const suiMap = JSON.parse(maps[1].textContent);
    expect(suiMap.imports['@semantic-ui/reactivity']).toContain('reactivity@');
  });
});

describe('CDN Loader — Version Validation', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('version="bogus" — logs error, no resources injected', async () => {
    const errors = [];
    const origError = console.error;
    console.error = (...args) => errors.push(args.join(' '));

    await injectLoader({ version: 'bogus', components: 'button' });

    console.error = origError;

    expect(errors.some(e => e.includes('Invalid version')), 'error logged').toBe(true);

    // No import map or CSS should be injected
    const maps = document.querySelectorAll('script[type="importmap"]');
    expect(maps.length).toBe(0);

    const links = document.querySelectorAll('link[rel="stylesheet"]');
    expect(links.length).toBe(0);
  });
});

describe('CDN CSS Sub-Layers', () => {
  it('/css@canary/tokens — serves CSS', async () => {
    const res = await fetch(`${CDN}/css@${VERSION}/tokens`);
    expect(res.ok).toBe(true);
    expect(res.headers.get('content-type')).toContain('text/css');

    const body = await res.text();
    expect(body).toContain('--primary-color');
  });

  it('/css@canary/reset — serves CSS', async () => {
    const res = await fetch(`${CDN}/css@${VERSION}/reset`);
    expect(res.ok).toBe(true);
    expect(res.headers.get('content-type')).toContain('text/css');
  });

  it('/css@canary/base — serves CSS', async () => {
    const res = await fetch(`${CDN}/css@${VERSION}/base`);
    expect(res.ok).toBe(true);
    expect(res.headers.get('content-type')).toContain('text/css');
  });
});

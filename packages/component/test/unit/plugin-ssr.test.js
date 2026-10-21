import { afterEach, describe, expect, it } from 'vitest';
import { clearExtendedParams, clearRegisteredPlugins, clearUserPlugins } from '../../src/plugins/index.js';
import { addPlugin, defineComponent, registerPlugin, renderToString } from '../../src/server/index.js';

afterEach(() => {
  clearUserPlugins();
  clearRegisteredPlugins();
  clearExtendedParams();
});

describe('Component Plugins (SSR)', () => {
  it('runs plugin initialize, lifecycleParams, and templateHelpers during renderToString', () => {
    const I18n = registerPlugin({
      namespace: 'i18n',
      defaultSettings: {
        locale: 'fr',
        strings: {
          fr: { greeting: 'Bonjour' },
        },
      },
      createPlugin: ({ settings }) => ({
        t(key) {
          return settings.strings?.[settings.locale]?.[key] ?? key;
        },
      }),
      lifecycleParams: ({ self, settings }) => ({
        t: self.t,
        get locale() {
          return settings.locale;
        },
      }),
      templateHelpers: ({ self, settings }) => ({
        t: self.t,
        get locale() {
          return settings.locale;
        },
      }),
    });

    addPlugin(I18n);

    const Banner = defineComponent({
      tagName: 'ssr-plugin-banner',
      template: "<h1>{t 'greeting'} ({locale}) - {serverFlag}</h1>",
      createComponent({ isServer, t }) {
        return {
          serverFlag: isServer ? t('greeting').toUpperCase() : 'client',
        };
      },
    });

    const html = renderToString(Banner);
    expect(html).toContain('Bonjour');
    expect(html).toContain('fr');
    expect(html).toContain('BONJOUR');
  });
});

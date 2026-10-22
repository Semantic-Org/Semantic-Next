import { afterEach, describe, expect, it } from 'vitest';
import {
  clearAvailablePlugins,
  clearExtendedData,
  clearExtendedParams,
  clearRegisteredPlugins,
} from '../../src/plugins/index.js';
import { addPlugin, defineComponent, extendData, registerPlugin, renderToString } from '../../src/server/index.js';

afterEach(() => {
  clearAvailablePlugins();
  clearRegisteredPlugins();
  clearExtendedData();
  clearExtendedParams();
});

describe('Component Plugins (SSR)', () => {
  it('runs plugin initialize, lifecycleParams, templateData, and templateHelpers during renderToString', () => {
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
      templateData: ({ settings }) => ({
        get locale() {
          return settings.locale;
        },
      }),
      templateHelpers: ({ self }) => ({
        t: self.t,
      }),
    });

    addPlugin(I18n);
    extendData({
      user: { name: 'Claire' },
    });

    const Banner = defineComponent({
      tagName: 'ssr-plugin-banner',
      template: "<h1>{t 'greeting'} {user.name} ({#if is locale 'fr'}FR{else}EN{/if}) - {serverFlag}</h1>",
      createComponent({ isServer, t }) {
        return {
          serverFlag: isServer ? t('greeting').toUpperCase() : 'client',
        };
      },
    });

    const html = renderToString(Banner);
    expect(html).toContain('Bonjour');
    expect(html).toContain('Claire');
    expect(html).toContain('FR');
    expect(html).not.toContain('EN');
    expect(html).toContain('BONJOUR');
  });
});

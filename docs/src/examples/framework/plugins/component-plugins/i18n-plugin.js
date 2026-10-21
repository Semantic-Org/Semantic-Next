import { registerPlugin } from '@semantic-ui/component';
import { get, isString } from '@semantic-ui/utils';

export const I18n = registerPlugin({
  namespace: 'i18n',

  defaultSettings: {
    locale: 'en',
    strings: {},
    prefix: '',
  },

  resolveSettings({ settings, config }) {
    if (isString(config)) {
      return { ...settings, prefix: config };
    }
    return settings;
  },

  createPlugin({ settings }) {
    return {
      t(key) {
        const { locale, prefix, strings } = settings;
        const path = prefix ? `${prefix}.${key}` : key;
        return get(strings[locale], path) ?? key;
      },
      setLocale(locale) {
        settings.locale = locale;
      },
    };
  },

  lifecycleParams({ self }) {
    return { t: self.t, i18n: self };
  },

  templateHelpers({ self }) {
    return { t: self.t };
  },
});

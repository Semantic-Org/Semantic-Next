import { registerPlugin } from '@semantic-ui/component';
import { get, isString } from '@semantic-ui/utils';

const defaultSettings = {
  locale: 'en',
  strings: {},
  prefix: '',
};

// allow shorthand config like i18n: 'checkout'
const resolveSettings = ({ settings, config }) => {
  if (isString(config)) {
    settings.prefix = config;
  }
};

const createPlugin = ({ settings }) => ({
  t(key) {
    const { locale, prefix, strings } = settings;
    const path = prefix ? `${prefix}.${key}` : key;
    return get(strings[locale], path) ?? key;
  },
  setLocale(locale) {
    // updating reactive plugin settings re-renders subscribed components
    settings.locale = locale;
  },
});

// expose { t, i18n } in component callbacks
const lifecycleParams = ({ self }) => ({
  t: self.t,
  i18n: self,
});

// expose { locale } in template expressions
const templateData = ({ settings }) => ({
  get locale() {
    return settings.locale;
  },
});

// expose {t 'key'} helper in component templates
const templateHelpers = ({ self }) => ({
  t: self.t,
});

export const I18n = registerPlugin({
  namespace: 'i18n',
  defaultSettings,
  resolveSettings,
  createPlugin,
  lifecycleParams,
  templateData,
  templateHelpers,
});

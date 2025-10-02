import { dump, FAILSAFE_SCHEMA } from 'js-yaml';

import { i18n } from './common';
import { JSONObject, set } from './utils';

function getDiff(locale: string, diffWith?: string) {
  const diff: JSONObject = {};
  // Use Set for O(1) lookup instead of O(n) with includes()
  const diffKeysSet = new Set(i18n.getAllKeysForLocale(diffWith));
  for (const key of i18n.getAllKeysForLocale(locale)) {
    if (diffKeysSet.has(key)) {
      set(diff, key, i18n.getTranslation(key));
    }
  }

  return diff;
}

function getCachedFormatter(
  type: 'json' | 'yml',
  format: (translations: JSONObject) => string,
) {
  function cacheEntry(locale: string, namespace?: string, diffWith?: string) {
    if (typeof namespace === 'string' && namespace) {
      return {
        key: `_${type}${namespace}`,
        get: () =>
          format({
            _namespace: namespace,
            ...((i18n.getTranslations(namespace, locale) as object) || {}),
          }),
      };
    }

    if (typeof diffWith === 'string' && diffWith) {
      return {
        key: `_${type}_diff_${diffWith}`,
        get: () => format(getDiff(locale, diffWith)),
      };
    }

    return {
      key: `_${type}`,
      get: () => format((i18n._translations[locale] as JSONObject) || {}),
    };
  }

  return function cached(
    locale: string,
    namespace?: string,
    diffWith?: string,
  ) {
    const localeCache = i18n.getCache(locale) as unknown as Record<
      string,
      string
    >;
    const { get, key } = cacheEntry(locale, namespace, diffWith);
    if (!(key in localeCache)) {
      localeCache[key] = get();
    }

    return localeCache[key];
  };
}

export function getAddCachedTranslationsJS(
  locale: string,
  data: string,
  namespace?: string,
) {
  return `(Package['universe:i18n'].i18n).addTranslations('${locale}', ${
    namespace ? `'${namespace}', ` : ''
  }${data}),Package['universe:i18n'].i18n._ts = Math.max(Package['universe:i18n'].i18n._ts, ${Date.now()});`;
}

export const getJSON = getCachedFormatter('json', object =>
  JSON.stringify(object),
);

export const getYML = getCachedFormatter('yml', object =>
  dump(object, {
    indent: 2,
    noCompatMode: true,
    schema: FAILSAFE_SCHEMA,
    skipInvalid: true,
    sortKeys: true,
  }),
);

export function getJS(locale: string, namespace?: string, isBefore?: boolean) {
  const json = getJSON(locale, namespace);
  if (json.length <= 2 && !isBefore) {
    return '';
  }

  return isBefore
    ? `var w=this||window;w.__uniI18nPre=w.__uniI18nPre||{};w.__uniI18nPre['${locale}${
        namespace ? `.${namespace}` : ''
      }'] = ${json}`
    : getAddCachedTranslationsJS(locale, json, namespace);
}
